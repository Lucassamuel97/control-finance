import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

export default function TransactionDialog({ 
    isOpen, 
    onOpenChange, 
    isEditMode, 
    data, 
    setData, 
    onSubmit, 
    processing, 
    errors, 
    categories,
    onTypeChange 
}) {
    const filteredCategories = categories.filter(c => c.type === data.type);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">Tipo</Label>
                            <div className="col-span-3">
                                <Select onValueChange={onTypeChange} value={data.type}>
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
                            <Input 
                                id="description" 
                                value={data.description} 
                                onChange={e => setData('description', e.target.value)} 
                                className="col-span-3" 
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1 col-start-2 col-span-3">{errors.description}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="amount" className="text-right">Valor</Label>
                            <Input 
                                id="amount" 
                                type="number" 
                                step="0.01"
                                value={data.amount} 
                                onChange={e => setData('amount', e.target.value)} 
                                className="col-span-3" 
                            />
                            {errors.amount && <p className="text-red-500 text-xs mt-1 col-start-2 col-span-3">{errors.amount}</p>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="reference_date" className="text-right">Data</Label>
                            <Input 
                                id="reference_date" 
                                type="date" 
                                value={data.reference_date} 
                                onChange={e => setData('reference_date', e.target.value)} 
                                className="col-span-3" 
                            />
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
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
