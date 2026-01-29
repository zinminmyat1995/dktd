<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductService
{
    /**
     * Handle the rotation of home page products when a new product is added with show_on_home = true.
     * Logic: Limit to 3 items. If full, remove the last (oldest/rightmost) one.
     * Shift existing items up (position + 1) to make room for the new one at position 1.
     *
     * @return int The position for the new product (usually 1).
     */
    public function rotateHomeProducts(): int
    {
        // Get the current home page products ordered by show_on_home (ascending)
        $currentHomeProducts = Product::where('show_on_home', '>', 0)
            ->orderBy('show_on_home')
            ->get();

        // If we already have 3 products, remove the last one (oldest/rightmost)
        if ($currentHomeProducts->count() >= 3) {
            $lastProduct = $currentHomeProducts->last();
            if ($lastProduct) {
                $lastProduct->update(['show_on_home' => 0]);
                // Remove the last item from the collection locally
                $currentHomeProducts->pop();
            }
        }

        // Shift all existing products up by 1 to make room for the new one
        foreach ($currentHomeProducts as $product) {
            $product->update(['show_on_home' => $product->show_on_home + 1]);
        }

        // The new product will be at position 1 (leftmost)
        return 1;
    }

    /**
     * Set the exact list of products to show on the home page.
     * Max 3 items allowed.
     *
     * @param array $productIds Array of product IDs.
     * @return void
     * @throws \Exception
     */
    public function setHomeProducts(array $productIds): void
    {
        if (count($productIds) > 3) {
            throw new \Exception('You can select maximum 3 products for Home page.');
        }

        DB::transaction(function () use ($productIds) {
            // Reset all currently shown products
            Product::query()->where('show_on_home', '>', 0)->update([
                'show_on_home' => 0,
                'updated_by'   => auth()->id(),
            ]);

            // Reverse the array so the newest selection (at the end of the input array)
            // gets position 1 (leftmost when ordered ASC)
            $reversedIds = array_reverse($productIds);

            foreach ($reversedIds as $index => $id) {
                // Assign position in order (first item in reversed array gets position 1)
                $position = $index + 1;
                Product::where('id', $id)->update([
                    'show_on_home' => $position,
                    'updated_by'   => auth()->id(),
                ]);
            }
        });
    }
}
