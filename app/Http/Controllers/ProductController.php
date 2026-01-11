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


    public function store(Request $request, ImageStorageService $imgService)
    {
        $validated = $request->validate([
            'category_id'   => ['nullable', 'exists:categories,id'],
            'title'         => ['required', 'string', 'max:255', 'unique:products,title'],
            'description'   => ['nullable', 'string'],
            'image'         => ['nullable', 'image', 'max:5120'],
            'is_new'        => ['boolean'],
            'status'        => ['required', 'in:draft,published,archived'],
            'published_at'  => ['nullable', 'date'],
            'start_date'    => ['nullable', 'date'],
            'end_date'      => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $imgService->store($request->file('image'), 'products');
        }

        $product = Product::create([
            'category_id'  => $validated['category_id'] ?? null,
            'title'        => $validated['title'],
            'description'  => $validated['description'] ?? null,
            'image_path'   => $imagePath,
            'is_new'       => $validated['is_new'] ?? false,
            'status'       => $validated['status'],
            'published_at' => $validated['published_at'] ?? null,
            'start_date'   => $validated['start_date'] ?? null,
            'end_date'     => $validated['end_date'] ?? null,
        ]);

        return response()->json([
            'ok' => true,
            'message' => 'Product created successfully.',
            'data' => $product,
        ], 201);
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
            ->with('category:id,name');

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
        $product->load('category:id,name');

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

        // ✅ replace image (new file + delete old file)
        $imagePath = $imgService->storeReplace(
            $request->file('image'),       // new image file (nullable)
            $product->image_path,          // old path
            'products'                     // folder name
        );

        $product->update([
            'category_id'  => $validated['category_id'] ?? null,
            'title'        => $validated['title'],
            'description'  => $validated['description'] ?? null,
            'image_path'   => $imagePath,  // ✅ new path or old path (if no new image)
            'is_new'       => $validated['is_new'] ?? false,
            'status'       => $validated['status'],
            'published_at' => $validated['published_at'] ?? null,
        ]);

        return response()->json([
            'ok' => true,
            'message' => "Product updated successfully.",
            'data' => $product->fresh()->load('category:id,name'),
        ]);
    }

    public function destroy(Product $product)
    {
        if ($product->image_path) {

            $path = $product->image_path;

            // ✅ If stored as "/storage/xxx", convert to "xxx"
            if (str_starts_with($path, '/storage/')) {
                $path = str_replace('/storage/', '', $path);
            }

            // ✅ If stored as full URL, extract only relative part
            if (str_starts_with($path, 'http')) {
                $parsed = parse_url($path);
                $path = $parsed['path'] ?? $path;

                if (str_starts_with($path, '/storage/')) {
                    $path = str_replace('/storage/', '', $path);
                }
            }

            // ✅ check file exists + delete
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }

        $product->delete();

        return response()->json([
            'ok' => true,
            'message' => 'Product deleted successfully.',
        ]);
    }

    public function promotion(Request $request)
    {
        $data = $request->validate([
            'product_ids' => ['required', 'array'],
            'product_ids.*' => ['integer', 'exists:products,id'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);

        // ✅ If start_date and end_date both null => clear promotion
        \App\Models\Product::whereIn('id', $data['product_ids'])->update([
            'start_date' => $data['start_date'] ?? null,
            'end_date'   => $data['end_date'] ?? null,
        ]);

        return response()->json([
            'ok' => true,
            'message' => ($data['start_date'] && $data['end_date'])
                ? 'Promotion updated successfully.'
                : 'Promotion cleared successfully.',
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


}
