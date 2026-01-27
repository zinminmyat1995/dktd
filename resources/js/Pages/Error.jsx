import useTranslate from '@/hooks/useTranslate';
import { Link, Head } from '@inertiajs/react';

export default function ErrorPage({ status }) {
    const { t, locale } = useTranslate();

    const titleKey = {
        404: 'messages.error_404_title',
        500: 'messages.error_500_title',
    }[status] || 'messages.error_generic_title';

    const descKey = {
        404: 'messages.error_404_desc',
        500: 'messages.error_500_desc',
    }[status] || 'messages.error_generic_title';

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
            <Head title={t(titleKey)} />

            {/* Logo */}
            <Link href="/" className="mb-12">
                <img
                    src="/images/logo.png"
                    alt="DKTD-Genki"
                    className="h-16 w-auto"
                />
            </Link>

            {/* Error Code */}
            <h1 className="mb-4 text-5xl sm:text-7xl font-Bold text-[#D4793F]">
                Error {status}
            </h1>

            {/* Message */}
            <p className={`mb-12 text-lg sm:text-xl font-Medium text-slate-500 max-w-md ${locale === 'kh' ? '' : 'tracking-wide'}`}>
                {t("messages.error_page_subtitle")} {t(descKey)}
            </p>

            {/* Back Button */}
            <Link
                href="/"
                className="
                    rounded-full bg-[#185C9B] px-10 py-4 
                    text-[13px] font-Bold uppercase tracking-[0.2em] text-white 
                    transition-all duration-300 hover:bg-[#1E4F7A] hover:-translate-y-1 shadow-lg shadow-blue-900/20
                "
            >
                {t("messages.error_back_home")}
            </Link>

            {/* Footer Copyright */}
            <div className="absolute bottom-8 w-full text-center">
                <p className="text-[13px] text-slate-400 tracking-[0.15em] font-Medium">
                    Copyright © 2025 DKTD-Genki. All rights reserved.
                </p>
            </div>
        </div>
    );
}
