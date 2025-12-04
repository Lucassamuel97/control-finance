<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'category_id',
        'type',
        'frequency',
        'description',
        'amount',
        'reference_date',
        'installments_group_id',
        'installment_number',
        'total_installments',
        'is_installment',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'reference_date' => 'date',
        'amount' => 'decimal:2',
        'is_installment' => 'boolean',
        'installment_number' => 'integer',
        'total_installments' => 'integer',
    ];

    /**
     * Get the user that owns the transaction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the category that the transaction belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get all installments from the same group.
     */
    public function installmentSiblings()
    {
        if (!$this->is_installment || !$this->installments_group_id) {
            return collect([]);
        }

        return static::where('installments_group_id', $this->installments_group_id)
            ->orderBy('installment_number')
            ->get();
    }

    /**
     * Check if this is an installment transaction.
     */
    public function isInstallment(): bool
    {
        return $this->is_installment === true;
    }

    /**
     * Get formatted installment label (e.g., "1/4").
     */
    public function getInstallmentLabelAttribute(): ?string
    {
        if (!$this->is_installment) {
            return null;
        }

        return "{$this->installment_number}/{$this->total_installments}";
    }
}
