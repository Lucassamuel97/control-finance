import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { formatMonthYear } from '@/lib/formatters';
import { useFinancialCalculations } from '@/hooks/useFinancialCalculations';
import { useTransactionForm } from '@/hooks/useTransactionForm';
import FinancialSummary from '@/Components/Dashboard/FinancialSummary';
import CategoryTotals from '@/Components/Dashboard/CategoryTotals';
import TransactionTable from '@/Components/Dashboard/TransactionTable';
import TransactionDialog from '@/Components/Dashboard/TransactionDialog';
import ConfirmDeleteDialog from '@/Components/Dashboard/ConfirmDeleteDialog';

export default function Dashboard({ auth, transactions, categories, categoryTotals, currentMonth, currentYear }) {
    const { flash } = usePage().props;
    const [selectedDate, setSelectedDate] = useState(new Date(currentYear, currentMonth - 1));

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
    } = useTransactionForm('dashboard');

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const navigateMonth = (direction) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setSelectedDate(newDate);
        
        router.get(route('dashboard'), {
            month: newDate.getMonth() + 1,
            year: newDate.getFullYear()
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const { totalIncome, totalExpense, balance } = useFinancialCalculations(transactions);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <Toaster richColors />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Navegação de Mês */}
                    <div className="flex items-center justify-center mb-6 gap-4">
                        <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => navigateMonth(-1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h3 className="text-2xl font-bold capitalize">
                            {formatMonthYear(selectedDate)}
                        </h3>
                        <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => navigateMonth(1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <FinancialSummary 
                        totalIncome={totalIncome}
                        totalExpense={totalExpense}
                        balance={balance}
                    />

                    <CategoryTotals categoryTotals={categoryTotals} />

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Transações do Mês</CardTitle>
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
