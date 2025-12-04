import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { formatCurrency } from '@/lib/formatters';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function CategoryTotals({ categoryTotals }) {
    // Separa por tipo
    const incomes = categoryTotals.filter(item => item.type === 'income');
    const expenses = categoryTotals.filter(item => item.type === 'expense');

    // Ordena por valor (maior para menor)
    const sortedIncomes = incomes.sort((a, b) => b.total - a.total);
    const sortedExpenses = expenses.sort((a, b) => b.total - a.total);

    return (
        <div className="grid gap-4 md:grid-cols-2 mb-6">
            {/* Entradas por Categoria */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        Entradas por Categoria
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {sortedIncomes.length > 0 ? (
                        <div className="space-y-3">
                            {sortedIncomes.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span className="text-sm font-medium">{item.category_name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-green-600">
                                        {formatCurrency(item.total)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                            Nenhuma entrada neste mês
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Saídas por Categoria */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingDown className="h-5 w-5 text-red-500" />
                        Saídas por Categoria
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {sortedExpenses.length > 0 ? (
                        <div className="space-y-3">
                            {sortedExpenses.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                        <span className="text-sm font-medium">{item.category_name}</span>
                                    </div>
                                    <span className="text-sm font-bold text-red-600">
                                        {formatCurrency(item.total)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                            Nenhuma saída neste mês
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
