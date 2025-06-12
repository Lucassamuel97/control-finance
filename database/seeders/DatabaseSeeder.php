<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Cria um usuário de teste
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);

        // Cria categorias para o usuário
        $salary = Category::create([
            'user_id' => $user->id,
            'name' => 'Salário',
            'type' => 'income',
        ]);

        $freelancer = Category::create([
            'user_id' => $user->id,
            'name' => 'Freelancer',
            'type' => 'income',
        ]);

        $rent = Category::create([
            'user_id' => $user->id,
            'name' => 'Aluguel',
            'type' => 'expense',
        ]);

        $supermarket = Category::create([
            'user_id' => $user->id,
            'name' => 'Supermercado',
            'type' => 'expense',
        ]);

        $transport = Category::create([
            'user_id' => $user->id,
            'name' => 'Transporte',
            'type' => 'expense',
        ]);

        // Cria transações de exemplo
        Transaction::create([
            'user_id' => $user->id,
            'category_id' => $salary->id,
            'type' => 'income',
            'frequency' => 'fixed',
            'description' => 'Salário da Empresa X',
            'amount' => 5000.00,
            'reference_date' => now()->startOfMonth(),
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'category_id' => $freelancer->id,
            'type' => 'income',
            'frequency' => 'variable',
            'description' => 'Projeto Y',
            'amount' => 1200.50,
            'reference_date' => now()->subDays(10),
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'category_id' => $rent->id,
            'type' => 'expense',
            'frequency' => 'fixed',
            'description' => 'Aluguel do Apartamento',
            'amount' => 1500.00,
            'reference_date' => now()->startOfMonth()->addDays(4),
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'category_id' => $supermarket->id,
            'type' => 'expense',
            'frequency' => 'variable',
            'description' => 'Compras do mês',
            'amount' => 650.75,
            'reference_date' => now()->subDays(5),
        ]);
    }
}
