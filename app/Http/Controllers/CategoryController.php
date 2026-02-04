<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Category::with(['creator:id,name', 'updater:id,name'])->orderBy('name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'is_active' => ['boolean'],
        ]);

        $category = Category::create([
            'name' => $validated['name'],
            'is_active' => $validated['is_active'] ?? true,
            'created_by' => auth()->id(),
        ])->load(['creator:id,name', 'updater:id,name']);

        return response()->json([
            'message' => 'Category created.',
            'data' => $category,
        ], 201);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => [
                'required', 'string', 'max:255',
                Rule::unique('categories', 'name')->ignore($category->id),
            ],
            'is_active' => ['boolean'],
        ]);

        $category->update([
            'name' => $validated['name'],
            'is_active' => $validated['is_active'] ?? $category->is_active,
            'updated_by' => auth()->id(),
        ]);

        $category->load(['creator:id,name', 'updater:id,name']);

        return response()->json([
            'message' => 'Category updated.',
            'data' => $category,
        ]);
    }

    public function destroy(Category $category)
    {
        // prevent delete if it has products
        if ($category->products()->exists()) {
            return response()->json([
                'message' => 'This category has products. Cannot delete.'
            ], 422);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted.'
        ]);
    }
}
