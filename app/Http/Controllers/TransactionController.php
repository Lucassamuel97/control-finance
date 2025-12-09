<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Display a listing of all transactions.
     */
    public function index(): Response
    {
        $user = Auth::user();

        // Carrega todas as transações com o relacionamento 'category'
        $transactions = $user->transactions()->with('category')->latest('reference_date')->get();
        $categories = $user->categories()->get();

        return Inertia::render('Transactions', [
            'transactions' => $transactions,
            'categories' => $categories,
            'status' => session('status'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => ['required', Rule::exists('categories', 'id')->where('user_id', $request->user()->id)],
            'type' => ['required', Rule::in(['income', 'expense'])],
            'frequency' => ['required', Rule::in(['fixed', 'variable'])],
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01|max:99999999.99',
            'reference_date' => 'required|date',
            'is_installment' => 'nullable|boolean',
            'total_installments' => 'nullable|required_if:is_installment,true|integer|min:2|max:60',
        ]);

        // Se for parcelado, criar múltiplas transações
        if ($request->input('is_installment') && $request->input('total_installments') > 1) {
            $this->createInstallments($request->user(), $validated);
            $message = 'Transação parcelada criada com sucesso.';
        } 
        // Se for fixa, criar 12 transações mensais
        elseif ($validated['frequency'] === 'fixed') {
            $this->createFixedTransactions($request->user(), $validated);
            $message = '12 transações fixas criadas com sucesso.';
        } 
        else {
            // Transação única
            $request->user()->transactions()->create($validated);
            $message = 'Transação criada com sucesso.';
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);

        $validated = $request->validate([
            'category_id' => ['required', Rule::exists('categories', 'id')->where('user_id', $request->user()->id)],
            'type' => ['required', Rule::in(['income', 'expense'])],
            'frequency' => ['required', Rule::in(['fixed', 'variable'])],
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01|max:99999999.99',
            'reference_date' => 'required|date',
            'update_all_installments' => 'nullable|boolean',
        ]);

        // Se for uma parcela e usuário quiser atualizar todas
        if ($transaction->is_installment && $request->input('update_all_installments')) {
            $this->updateAllInstallments($transaction, $validated);
            $message = 'Todas as parcelas foram atualizadas com sucesso.';
        } else {
            // Atualizar apenas esta transação
            $transaction->update($validated);
            $message = 'Transação atualizada com sucesso.';
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Transaction $transaction)
    {
        $this->authorize('delete', $transaction);

        // Se for parcela e usuário quiser excluir todas
        if ($transaction->is_installment && $request->input('delete_all_installments')) {
            $this->deleteAllInstallments($transaction);
            $message = 'Todas as parcelas foram excluídas com sucesso.';
        } else {
            $transaction->delete();
            $message = 'Transação excluída com sucesso.';
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Create multiple installment transactions.
     */
    private function createInstallments($user, array $data): void
    {
        $groupId = (string) Str::uuid();
        $totalInstallments = $data['total_installments'];
        $totalAmount = (float) $data['amount'];
        $referenceDate = \Carbon\Carbon::parse($data['reference_date']);

        // Calcula o valor de cada parcela (arredondado para baixo)
        $installmentAmount = floor(($totalAmount / $totalInstallments) * 100) / 100;
        
        // Calcula o resto que será adicionado nas primeiras parcelas
        $remainder = round($totalAmount - ($installmentAmount * $totalInstallments), 2);
        $centsToDistribute = (int) round($remainder * 100);

        for ($i = 1; $i <= $totalInstallments; $i++) {
            $amount = $installmentAmount;
            
            // Distribui os centavos restantes nas primeiras parcelas
            if ($centsToDistribute > 0) {
                $amount += 0.01;
                $centsToDistribute--;
            }
            
            // Garante que o valor está formatado corretamente
            $amount = round($amount, 2);

            $user->transactions()->create([
                'category_id' => $data['category_id'],
                'type' => $data['type'],
                'frequency' => $data['frequency'],
                'description' => $data['description'],
                'amount' => $amount,
                'reference_date' => $referenceDate->copy()->addMonths($i - 1),
                'installments_group_id' => $groupId,
                'installment_number' => $i,
                'total_installments' => $totalInstallments,
                'is_installment' => true,
            ]);
        }
    }

    /**
     * Create 12 monthly fixed transactions.
     */
    private function createFixedTransactions($user, array $data): void
    {
        $groupId = (string) Str::uuid();
        $referenceDate = \Carbon\Carbon::parse($data['reference_date']);
        $totalMonths = 12;

        for ($i = 0; $i < $totalMonths; $i++) {
            $user->transactions()->create([
                'category_id' => $data['category_id'],
                'type' => $data['type'],
                'frequency' => $data['frequency'],
                'description' => $data['description'],
                'amount' => $data['amount'],
                'reference_date' => $referenceDate->copy()->addMonths($i),
                'installments_group_id' => $groupId,
                'installment_number' => $i + 1,
                'total_installments' => $totalMonths,
                'is_installment' => false, // Não é parcelamento, é recorrência fixa
            ]);
        }
    }

    /**
     * Update all installments from the same group.
     */
    private function updateAllInstallments(Transaction $transaction, array $data): void
    {
        if (!$transaction->installments_group_id) {
            return;
        }

        Transaction::where('installments_group_id', $transaction->installments_group_id)
            ->update([
                'category_id' => $data['category_id'],
                'type' => $data['type'],
                'frequency' => $data['frequency'],
                'description' => $data['description'],
                'amount' => $data['amount'],
                // Não atualiza reference_date para manter as parcelas nos meses corretos
            ]);
    }

    /**
     * Delete all installments from the same group.
     */
    private function deleteAllInstallments(Transaction $transaction): void
    {
        if (!$transaction->installments_group_id) {
            return;
        }

        Transaction::where('installments_group_id', $transaction->installments_group_id)
            ->delete();
    }
}
