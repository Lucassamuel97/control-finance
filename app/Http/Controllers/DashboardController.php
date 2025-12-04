<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with monthly transactions
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        
        // Pega o mês e ano da query string ou usa o mês/ano atual
        $month = $request->query('month', now()->month);
        $year = $request->query('year', now()->year);
        
        // Valida mês e ano
        $month = max(1, min(12, (int) $month));
        $year = max(1900, min(2100, (int) $year));
        
        // Busca transações do mês específico
        $transactions = $user->transactions()
            ->with('category')
            ->whereYear('reference_date', $year)
            ->whereMonth('reference_date', $month)
            ->orderBy('reference_date', 'desc')
            ->get();

        // Calcula totais por categoria
        $categoryTotals = $user->transactions()
            ->with('category')
            ->whereYear('reference_date', $year)
            ->whereMonth('reference_date', $month)
            ->selectRaw('category_id, type, SUM(amount) as total')
            ->groupBy('category_id', 'type')
            ->get()
            ->map(function ($item) {
                return [
                    'category_id' => $item->category_id,
                    'category_name' => $item->category->name ?? 'Sem categoria',
                    'type' => $item->type,
                    'total' => $item->total,
                ];
            });

        // Busca categorias para o formulário
        $categories = $user->categories()->get();

        return Inertia::render('Dashboard', [
            'transactions' => $transactions,
            'categories' => $categories,
            'categoryTotals' => $categoryTotals,
            'currentMonth' => $month,
            'currentYear' => $year,
        ]);
    }
}
