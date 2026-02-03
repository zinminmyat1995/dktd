<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Services\ImageStorageService;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class PromotionController extends Controller
{
    public function index()
    {
        return Inertia::render('Promotions/List', [
            'categories' => Category::orderBy('name')->get(),
            'products'   => \App\Models\Product::orderBy('title')->get(['id', 'title', 'category_id']),
        ]);
    }

    public function store(Request $request, ImageStorageService $imgService)
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'product_ids' => ['nullable', 'array'],
            'product_ids.*' => ['exists:products,id'],
            'title'       => ['required', 'string', 'max:255', 'unique:promotions,title'],
            'description' => ['required', 'string'],
            'image'       => ['nullable', 'image', 'max:5120'],
            'type'        => ['required', 'in:promotion,news'],
            'status'      => ['required', 'in:draft,published,archived'],
            'start_date'  => ['required_if:type,promotion', 'nullable', 'date'],
            'end_date'    => ['required_if:type,promotion', 'nullable', 'date', 'after_or_equal:start_date'],
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $imgService->store($request->file('image'), 'promotions');
        }

        $promotion = Promotion::create([
            'category_id' => $validated['category_id'] ?? null,
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'image_path'  => $imagePath,
            'type'        => $validated['type'],
            'status'      => $validated['status'],
            'start_date'  => $validated['start_date'] ?? null,
            'end_date'    => $validated['end_date'] ?? null,
            'created_by'  => $request->user()->id,
            'updated_by'  => $request->user()->id,
        ]);

        if (!empty($validated['product_ids'])) {
            $promotion->products()->sync($validated['product_ids']);
        }

        return response()->json([
            'ok' => true,
            'message' => 'Created successfully.',
            'data' => $promotion->load(['category:id,name', 'products:id,title,category_id', 'creator:id,name', 'updater:id,name']),
        ], 201);
    }

    public function data(Request $req)
    {
        $q        = $req->q;
        $category = $req->category_id;
        $product  = $req->product_id;
        $status   = $req->status;
        $type     = $req->type;
        $perPage  = $req->per_page ?? 10;

        $query = Promotion::query()
            ->with(['category:id,name', 'products:id,title,category_id', 'creator:id,name', 'updater:id,name']);

        if ($q) {
            $query->where(function ($qq) use ($q) {
                $qq->where('title', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            });
        }

        if ($category) $query->where('category_id', $category);
        
        if ($product) {
            $query->whereHas('products', function ($q) use ($product) {
                $q->where('product_id', $product);
            });
        }
        
        if ($status) $query->where('status', $status);
        if ($type) $query->where('type', $type);

        $query->latest();

        return response()->json($query->paginate($perPage));
    }

    public function show(Promotion $promotion)
    {
        return response()->json([
            'ok' => true,
            'data' => $promotion->load(['category:id,name', 'products:id,title,category_id', 'creator:id,name', 'updater:id,name']),
        ]);
    }

    public function update(Request $request, Promotion $promotion, ImageStorageService $imgService)
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'product_ids' => ['nullable', 'array'],
            'product_ids.*' => ['exists:products,id'],
            'title'       => [
                'required', 'string', 'max:255',
                Rule::unique('promotions', 'title')->ignore($promotion->id),
            ],
            'description' => ['required', 'string'],
            'image'       => ['nullable', 'image', 'max:5120'],
            'type'        => ['required', 'in:promotion,news'],
            'status'      => ['required', 'in:draft,published,archived'],
            'start_date'  => ['required_if:type,promotion', 'nullable', 'date'],
            'end_date'    => ['required_if:type,promotion', 'nullable', 'date', 'after_or_equal:start_date'],
        ]);

        $imagePath = $imgService->storeReplace(
            $request->file('image'),
            $promotion->image_path,
            'promotions'
        );

        $promotion->update([
            'category_id' => $validated['category_id'] ?? null,
            'title'       => $validated['title'],
            'description' => $validated['description'] ?? null,
            'image_path'  => $imagePath,
            'type'        => $validated['type'],
            'status'      => $validated['status'],
            'start_date'  => $validated['start_date'] ?? null,
            'end_date'    => $validated['end_date'] ?? null,
            'updated_by'  => $request->user()->id,
        ]);

        if (isset($validated['product_ids'])) {
            $promotion->products()->sync($validated['product_ids']);
        }

        return response()->json([
            'ok' => true,
            'message' => "Updated successfully.",
            'data' => $promotion->fresh()->load(['category:id,name', 'products:id,title,category_id', 'creator:id,name', 'updater:id,name']),
        ]);
    }

    public function destroy(Promotion $promotion, ImageStorageService $imgService)
    {
        // Delete the image using the centralized service
        $imgService->deleteOld($promotion->image_path);

        $promotion->delete();

        return response()->json([
            'ok' => true,
            'message' => 'Deleted successfully.',
        ]);
    }
}
