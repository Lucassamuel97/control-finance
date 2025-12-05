<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FixedTransactionTest extends TestCase
{
    use RefreshDatabase;

    public function test_criar_transacao_fixa_cria_12_transacoes_mensais(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create([
            'user_id' => $user->id,
            'type' => 'income',
        ]);

        $response = $this->actingAs($user)->post(route('transactions.store'), [
            'category_id' => $category->id,
            'type' => 'income',
            'frequency' => 'fixed',
            'description' => 'Salário',
            'amount' => 5000.00,
            'reference_date' => '2025-01-01',
        ]);

        $response->assertRedirect(route('transactions.index'));
        $response->assertSessionHas('success', '12 transações fixas criadas com sucesso.');

        // Verifica se foram criadas 12 transações
        $this->assertEquals(12, Transaction::where('user_id', $user->id)->count());

        // Verifica se todas têm o mesmo group_id
        $transactions = Transaction::where('user_id', $user->id)->get();
        $groupId = $transactions->first()->installments_group_id;
        $this->assertNotNull($groupId);
        
        foreach ($transactions as $transaction) {
            $this->assertEquals($groupId, $transaction->installments_group_id);
            $this->assertEquals('fixed', $transaction->frequency);
            $this->assertEquals(5000.00, $transaction->amount);
            $this->assertEquals('Salário', $transaction->description);
            $this->assertFalse($transaction->is_installment);
        }

        // Verifica se as datas estão corretas (uma por mês)
        $this->assertEquals('2025-01-01', $transactions[0]->reference_date->format('Y-m-d'));
        $this->assertEquals('2025-02-01', $transactions[1]->reference_date->format('Y-m-d'));
        $this->assertEquals('2025-12-01', $transactions[11]->reference_date->format('Y-m-d'));
    }

    public function test_criar_transacao_variavel_cria_apenas_uma_transacao(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create([
            'user_id' => $user->id,
            'type' => 'expense',
        ]);

        $response = $this->actingAs($user)->post(route('transactions.store'), [
            'category_id' => $category->id,
            'type' => 'expense',
            'frequency' => 'variable',
            'description' => 'Compra supermercado',
            'amount' => 250.00,
            'reference_date' => '2025-01-15',
        ]);

        $response->assertRedirect(route('transactions.index'));
        $response->assertSessionHas('success', 'Transação criada com sucesso.');

        // Verifica se foi criada apenas 1 transação
        $this->assertEquals(1, Transaction::where('user_id', $user->id)->count());
    }

    public function test_criar_transacao_fixa_do_tipo_despesa(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create([
            'user_id' => $user->id,
            'type' => 'expense',
        ]);

        $response = $this->actingAs($user)->post(route('transactions.store'), [
            'category_id' => $category->id,
            'type' => 'expense',
            'frequency' => 'fixed',
            'description' => 'Internet',
            'amount' => 100.00,
            'reference_date' => '2025-01-10',
        ]);

        $response->assertRedirect(route('transactions.index'));
        $response->assertSessionHas('success', '12 transações fixas criadas com sucesso.');

        // Verifica se foram criadas 12 transações
        $this->assertEquals(12, Transaction::where('user_id', $user->id)->count());

        // Verifica o primeiro e último mês
        $transactions = Transaction::where('user_id', $user->id)
            ->orderBy('reference_date')
            ->get();
        
        $this->assertEquals('2025-01-10', $transactions->first()->reference_date->format('Y-m-d'));
        $this->assertEquals('2025-12-10', $transactions->last()->reference_date->format('Y-m-d'));
    }
}
