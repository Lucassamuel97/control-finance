import { useMemo } from 'react';

/**
 * Hook customizado para cálculos financeiros
 * @param {Array} transactions - Lista de transações
 * @returns {Object} Objeto contendo totalIncome, totalExpense e balance
 */
export const useFinancialCalculations = (transactions = []) => {
    return useMemo(() => {
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, t) => acc + parseFloat(t.amount), 0);

        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => acc + parseFloat(t.amount), 0);

        const balance = totalIncome - totalExpense;

        return {
            totalIncome,
            totalExpense,
            balance
        };
    }, [transactions]);
};
