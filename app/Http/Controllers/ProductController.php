<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Services\ImageStorageService;

class ProductController extends Controller
{
    public function create()
    {
        return inertia('Products/Create');
    }

    public function store(Request $request, ImageStorageService $imgService)
    {
        $validated = $request->validate([
            'category_id'   => ['nullable', 'exists:categories,id'],
            'title'         => ['required', 'string', 'max:255'],
            'description'   => ['nullable', 'string'],
            'image'         => ['nullable', 'image', 'max:5120'], // 5MB
            'is_new'        => ['boolean'],
            'status'        => ['required', 'in:draft,published,archived'],
            'published_at'  => ['nullable', 'date'],
            'start_date'    => ['nullable', 'date'],
            'end_date'      => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        // ✅ Use ImageStorageService (same as Menu project)
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
            'message' => 'Product created successfully.',
            'data' => $product,
        ], 201);
    }
}
