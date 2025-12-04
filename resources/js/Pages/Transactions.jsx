import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { PlusCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { useFinancialCalculations } from '@/hooks/useFinancialCalculations';
import { useTransactionForm } from '@/hooks/useTransactionForm';
import FinancialSummary from '@/Components/Dashboard/FinancialSummary';
import TransactionTable from '@/Components/Dashboard/TransactionTable';
import TransactionDialog from '@/Components/Dashboard/TransactionDialog';
import ConfirmDeleteDialog from '@/Components/Dashboard/ConfirmDeleteDialog';

export default function Transactions({ auth, transactions, categories }) {
    const { flash } = usePage().props;

    const {
        isDialogOpen,
        setIsDialogOpen,
        isConfirmDeleteDialogOpen,
        setConfirmDeleteDialogOpen,
        isEditMode,
        data,
        setData,
        processing,
        errors,
        openNewDialog,
        openEditDialog,
        openDeleteConfirmDialog,
        handleTypeChange,
        submit,
        handleDelete,
    } = useTransactionForm('transactions.index');

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const { totalIncome, totalExpense, balance } = useFinancialCalculations(transactions);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Transações</h2>}
        >
            <Head title="Transações" />
            <Toaster richColors />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <FinancialSummary 
                        totalIncome={totalIncome}
                        totalExpense={totalExpense}
                        balance={balance}
                    />

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Todas as Transações</CardTitle>
                            <Button onClick={openNewDialog}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Nova Transação
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <TransactionTable 
                                transactions={transactions}
                                onEdit={openEditDialog}
                                onDelete={openDeleteConfirmDialog}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <TransactionDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                isEditMode={isEditMode}
                data={data}
                setData={setData}
                onSubmit={submit}
                processing={processing}
                errors={errors}
                categories={categories}
                onTypeChange={handleTypeChange}
            />

            <ConfirmDeleteDialog
                isOpen={isConfirmDeleteDialogOpen}
                onOpenChange={setConfirmDeleteDialogOpen}
                onConfirm={handleDelete}
                processing={processing}
            />
        </AuthenticatedLayout>
    );
}
