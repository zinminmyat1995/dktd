import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    const cards = [
        {
            name: 'Total Products',
            count: stats.products,
            color: 'bg-blue-600',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            )
        },
        {
            name: 'Active Promotions',
            count: stats.promotions,
            color: 'bg-rose-600',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            )
        },
        {
            name: 'Categories',
            count: stats.categories,
            color: 'bg-amber-600',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
            )
        },
        {
            name: 'Staff Users',
            count: stats.users,
            color: 'bg-emerald-600',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-slate-800">
                    Dashboard Overview
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {cards.map((card) => (
                            <div key={card.name} className="bg-white overflow-hidden rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
                                <div className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                                                {card.name}
                                            </p>
                                            <h3 className="mt-1 text-3xl font-bold text-slate-900 leading-tight">
                                                {card.count}
                                            </h3>
                                        </div>
                                        <div className={`p-3 rounded-xl text-white ${card.color} shadow-lg shadow-${card.color.split('-')[1]}-200`}>
                                            {card.icon}
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center text-sm text-slate-400">
                                        <span className="flex items-center">
                                            Live system data
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Welcome Section */}
                    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-8 md:flex items-center justify-between">
                            <div className="max-w-2xl">
                                <h2 className="text-2xl font-bold text-slate-800">Welcome to DKTD Control Panel</h2>
                                <p className="mt-2 text-slate-600 leading-relaxed">
                                    Manage your products, categories, and promotions efficiently. Use the sidebar to navigate through target sections and keep your store content up to date.
                                </p>
                            </div>
                            <div className="mt-6 md:mt-0 flex gap-3">
                                <a href="/admin/products" className="inline-flex items-center px-5 py-2.5 border border-slate-200 shadow-sm text-sm font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 transition-all">
                                    View Products
                                </a>
                                <a href="/admin/products/create" className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all shadow-indigo-200">
                                    Add Product
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
