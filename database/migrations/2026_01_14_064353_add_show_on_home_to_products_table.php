<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // show_on_home: 0/1, default false
            $table->boolean('show_on_home')
                ->default(false)
                ->after('status'); // place it near status (adjust if you want)
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('show_on_home');
        });
    }
};
