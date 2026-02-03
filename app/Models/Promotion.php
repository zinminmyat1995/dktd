<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected static function booted()
    {
        static::creating(function ($model) {
            if (!$model->created_by) $model->created_by = auth()->id();
            if (!$model->updated_by) $model->updated_by = auth()->id();
        });

        static::updating(function ($model) {
            if (!$model->updated_by) $model->updated_by = auth()->id();
        });
    }

    protected $with = ['creator:id,name', 'updater:id,name', 'products:id,title,category_id'];

    protected $fillable = [
        'title',
        'description',
        'image_path',
        'type',
        'category_id',
        'start_date',
        'end_date',
        'status',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_promotion');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
