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

        // Busca categorias para o formulário
        $categories = $user->categories()->get();

        return Inertia::render('Dashboard', [
            'transactions' => $transactions,
            'categories' => $categories,
            'currentMonth' => $month,
            'currentYear' => $year,
        ]);
    }
}
