import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { toast } from "sonner";
import { Toaster } from "sonner";
import ReportFilters from "@/Components/Reports/ReportFilters";
import ReportSummary from "@/Components/Reports/ReportSummary";
import ReportTransactionsTable from "@/Components/Reports/ReportTransactionsTable";

export default function ReportsIndex({ auth, categories, transactions, summary, filters }) {
    const getCurrentMonthStart = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
    };

    const getCurrentMonthEnd = () => {
        const now = new Date();
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    };

    const [startDate, setStartDate] = useState(filters?.start_date || getCurrentMonthStart());
    const [endDate, setEndDate] = useState(filters?.end_date || getCurrentMonthEnd());
    const [selectedCategories, setSelectedCategories] = useState(filters?.category_ids || []);

    const handleGenerateReport = (e) => {
        e.preventDefault();
        
        if (!startDate || !endDate) {
            toast.error("Por favor, selecione as datas inicial e final.");
            return;
        }

        router.get(route('reports.index'), {
            start_date: startDate,
            end_date: endDate,
            categories: selectedCategories,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const toggleCategory = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const showReport = transactions !== null;


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Relatórios
                </h2>
            }
        >
            <Head title="Relatórios" />
            <Toaster richColors />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <ReportFilters
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        selectedCategories={selectedCategories}
                        toggleCategory={toggleCategory}
                        categories={categories}
                        onSubmit={handleGenerateReport}
                    />

                    {showReport && (
                        <>
                            <ReportSummary summary={summary} />
                            <ReportTransactionsTable 
                                transactions={transactions} 
                                summary={summary} 
                            />
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
