<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Services\ImageStorageService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Products/List', [
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create', [
            'categories' => Category::select('id','name')->get(),
        ]);
    }


    public function store(Request $request, ImageStorageService $imgService, \App\Services\ProductService $productService)
    {
        $validated = $request->validate([
            'category_id'   => ['nullable', 'exists:categories,id'],
            'title'         => ['required', 'string', 'max:255', 'unique:products,title'],
            'description'   => ['nullable', 'string'],
            'image'         => ['nullable', 'image', 'max:5120'],
            'is_new'        => ['boolean'],
            'show_on_home'  => ['boolean'],
            'status'        => ['required', 'in:draft,published,archived'],
            'published_at'  => ['nullable', 'date'],
            'start_date'    => ['nullable', 'date'],
            'end_date'      => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $imgService->store($request->file('image'), 'products');
        }

        try {
            // Start a database transaction to ensure data consistency
            return \DB::transaction(function () use ($validated, $imagePath, $productService) {
                // If show_on_home is true, we need to update the existing home page products
                $showOnHome = $validated['show_on_home'] ?? false;
                $showOnHomeValue = 0;
                
                if ($showOnHome) {
                    // Use service to rotate products and get the new position
                    $showOnHomeValue = $productService->rotateHomeProducts();
                }
                
                // Create the new product
                $product = Product::create([
                    'category_id'  => $validated['category_id'] ?? null,
                    'title'        => $validated['title'],
                    'description'  => $validated['description'] ?? null,
                    'image_path'   => $imagePath,
                    'is_new'       => $validated['is_new'] ?? false,
                    'show_on_home' => $showOnHomeValue,
                    'status'       => $validated['status'],
                    'published_at' => $validated['published_at'] ?? null,
                    'start_date'   => $validated['start_date'] ?? null,
                    'end_date'     => $validated['end_date'] ?? null,
                    'created_by'   => auth()->id(),
                ]);
                
                return response()->json([
                    'ok' => true,
                    'message' => 'Product created successfully.',
                    'data' => $product->load(['category:id,name', 'creator:id,name', 'updater:id,name']),
                ], 201);
            });

        } catch (\Exception $e) {
            // If DB transaction failed, delete the image we just uploaded so it doesn't become an orphan
            if ($imagePath) {
                $imgService->deleteOld($imagePath);
            }
            throw $e;
        }
    }

    public function data(Request $req)
    {
        $q        = $req->q;
        $category = $req->category_id;
        $status   = $req->status;
        $sortBy   = $req->sort_by ?? "updated_at";
        $sortDir  = $req->sort_dir ?? "desc";
        $perPage  = $req->per_page ?? 10;

        $query = Product::query()
            ->with(['category:id,name', 'creator:id,name', 'updater:id,name', 'promotions']);

        if ($q) {
            $query->where(function ($qq) use ($q) {
                $qq->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            });
        }

        if ($category) $query->where('category_id', $category);
        if ($status) $query->where('status', $status);

        $query->orderBy('title');

        return response()->json($query->paginate($perPage));
    }

    // ✅ Product detail for modal edit
    public function show(Product $product)
    {
        $product->load(['category:id,name', 'creator:id,name', 'updater:id,name']);

        return response()->json([
            'ok' => true,
            'data' => $product,
        ]);
    }

    // ✅ Update product (from modal)
    public function update(Request $request, Product $product, ImageStorageService $imgService)
    {
        $validated = $request->validate([
            'category_id'   => ['nullable', 'exists:categories,id'],
            'title'         => [
                'required', 'string', 'max:255',
                Rule::unique('products', 'title')->ignore($product->id),
            ],
            'description'   => ['nullable', 'string'],
            'image'         => ['nullable', 'image', 'max:5120'],
            'is_new'        => ['boolean'],
            'status'        => ['required', 'in:draft,published,archived'],
            'published_at'  => ['nullable', 'date'],
        ]);

        $oldImageFn = $product->image_path;
        $newImageFn = null;

        if ($request->file('image')) {
            $newImageFn = $imgService->store($request->file('image'), 'products');
        }

        try {
            $product->update([
                'category_id'  => $validated['category_id'] ?? null,
                'title'        => $validated['title'],
                'description'  => $validated['description'] ?? null,
                'image_path'   => $newImageFn ?? $oldImageFn,  // Use new image if uploaded, else keep old
                'is_new'       => $validated['is_new'] ?? false,
                'status'       => $validated['status'],
                'published_at' => $validated['published_at'] ?? null,
                'updated_by'   => auth()->id(),
            ]);

            // If update successful & new image uploaded, delete the old one
            if ($newImageFn && $oldImageFn) {
                $imgService->deleteOld($oldImageFn);
            }

            return response()->json([
                'ok' => true,
                'message' => "Product updated successfully.",
                'data' => $product->fresh()->load(['category:id,name', 'creator:id,name', 'updater:id,name']),
            ]);

        } catch (\Exception $e) {
            // Transaction failed (or update failed): delete the NEW image we just uploaded
            if ($newImageFn) {
                $imgService->deleteOld($newImageFn);
            }
            throw $e;
        }
    }

    public function destroy(Product $product, ImageStorageService $imgService)
    {
        // Delete the image using the centralized service
        $imgService->deleteOld($product->image_path);

        $product->delete();

        return response()->json([
            'ok' => true,
            'message' => 'Product deleted successfully.',
        ]);
    }

    public function allIds(Request $request)
    {
        $q = $request->q;
        $categoryId = $request->category_id;
        $status = $request->status;

        $query = Product::query();

        if ($q) {
            $query->where(function($x) use ($q){
                $x->where('title', 'like', "%$q%")
                ->orWhere('description', 'like', "%$q%");
            });
        }

        if ($categoryId) $query->where('category_id', $categoryId);
        if ($status) $query->where('status', $status);

        $ids = $query->pluck('id');

        return response()->json([
            'ids' => $ids,
        ]);
    }


    public function homeSelected()
    {
        $products = \App\Models\Product::query()
            ->where('show_on_home', '>', 0)
            ->orderBy('show_on_home', 'asc')
            ->get()
            ->sortBy('show_on_home')
            ->pluck('id')
            ->values();

        return response()->json([
            'ids' => $products,
        ]);
    }

    public function home(Request $request, \App\Services\ProductService $productService)
    {
        $data = $request->validate([
            'product_ids' => ['nullable', 'array'],
            'product_ids.*' => ['integer', 'exists:products,id'],
        ]);

        $ids = $data['product_ids'] ?? [];

        if (count($ids) > 3) {
            return response()->json([
                'ok' => false,
                'message' => 'You can select maximum 3 products for Home page.',
            ], 422);
        }

        $productService->setHomeProducts($ids);

        return response()->json([
            'ok' => true,
            'message' => empty($ids)
                ? 'Home products cleared successfully.'
                : 'Home products updated successfully.',
        ]);
    }


}
