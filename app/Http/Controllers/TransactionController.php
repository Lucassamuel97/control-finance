<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $user = Auth::user();

        // Carrega transações com o relacionamento 'category'
        $transactions = $user->transactions()->with('category')->latest('reference_date')->get();
        $categories = $user->categories()->get();

        return Inertia::render('Dashboard', [
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
            'amount' => 'required|numeric|min:0.01',
            'reference_date' => 'required|date',
        ]);

        $request->user()->transactions()->create($validated);

        return redirect(route('dashboard'))->with('success', 'Transação criada com sucesso.');
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
            'amount' => 'required|numeric|min:0.01',
            'reference_date' => 'required|date',
        ]);

        $transaction->update($validated);

        return redirect(route('dashboard'))->with('success', 'Transação atualizada com sucesso.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        $this->authorize('delete', $transaction);

        $transaction->delete();

        return redirect(route('dashboard'))->with('success', 'Transação excluída com sucesso.');
    }
}
