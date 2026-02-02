<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->bigIncrements('id');

            $table->unsignedBigInteger('contact_id')->index();

            /**
             * contact_messages.status
             * 0 = message from user
             * 1 = message from admin
             */
            $table->unsignedTinyInteger('status')->default(0)->index();

            $table->text('message');

            // if admin message, store who replied (optional)
            $table->unsignedBigInteger('admin_id')->nullable()->index();

            $table->timestamps();

            $table->foreign('contact_id')
                ->references('id')
                ->on('contacts')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_messages');
    }
};
