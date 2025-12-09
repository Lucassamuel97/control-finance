import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

export default function ReportTransactionsTable({ transactions, summary }) {
    if (!transactions || transactions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Detalhamento das Transações</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        Nenhuma transação encontrada para o período selecionado.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Detalhamento das Transações</CardTitle>
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
                            {transactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                >
                                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(transaction.reference_date).toLocaleDateString("pt-BR")}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                                        {transaction.description}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                                        {transaction.category.name}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                transaction.type === "income"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                            }`}
                                        >
                                            {transaction.type === "income" ? "Entrada" : "Saída"}
                                        </span>
                                    </td>
                                    <td
                                        className={`py-3 px-4 text-sm text-right font-semibold ${
                                            transaction.type === "income"
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-red-600 dark:text-red-400"
                                        }`}
                                    >
                                        {transaction.type === "income" ? "+" : "-"} R${" "}
                                        {transaction.amount.toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        {summary && (
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
                                        {summary.balance.toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2,
                                        })}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
