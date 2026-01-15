import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Subtle Light Gradient Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-[-5%] left-[-5%] h-[40%] w-[40%] rounded-full bg-indigo-50 blur-[100px]" />
                <div className="absolute bottom-[-5%] right-[-5%] h-[40%] w-[40%] rounded-full bg-blue-50 blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-[440px]">
                <div className="mb-0 text-center">
                    <Link href="/" className="group inline-block transform transition-all duration-500 hover:scale-110">
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            className="h-19 w-auto mx-auto"
                        />
                    </Link>
                </div>

                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm">
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs font-medium text-slate-300">
                        &copy; {new Date().getFullYear()} DKTD.
                    </p>
                </div>
            </div>
        </div>
    );
}
