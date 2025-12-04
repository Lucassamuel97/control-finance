import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata um valor numérico para o formato de moeda brasileira (BRL)
 * @param {number|string} value - Valor a ser formatado
 * @returns {string} Valor formatado em BRL
 */
export const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

/**
 * Formata uma data string para o formato brasileiro (dd/MM/yyyy)
 * Adiciona um dia para corrigir problemas de fuso horário
 * @param {string} dateString - Data em formato string
 * @returns {string} Data formatada em dd/MM/yyyy
 */
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
};

/**
 * Formata uma data para o padrão de input (yyyy-MM-dd)
 * @param {Date} date - Objeto Date
 * @returns {string} Data formatada em yyyy-MM-dd
 */
export const formatDateForInput = (date) => {
    return format(date, 'yyyy-MM-dd');
};

/**
 * Formata um mês/ano para exibição (ex: "Janeiro de 2025")
 * @param {Date} date - Objeto Date
 * @returns {string} Mês e ano formatados
 */
export const formatMonthYear = (date) => {
    return format(date, "MMMM 'de' yyyy", { locale: ptBR });
};
