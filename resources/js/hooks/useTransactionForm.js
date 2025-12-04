import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import { formatDateForInput } from '@/lib/formatters';

/**
 * Hook customizado para gerenciar formulário e CRUD de transações
 * Pode ser reutilizado em qualquer página que precise manipular transações
 */
export const useTransactionForm = (redirectRoute = 'dashboard') => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: '',
        description: '',
        amount: '',
        reference_date: '',
        type: 'expense',
        frequency: 'variable',
        category_id: '',
        is_installment: false,
        total_installments: 2
    });

    const handleTypeChange = (value) => {
        setData(prevData => ({
            ...prevData,
            type: value,
            category_id: ''
        }));
    };

    const openNewDialog = () => {
        setIsEditMode(false);
        reset();
        setData('reference_date', formatDateForInput(new Date()));
        setIsDialogOpen(true);
    };

    const openEditDialog = (transaction) => {
        setIsEditMode(true);
        setData({
            id: transaction.id,
            description: transaction.description,
            amount: transaction.amount,
            reference_date: formatDateForInput(new Date(transaction.reference_date)),
            type: transaction.type,
            frequency: transaction.frequency,
            category_id: transaction.category_id.toString(),
            is_installment: transaction.is_installment || false,
            total_installments: transaction.total_installments || 2
        });
        setIsDialogOpen(true);
    };

    const openDeleteConfirmDialog = (transaction) => {
        setTransactionToDelete(transaction);
        setConfirmDeleteDialogOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                reset();
                setIsDialogOpen(false);
            },
            onError: () => {
                toast.error("Houve um erro. Verifique os campos do formulário.");
            }
        };
        
        if (isEditMode) {
            patch(route('transactions.update', data.id), options);
        } else {
            post(route('transactions.store'), options);
        }
    };

    const handleDelete = () => {
        if (transactionToDelete) {
            destroy(route('transactions.destroy', transactionToDelete.id), {
                onSuccess: () => {
                    setConfirmDeleteDialogOpen(false);
                    setTransactionToDelete(null);
                }
            });
        }
    };

    return {
        // State
        isDialogOpen,
        setIsDialogOpen,
        isConfirmDeleteDialogOpen,
        setConfirmDeleteDialogOpen,
        transactionToDelete,
        isEditMode,
        
        // Form data
        data,
        setData,
        processing,
        errors,
        
        // Actions
        openNewDialog,
        openEditDialog,
        openDeleteConfirmDialog,
        handleTypeChange,
        submit,
        handleDelete,
    };
};
