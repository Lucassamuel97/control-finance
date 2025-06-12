import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function Index({ auth, categories }) {
    const { flash } = usePage().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isConfirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
        id: '',
        name: '',
        type: 'expense'
    });

    useEffect(() => {
        // CORREÇÃO: Adicionado optional chaining (?.) para evitar o erro.
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const openNewDialog = () => {
        setIsEditMode(false);
        reset();
        setIsDialogOpen(true);
    };

    const openEditDialog = (category) => {
        setIsEditMode(true);
        setData({
            id: category.id,
            name: category.name,
            type: category.type
        });
        setIsDialogOpen(true);
    };

    const openDeleteConfirmDialog = (category) => {
        setCategoryToDelete(category);
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
            patch(route('categories.update', data.id), options);
        } else {
            post(route('categories.store'), options);
        }
    };
    
    const handleDelete = () => {
        if (categoryToDelete) {
            destroy(route('categories.destroy', categoryToDelete.id), {
                onSuccess: () => {
                    setConfirmDeleteDialogOpen(false);
                    setCategoryToDelete(null);
                },
                onError: (error) => {
                    setConfirmDeleteDialogOpen(false);
                }
            });
        }
    };

    const typeLabels = {
        income: 'Entrada',
        expense: 'Saída'
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Categorias</h2>}
        >
            <Head title="Categorias" />
            <Toaster richColors />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Gerir Categorias</CardTitle>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button onClick={openNewDialog}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Nova Categoria
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>{isEditMode ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={submit}>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="name" className="text-right">Nome</Label>
                                                <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} className="col-span-3" />
                                                {errors.name && <p className="text-red-500 text-xs mt-1 col-start-2 col-span-3">{errors.name}</p>}
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="type" className="text-right">Tipo</Label>
                                                <div className="col-span-3">
                                                    <Select onValueChange={value => setData('type', value)} value={data.type}>
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
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead className="w-[80px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.map(category => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">{category.name}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${category.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {typeLabels[category.type]}
                                                </span>
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
                                                        <DropdownMenuItem onClick={() => openEditDialog(category)}>
                                                            <Pencil className="mr-2 h-4 w-4" /> Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-500" onClick={() => openDeleteConfirmDialog(category)}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
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
                    <p>Tem a certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.</p>
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
