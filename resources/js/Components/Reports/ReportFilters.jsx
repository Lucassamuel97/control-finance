import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { FileText, Filter } from "lucide-react";

export default function ReportFilters({ 
    startDate, 
    setStartDate, 
    endDate, 
    setEndDate, 
    selectedCategories, 
    toggleCategory, 
    categories, 
    onSubmit 
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtros do Relatório
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Data Inicial */}
                        <div className="space-y-2">
                            <Label htmlFor="start_date">Data Inicial</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {/* Data Final */}
                        <div className="space-y-2">
                            <Label htmlFor="end_date">Data Final</Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {/* Botão Gerar */}
                        <div className="space-y-2">
                            <Label>&nbsp;</Label>
                            <Button type="submit" className="w-full">
                                <FileText className="mr-2 h-4 w-4" />
                                Gerar Relatório
                            </Button>
                        </div>
                    </div>

                    {/* Multi-select de Categorias */}
                    <div className="mt-4 space-y-2">
                        <Label>Categorias (opcional)</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                            {categories && categories.map((category) => (
                                <label
                                    key={category.id}
                                    className={`
                                        flex items-center gap-2 p-3 rounded-md border cursor-pointer transition-all
                                        ${selectedCategories.includes(category.id)
                                            ? "bg-primary/10 border-primary"
                                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary/50"
                                        }
                                    `}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category.id)}
                                        onChange={() => toggleCategory(category.id)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium">
                                        {category.name}
                                    </span>
                                    <span
                                        className={`ml-auto text-xs px-2 py-0.5 rounded ${
                                            category.type === "income"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        }`}
                                    >
                                        {category.type === "income" ? "↑" : "↓"}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
