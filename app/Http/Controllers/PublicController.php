<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home()
    {
        $products = Product::where('status', 'published')
            ->where('show_on_home', '>', 0)
            ->orderBy('show_on_home', 'asc')
            ->take(3)
            ->get();

        $promotions = \App\Models\Promotion::where('status', 'published')
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('Home', [
            'products' => $products,
            'promotions' => $promotions
        ]);
    }

    public function about()
    {
        return Inertia::render('About');
    }

    public function products()
    {
        $categoryId = request()->query('category');
        
        $products = Product::where('status', 'published')
            ->when($categoryId, function($query, $categoryId) {
                return $query->where('category_id', $categoryId);
            })
            ->latest()
            ->paginate(9)
            ->withQueryString();

        $categories = \App\Models\Category::where('is_active', true)->get(['id', 'name']);

        return Inertia::render('Products', [
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'category' => $categoryId
            ]
        ]);
    }

    public function show(Product $product)
    {
        if ($product->status !== 'published') {
            abort(404);
        }

        return Inertia::render('ProductDetail', [
            'product' => $product->load('category:id,name')
        ]);
    }

    public function promotion()
    {
        $promotions = \App\Models\Promotion::where('status', 'published')
            ->latest()
            ->paginate(10);

        return Inertia::render('Promotion', [
            'promotions' => $promotions
        ]);
    }

    public function contact()
    {
        return Inertia::render('Contact');
    }

    public function promotionDetail(\App\Models\Promotion $promotion)
    {
        if ($promotion->status !== 'published') {
            abort(404);
        }

        return Inertia::render('PromotionDetail', [
            'promotion' => $promotion->load('category:id,name')
        ]);
    }
}
