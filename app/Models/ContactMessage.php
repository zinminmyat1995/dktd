<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactMessage extends Model
{
    protected $table = 'contact_messages';

    protected $fillable = [
        'contact_id',
        'status',     // 0=user, 1=admin
        'message',
        'admin_id',
    ];

    public const FROM_USER  = 0;
    public const FROM_ADMIN = 1;

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }
}
