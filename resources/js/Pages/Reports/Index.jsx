import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { FileText, Filter } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "sonner";

export default function ReportsIndex({ auth, categories, transactions, summary, filters }) {
    const [startDate, setStartDate] = useState(filters?.start_date || "");
    const [endDate, setEndDate] = useState(filters?.end_date || "");
    const [selectedCategories, setSelectedCategories] = useState(filters?.category_ids || []);

    const handleGenerateReport = (e) => {
        e.preventDefault();
        
        if (!startDate || !endDate) {
            toast.error("Por favor, selecione as datas inicial e final.");
            return;
        }

        router.get(route('reports.index'), {
            start_date: startDate,
            end_date: endDate,
            categories: selectedCategories,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const toggleCategory = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const showReport = transactions !== null;


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Relatórios
                </h2>
            }
        >
            <Head title="Relatórios" />
            <Toaster richColors />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Filtros */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filtros do Relatório
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleGenerateReport}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Data Inicial */}
                                    <div className="space-y-2">
                                        <Label htmlFor="start_date">
                                            Data Inicial
                                        </Label>
                                        <Input
                                            id="start_date"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) =>
                                                setStartDate(e.target.value)
                                            }
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Data Final */}
                                    <div className="space-y-2">
                                        <Label htmlFor="end_date">
                                            Data Final
                                        </Label>
                                        <Input
                                            id="end_date"
                                            type="date"
                                            value={endDate}
                                            onChange={(e) =>
                                                setEndDate(e.target.value)
                                            }
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Botão Gerar */}
                                    <div className="space-y-2">
                                        <Label>&nbsp;</Label>
                                        <Button
                                            type="submit"
                                            className="w-full"
                                        >
                                            <FileText className="mr-2 h-4 w-4" />
                                            Gerar Relatório
                                        </Button>
                                    </div>
                                </div>

                                {/* Multi-select de Categorias */}
                                <div className="mt-4 space-y-2">
                                    <Label>Categorias</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                                        {categories && categories.map((category) => (
                                            <label
                                                key={category.id}
                                                className={`
                                                flex items-center gap-2 p-3 rounded-md border cursor-pointer transition-all
                                                ${
                                                    selectedCategories.includes(
                                                        category.id
                                                    )
                                                        ? "bg-primary/10 border-primary"
                                                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/50"
                                                }
                                            `}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.includes(
                                                        category.id
                                                    )}
                                                    onChange={() =>
                                                        toggleCategory(
                                                            category.id
                                                        )
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                />
                                                <span className="text-sm font-medium">
                                                    {category.name}
                                                </span>
                                                <span
                                                    className={`ml-auto text-xs px-2 py-0.5 rounded ${
                                                        category.type ===
                                                        "income"
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                    }`}
                                                >
                                                    {category.type === "income"
                                                        ? "↑"
                                                        : "↓"}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Resultado do Relatório */}
                    {showReport && summary && (
                        <>
                            {/* Cards de Resumo */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Total de Entradas
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            R${" "}
                                            {summary.total_income.toLocaleString(
                                                "pt-BR",
                                                { minimumFractionDigits: 2 }
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {summary.income_count} transações
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Total de Saídas
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                            R${" "}
                                            {summary.total_expense.toLocaleString(
                                                "pt-BR",
                                                { minimumFractionDigits: 2 }
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {summary.expense_count} transações
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Saldo
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className={`text-2xl font-bold ${
                                                summary.balance >= 0
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-red-600 dark:text-red-400"
                                            }`}
                                        >
                                            R${" "}
                                            {summary.balance.toLocaleString("pt-BR", {
                                                minimumFractionDigits: 2,
                                            })}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Período selecionado
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Tabela de Transações */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Detalhamento das Transações
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Data
                                                    </th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Descrição
                                                    </th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Categoria
                                                    </th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Tipo
                                                    </th>
                                                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                        Valor
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions && transactions.map(
                                                    (transaction) => (
                                                        <tr
                                                            key={transaction.id}
                                                            className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                        >
                                                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                                {new Date(
                                                                    transaction.reference_date
                                                                ).toLocaleDateString(
                                                                    "pt-BR"
                                                                )}
                                                            </td>
                                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                                                                {
                                                                    transaction.description
                                                                }
                                                            </td>
                                                            <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                                                {
                                                                    transaction.category.name
                                                                }
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <span
                                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                        transaction.type ===
                                                                        "income"
                                                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                                    }`}
                                                                >
                                                                    {transaction.type ===
                                                                    "income"
                                                                        ? "Entrada"
                                                                        : "Saída"}
                                                                </span>
                                                            </td>
                                                            <td
                                                                className={`py-3 px-4 text-sm text-right font-semibold ${
                                                                    transaction.type ===
                                                                    "income"
                                                                        ? "text-green-600 dark:text-green-400"
                                                                        : "text-red-600 dark:text-red-400"
                                                                }`}
                                                            >
                                                                {transaction.type ===
                                                                "income"
                                                                    ? "+"
                                                                    : "-"}{" "}
                                                                R${" "}
                                                                {transaction.amount.toLocaleString(
                                                                    "pt-BR",
                                                                    {
                                                                        minimumFractionDigits: 2,
                                                                    }
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                            <tfoot>
                                                <tr className="bg-gray-50 dark:bg-gray-800/50 font-bold">
                                                    <td
                                                        colSpan="4"
                                                        className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100"
                                                    >
                                                        Total Geral
                                                    </td>
                                                    <td
                                                        className={`py-3 px-4 text-sm text-right ${
                                                            summary.balance >= 0
                                                                ? "text-green-600 dark:text-green-400"
                                                                : "text-red-600 dark:text-red-400"
                                                        }`}
                                                    >
                                                        R${" "}
                                                        {summary.balance.toLocaleString(
                                                            "pt-BR",
                                                            {
                                                                minimumFractionDigits: 2,
                                                            }
                                                        )}
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
