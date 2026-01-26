<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
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

    protected $with = ['creator:id,name', 'updater:id,name'];

    protected $fillable = [
        'name',
        'is_active',
        'created_by',
        'updated_by',
    ];

    public function products()
    {
        return $this->hasMany(Product::class);
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
