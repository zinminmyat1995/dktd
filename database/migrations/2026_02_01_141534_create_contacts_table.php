<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->bigIncrements('id');

            // user info only
            $table->string('full_name')->nullable();
            $table->string('email')->nullable();

            /**
             * contacts.status
             * 0 = pending  (user sent message, admin not replied yet)
             * 1 = replied  (admin already replied)
             */
            $table->unsignedTinyInteger('status')->default(0)->index();


            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
