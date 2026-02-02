import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ stats }) {

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-slate-800">
                    Contact List
                </h2>
            }
        >
         
        </AuthenticatedLayout>
    );
}
