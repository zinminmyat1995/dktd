<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('products', 'show_on_home')) {
            Schema::table('products', function (Blueprint $table) {
                $table->unsignedTinyInteger('show_on_home')->default(0)->after('is_new');
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('products', 'show_on_home')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('show_on_home');
            });
        }
    }
};
