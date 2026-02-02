<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Contact;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactInquiry;
use Illuminate\Support\Facades\DB;
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

        $latestNewsId = \App\Models\Promotion::where('type', 'news')->latest()->value('id');

        return Inertia::render('Home', [
            'products' => $products,
            'promotions' => $promotions,
            'latestNewsId' => $latestNewsId
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
        $type = request()->query('type');
        $today = \Carbon\Carbon::today();

        $promotions = \App\Models\Promotion::query()
            ->where('status', 'published')
            ->when($type, function ($query, $type) {
                return $query->where('type', $type);
            })
            ->latest()
            ->paginate(6)
            ->withQueryString();

        $latestNewsId = \App\Models\Promotion::query()
            ->where('status', 'published')
            ->where('type', 'news')
            ->latest()
            ->value('id');

        return Inertia::render('Promotion', [
            'promotions' => $promotions,
            'filters' => [
                'type' => $type
            ],
            'latestNewsId' => $latestNewsId
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

    public function storeContact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'description' => 'required|string',
        ]);
        
        try {
            DB::beginTransaction();

            // Check if contact exists
            $contact = Contact::where('email', $validated['email'])->first();

            if ($contact) {
                // Update existing contact
                $contact->update([
                    'full_name' => $validated['name'], // Update name just in case
                    'status' => Contact::STATUS_PENDING, // 0
                    
                ]);
            } else {
                // Create new contact
                $contact = Contact::create([
                    'full_name' => $validated['name'],
                    'email' => $validated['email'],
                    'status' => Contact::STATUS_PENDING, // 0
                    
                ]);
            }

            // Create message
            ContactMessage::create([
                'contact_id' => $contact->id,
                'status' => ContactMessage::FROM_USER, // 0
                'message' => $validated['description'],
                'admin_id' => null, // Public user
            ]);

            DB::commit();

            // Send Email
            try {
                $recipient = config('mail.receiver.address');
                
                $mailData = [
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'message' => $validated['description']
                ];

                if ($recipient) {
                    Mail::to($recipient)->send(new ContactInquiry($mailData));
                }
            } catch (\Exception $e) {
                Log::error('Failed to send contact email: ' . $e->getMessage());
                // We don't fail the request if email fails, but we log it.
            }

            return back()->with('success', 'Message sent successfully!');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Contact form error: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Something went wrong. Please try again.']);
        }
    }
}
