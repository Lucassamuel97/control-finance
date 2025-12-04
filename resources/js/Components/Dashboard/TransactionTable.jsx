import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';

export default function TransactionTable({ transactions, onEdit, onDelete }) {
    return (
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
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                                <span>{transaction.description}</span>
                                {transaction.is_installment && (
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                        {transaction.installment_number}/{transaction.total_installments}
                                    </span>
                                )}
                            </div>
                        </TableCell>
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
                                    <DropdownMenuItem onClick={() => onEdit(transaction)}>
                                        <Pencil className="mr-2 h-4 w-4" /> Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500" onClick={() => onDelete(transaction)}>
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
    );
}
