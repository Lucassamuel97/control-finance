<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    /**
     * Display the reports page.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $categories = $user->categories()->get();

        // Parâmetros de filtro
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $categoryIds = $request->input('categories', []);

        $transactions = null;
        $summary = null;

        // Se houver filtros, buscar transações
        if ($startDate && $endDate) {
            $query = $user->transactions()
                ->with('category')
                ->whereBetween('reference_date', [$startDate, $endDate]);

            // Filtrar por categorias se selecionadas
            if (!empty($categoryIds)) {
                $query->whereIn('category_id', $categoryIds);
            }

            $transactions = $query->orderBy('reference_date', 'desc')->get();

            // Calcular resumo
            $totalIncome = $transactions->where('type', 'income')->sum('amount');
            $totalExpense = $transactions->where('type', 'expense')->sum('amount');
            $balance = $totalIncome - $totalExpense;

            $summary = [
                'total_income' => $totalIncome,
                'total_expense' => $totalExpense,
                'balance' => $balance,
                'income_count' => $transactions->where('type', 'income')->count(),
                'expense_count' => $transactions->where('type', 'expense')->count(),
            ];
        }

        return Inertia::render('Reports/Index', [
            'categories' => $categories,
            'transactions' => $transactions,
            'summary' => $summary,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'category_ids' => $categoryIds,
            ],
        ]);
    }
}
