import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-6 text-sm font-medium text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-2">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="text-slate-700 font-semibold mb-1.5"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/10 rounded-xl transition-all"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="your@email.com"
                    />

                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="text-slate-700 font-semibold mb-1.5"
                    />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full border-slate-200 bg-slate-50/50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500/10 rounded-xl transition-all"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="••••••••"
                    />

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div className="flex items-center">
                    <Checkbox
                        name="remember"
                        checked={data.remember}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={(e) =>
                            setData('remember', e.target.checked)
                        }
                    />
                    <span className="ms-2 text-sm font-medium text-slate-600">
                        Remember me
                    </span>
                </div>

                <div className="pt-2">
                    <PrimaryButton
                        className="relative flex w-full justify-center rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-slate-900 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98]"
                        disabled={processing}
                    >
                        {processing ? (
                            <div className="flex items-center">
                                <svg className="h-5 w-5 animate-spin text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Authenticating...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
