<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->string('installments_group_id')->nullable()->after('reference_date');
            $table->unsignedInteger('installment_number')->nullable()->after('installments_group_id');
            $table->unsignedInteger('total_installments')->nullable()->after('installment_number');
            $table->boolean('is_installment')->default(false)->after('total_installments');
            
            $table->index('installments_group_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex(['installments_group_id']);
            $table->dropColumn(['installments_group_id', 'installment_number', 'total_installments', 'is_installment']);
        });
    }
};
