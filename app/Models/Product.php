<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected static function booted()
    {
        static::creating(function ($product) {
            if (!$product->created_by) $product->created_by = auth()->id();
            if (!$product->updated_by) $product->updated_by = auth()->id();
        });

        static::updating(function ($product) {
            if (!$product->updated_by) $product->updated_by = auth()->id();
        });
    }

    protected $with = ['creator:id,name', 'updater:id,name'];

    protected $fillable = [
        'category_id',
        'title',
        'description',
        'image_path',
        'is_new',
        'show_on_home',
        'status',
        'published_at',
        'start_date',
        'end_date',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'is_new' => 'boolean',
        'published_at' => 'datetime',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function promotions()
    {
        return $this->belongsToMany(Promotion::class, 'product_promotion');
    }
}
