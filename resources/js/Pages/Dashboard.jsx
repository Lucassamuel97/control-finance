import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard({ auth, transactions, categories }) {
    const { flash } = usePage().props;
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
        category_id: ''
    });

    useEffect(() => {
        // CORREÇÃO: Usa optional chaining (?.) para evitar erro se flash for undefined.
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);
    
    const handleTypeChange = (value) => {
        setData(prevData => ({
            ...prevData,
            type: value,
            category_id: '' // Reset category when type changes
        }));
    };

    const openNewDialog = () => {
        setIsEditMode(false);
        reset();
        setData('reference_date', format(new Date(), 'yyyy-MM-dd'));
        setIsDialogOpen(true);
    };

    const openEditDialog = (transaction) => {
        setIsEditMode(true);
        setData({
            id: transaction.id,
            description: transaction.description,
            amount: transaction.amount,
            reference_date: format(new Date(transaction.reference_date), 'yyyy-MM-dd'),
            type: transaction.type,
            frequency: transaction.frequency,
            category_id: transaction.category_id.toString()
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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };
    
    const formatDate = (dateString) => {
        // Adiciona um dia à data para corrigir problemas de fuso horário
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return format(date, "dd/MM/yyyy", { locale: ptBR });
    };

    const filteredCategories = categories.filter(c => c.type === data.type);

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + parseFloat(t.amount), 0);
    const balance = totalIncome - totalExpense;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />
            <Toaster richColors />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Resumo Financeiro */}
                     <div className="grid gap-4 md:grid-cols-3 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-green-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-500">{formatCurrency(totalIncome)}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total de Saídas</CardTitle>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-red-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-500">{formatCurrency(totalExpense)}</div>
                            </CardContent>
                        </Card>
                         <Card>
                             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                 <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`h-4 w-4 ${balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`}><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                             </CardHeader>
                             <CardContent>
                                 <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`}>{formatCurrency(balance)}</div>
                             </CardContent>
                         </Card>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Transações Recentes</CardTitle>
                             <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={openNewDialog}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Nova Transação
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>{isEditMode ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={submit}>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="type" className="text-right">Tipo</Label>
                                                <div className="col-span-3">
                                                    <Select onValueChange={handleTypeChange} value={data.type}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione o tipo" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="income">Entrada</SelectItem>
                                                            <SelectItem value="expense">Saída</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="description" className="text-right">Descrição</Label>
                                                <Input id="description" value={data.description} onChange={e => setData('description', e.target.value)} className="col-span-3" />
                                                {errors.description && <p className="text-red-500 text-xs mt-1 col-start-2 col-span-3">{errors.description}</p>}
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="amount" className="text-right">Valor</Label>
                                                <Input id="amount" type="number" value={data.amount} onChange={e => setData('amount', e.target.value)} className="col-span-3" />
                                                 {errors.amount && <p className="text-red-500 text-xs mt-1 col-start-2 col-span-3">{errors.amount}</p>}
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="reference_date" className="text-right">Data</Label>
                                                <Input id="reference_date" type="date" value={data.reference_date} onChange={e => setData('reference_date', e.target.value)} className="col-span-3" />
                                                 {errors.reference_date && <p className="text-red-500 text-xs mt-1 col-start-2 col-span-3">{errors.reference_date}</p>}
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="category_id" className="text-right">Categoria</Label>
                                                <div className="col-span-3">
                                                    <Select onValueChange={value => setData('category_id', value)} value={data.category_id}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione a categoria" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {filteredCategories.map(cat => (
                                                                <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                                                </div>
                                            </div>
                                             <div className="grid grid-cols-4 items-center gap-4">
                                                 <Label htmlFor="frequency" className="text-right">Frequência</Label>
                                                 <div className="col-span-3">
                                                     <Select onValueChange={value => setData('frequency', value)} value={data.frequency}>
                                                         <SelectTrigger>
                                                             <SelectValue placeholder="Selecione a frequência" />
                                                         </SelectTrigger>
                                                         <SelectContent>
                                                             <SelectItem value="fixed">Fixa</SelectItem>
                                                             <SelectItem value="variable">Variável</SelectItem>
                                                         </SelectContent>
                                                     </Select>
                                                     {errors.frequency && <p className="text-red-500 text-xs mt-1">{errors.frequency}</p>}
                                                 </div>
                                             </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button type="button" variant="secondary">Cancelar</Button>
                                            </DialogClose>
                                            <Button type="submit" disabled={processing}>{processing ? 'Salvando...' : 'Salvar'}</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead className="text-right">Valor</TableHead>
                                        <TableHead className="w-[80px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.length > 0 ? transactions.map(transaction => (
                                        <TableRow key={transaction.id}>
                                            <TableCell className="font-medium">{transaction.description}</TableCell>
                                            <TableCell>{transaction.category?.name || 'N/A'}</TableCell>
                                            <TableCell>{formatDate(transaction.reference_date)}</TableCell>
                                            <TableCell className={`text-right font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                                                {formatCurrency(transaction.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Abrir menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditDialog(transaction)}>
                                                            <Pencil className="mr-2 h-4 w-4" /> Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-500" onClick={() => openDeleteConfirmDialog(transaction)}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan="5" className="text-center py-10">
                                                Nenhuma transação encontrada.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Confirmation Dialog for Deletion */}
            <Dialog open={isConfirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                    </DialogHeader>
                    <p>Você tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmDeleteDialogOpen(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={processing}>
                            {processing ? 'Excluindo...' : 'Excluir'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
