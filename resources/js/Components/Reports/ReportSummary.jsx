import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

export default function ReportSummary({ summary }) {
    if (!summary) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total de Entradas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        R$ {summary.total_income.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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
                        R$ {summary.total_expense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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
                        R$ {summary.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Período selecionado
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
