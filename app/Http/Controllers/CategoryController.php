<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $user = Auth::user();

        return Inertia::render('Categories/Index', [
            'categories' => $user->categories()->latest()->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => ['required', Rule::in(['income', 'expense'])],
        ]);

        $request->user()->categories()->create($validated);

        return redirect(route('categories.index'))->with('success', 'Categoria criada com sucesso.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $this->authorize('update', $category);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => ['required', Rule::in(['income', 'expense'])],
        ]);

        $category->update($validated);

        return redirect(route('categories.index'))->with('success', 'Categoria atualizada com sucesso.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);

        // Verifica se a categoria não está sendo usada em transações
        if ($category->transactions()->exists()) {
            return redirect(route('categories.index'))->with('error', 'Não é possível excluir a categoria, pois ela está associada a transações.');
        }

        $category->delete();

        return redirect(route('categories.index'))->with('success', 'Categoria excluída com sucesso.');
    }
}
