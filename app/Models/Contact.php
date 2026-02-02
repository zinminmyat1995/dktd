<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contact extends Model
{
    protected $table = 'contacts';

    protected $fillable = [
        'full_name',
        'email',
        'status',           // 0=pending, 1=replied
        'last_message_at',
        'last_replied_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
        'last_replied_at' => 'datetime',
    ];

    public const STATUS_PENDING = 0;
    public const STATUS_REPLIED = 1;

    public function messages(): HasMany
    {
        return $this->hasMany(ContactMessage::class, 'contact_id');
    }
}
