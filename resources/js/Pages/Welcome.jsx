import { Link, Head } from '@inertiajs/react';
import { PiggyBank, BarChart, Wallet } from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Bem-vindo ao Samuca Control Finance" />
            <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 selection:bg-indigo-500 selection:text-white">
                
                {/* Botões de Login/Registro no Topo */}
                <div className="absolute top-0 right-0 p-6">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-indigo-500"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-indigo-500"
                            >
                                Entrar
                            </Link>

                            <Link
                                href={route('register')}
                                className="ml-4 font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline focus:outline-2 focus:rounded-sm focus:outline-indigo-500"
                            >
                                Registrar
                            </Link>
                        </>
                    )}
                </div>

                {/* Conteúdo Principal */}
                <div className="max-w-4xl mx-auto p-6 lg:p-8 text-center">
                    <div className="flex justify-center items-center mb-6">
                        <Wallet size={48} className="text-indigo-500" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Bem-vindo ao <span className="text-indigo-500">Samuca Control Finance</span>
                    </h1>

                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        A ferramenta definitiva para organizar suas finanças pessoais. Tenha o controle total sobre suas receitas e despesas de forma simples e intuitiva.
                    </p>
                    
                    {/* Seção de Funcionalidades */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div className="p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-lg">
                            <div className="flex items-center mb-4">
                                <PiggyBank className="h-8 w-8 text-indigo-500 mr-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Controle de Gastos</h3>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">
                                Crie categorias para suas despesas e receitas, sabendo exatamente para onde seu dinheiro está a ir.
                            </p>
                        </div>
                        
                        <div className="p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-lg">
                           <div className="flex items-center mb-4">
                               <BarChart className="h-8 w-8 text-indigo-500 mr-4" />
                               <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Visualize seu Saldo</h3>
                           </div>
                           <p className="text-gray-500 dark:text-gray-400">
                                Veja o resumo das suas entradas, saídas e o saldo atual diretamente no seu dashboard.
                           </p>
                       </div>
                       
                       <div className="p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-lg">
                           <div className="flex items-center mb-4">
                               <Wallet className="h-8 w-8 text-indigo-500 mr-4" />
                               <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Simples e Rápido</h3>
                           </div>
                           <p className="text-gray-500 dark:text-gray-400">
                                Uma interface limpa e moderna para que possa gerir suas finanças sem complicações.
                           </p>
                       </div>
                    </div>
                     
                    {/* Call to action */}
                    {!auth.user && (
                         <div className="mt-12">
                             <Link
                                 href={route('register')}
                                 className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
                             >
                                 Comece a Organizar-se Agora!
                             </Link>
                         </div>
                    )}
                </div>
            </div>
        </>
    );
}
