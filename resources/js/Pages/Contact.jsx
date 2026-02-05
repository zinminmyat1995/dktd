import InnerPageLayout from "@/Layouts/InnerPageLayout";
import useTranslate from "@/hooks/useTranslate";
import { useForm, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";

export default function Contact() {
  const { t, locale } = useTranslate();
  const { flash } = usePage().props;

  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    description: "",
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("contact.submit"), {
      onSuccess: () => reset(),
    });
  };

  return (
    <InnerPageLayout titleKey="messages.contact">
      {/* Page heading + Centered Form Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[2px] w-12 bg-[#185C9B]" />
              <p className={`text-[14px] font-Bold ${locale === 'kh' ? '' : 'tracking-[0.3em]'} text-[#185C9B] uppercase`}>
                {t("messages.contact_get_in_touch")}
              </p>
              <div className="h-[2px] w-12 bg-[#185C9B]" />
            </div>
            <h2 className={`text-[40px] font-Bold ${locale === 'kh' ? '' : 'tracking-[0.1em]'} text-[#C46A2A] sm:text-[48px] font-display uppercase leading-tight`}>
              {t("messages.contact_heading")}
            </h2>
          </div>

          <div className="flex justify-center">
            {/* Form container narrowed for better readability and centering */}
            <div className="w-full max-w-4xl">
              <div className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-2xl shadow-slate-200 border border-slate-50">

                {flash?.success && (
                  <div className="mb-8 rounded-2xl bg-green-50 border border-green-100 p-4 text-center text-green-700 font-Bold text-[15px] shadow-sm">
                    {flash.success}
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className={`text-[13px] font-Bold text-[#185C9B] uppercase ${locale === 'kh' ? '' : 'tracking-widest'} ml-1`}>
                        {t("messages.contact_full_name")}
                      </label>
                      <input
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        type="text"
                        placeholder={t("messages.contact_your_name_placeholder")}
                        className={`w-full rounded-2xl border-slate-200 bg-slate-50/50 px-6 py-4 text-[14px] font-Medium text-slate-700 outline-none focus:border-[#185C9B] focus:ring-4 focus:ring-[#185C9B]/5 transition-all duration-300 ${errors.name ? '!border-red-500 bg-red-50' : ''}`}
                      />
                      {errors.name && <p className="text-red-500 text-xs px-2">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className={`text-[13px] font-Bold text-[#185C9B] uppercase ${locale === 'kh' ? '' : 'tracking-widest'} ml-1`}>
                        {t("messages.contact_email_address")}
                      </label>
                      <input
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        type="email"
                        placeholder={t("messages.contact_your_email_placeholder")}
                        className={`w-full rounded-2xl border-slate-200 bg-slate-50/50 px-6 py-4 text-[14px] font-Medium text-slate-700 outline-none focus:border-[#185C9B] focus:ring-4 focus:ring-[#185C9B]/5 transition-all duration-300 ${errors.email ? '!border-red-500 bg-red-50' : ''}`}
                      />
                      {errors.email && <p className="text-red-500 text-xs px-2">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-[13px] font-Bold text-[#185C9B] uppercase ${locale === 'kh' ? '' : 'tracking-widest'} ml-1`}>
                      {t("messages.contact_message")}
                    </label>
                    <textarea
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      rows={6}
                      placeholder={t("messages.contact_help_placeholder")}
                      className={`w-full resize-none rounded-2xl border-slate-200 bg-slate-50/50 px-6 py-4 text-[14px] font-Medium text-slate-700 outline-none focus:border-[#185C9B] focus:ring-4 focus:ring-[#185C9B]/5 transition-all duration-300 ${errors.description ? '!border-red-500 bg-red-50' : ''}`}
                    />
                    {errors.description && <p className="text-red-500 text-xs px-2">{errors.description}</p>}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-4">
                    {/* Social links */}
                    <div className="flex items-center gap-6">
                      <a href="#" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#185C9B] hover:bg-[#185C9B] hover:text-white transition-all duration-500 shadow-sm border border-slate-100" aria-label="TikTok">
                        <TikTokIcon className="h-5 w-5" />
                      </a>
                      <a href="#" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#C46A2A] hover:bg-[#C46A2A] hover:text-white transition-all duration-500 shadow-sm border border-slate-100" aria-label="Instagram">
                        <InstagramIcon className="h-5 w-5" />
                      </a>
                      <a href="https://www.facebook.com/DKTD.Genki" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#185C9B] hover:bg-[#185C9B] hover:text-white transition-all duration-500 shadow-sm border border-slate-100" aria-label="Facebook">
                        <FacebookIcon className="h-5 w-5" />
                      </a>
                    </div>

                    <button
                      type="submit"
                      disabled={processing}
                      className={`w-full sm:w-auto px-12 py-4 bg-[#C46A2A] text-white text-[14px] font-Bold uppercase ${locale === 'kh' ? '' : 'tracking-widest'} rounded-full shadow-xl shadow-orange-900/20 hover:bg-[#A85924] hover:translate-y-[-2px] transition-all duration-500 ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {processing ? t("messages.contact_send_message") + "..." : t("messages.contact_send_message")}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standardized Location Section */}
      <section className="py-16 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 items-center">
            {/* Left Info Cards */}
            <div className="lg:col-span-12 xl:col-span-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-12 bg-[#185C9B]" />
                <p className={`text-[14px] font-Bold ${locale === 'kh' ? '' : 'tracking-[0.3em]'} text-[#185C9B] uppercase`}>
                  {t("messages.find_our_store")}
                </p>
              </div>

              <h2 className={`text-[40px] font-Bold ${locale === 'kh' ? '' : 'tracking-[0.1em]'} text-[#C46A2A] sm:text-[48px] font-display uppercase leading-tight`}>
                {t("messages.locations")}
              </h2>

              <div className="mt-10 space-y-6">
                <div className="flex gap-6 p-4 rounded-2xl transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 group">
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center text-[#185C9B] transition-transform duration-500 group-hover:scale-110">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className={`text-[12px] font-Bold text-slate-400 uppercase ${locale === 'kh' ? '' : 'tracking-widest'} mb-1 transition-colors duration-500 group-hover:text-[#185C9B]`}>{t("messages.opening_hours")}</h5>
                    <p className="text-[16px] font-Bold text-slate-900 tracking-wide">{t("messages.opening_hours_time")}</p>
                  </div>
                </div>

                <div className="flex gap-6 p-4 rounded-2xl transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 group">
                  <div className="h-12 w-12 shrink-0 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center text-[#C46A2A] transition-transform duration-500 group-hover:scale-110">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className={`text-[12px] font-Bold text-slate-400 uppercase ${locale === 'kh' ? '' : 'tracking-widest'} mb-1 transition-colors duration-500 group-hover:text-[#C46A2A]`}>{t("messages.headquarters")}</h5>
                    <p className="text-[16px] font-Bold text-slate-900 leading-relaxed max-w-sm tracking-wide">
                      {t("messages.headquarters_address")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Map */}
            <div className="lg:col-span-12 xl:col-span-7">
              <div className="overflow-hidden rounded-[3rem] shadow-2xl shadow-slate-200 ring-4 ring-white">
                <iframe
                  title="DKTD-Genki Location"
                  className="h-[400px] w-full lg:h-[500px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.00956484519!2d104.90178491094844!3d11.622668388534658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310953ee88ca943b%3A0x71ff8ccd1a7bc3a9!2sThe%20Auckland%20Boulangerie!5e0!3m2!1sen!2sus!4v1769486487704!5m2!1sen!2sus"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </InnerPageLayout>
  );
}

/** Icons (safe SVGs) */
function TikTokIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="currentColor">
      <path d="M34 6c1.2 4.6 4.6 8.1 9 9.3V24c-3.7-.1-6.9-1.3-9-3.3V32c0 8-6.5 14.5-14.5 14.5S5 40 5 32.1 11.5 17.6 19.5 17.6c.5 0 1 0 1.5.1V26c-.5-.2-1-.3-1.5-.3-3.5 0-6.4 2.9-6.4 6.4s2.9 6.4 6.4 6.4 6.4-2.9 6.4-6.4V6h8z" />
    </svg>
  );
}

function InstagramIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="currentColor">
      <path d="M24 16.3A7.7 7.7 0 1 0 24 31.7a7.7 7.7 0 0 0 0-15.4zm0 12.7A5 5 0 1 1 24 19a5 5 0 0 1 0 10z" />
      <path d="M31.8 8H16.2A8.2 8.2 0 0 0 8 16.2v15.6A8.2 8.2 0 0 0 16.2 40h15.6A8.2 8.2 0 0 0 40 31.8V16.2A8.2 8.2 0 0 0 31.8 8zm5.5 23.8a5.5 5.5 0 0 1-5.5 5.5H16.2a5.5 5.5 0 0 1-5.5-5.5V16.2a5.5 5.5 0 0 1 5.5-5.5h15.6a5.5 5.5 0 0 1 5.5 5.5v15.6z" />
      <circle cx="33.5" cy="14.5" r="1.8" />
    </svg>
  );
}

function FacebookIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5c0-2.5 1.5-3.9 3.8-3.9
        1.1 0 2.2.2 2.2.2v2.4H15c-1.4 0-1.8.9-1.8 1.8V12H16l-.5 3h-2.3v7A10 10 0 0 0 22 12z" />
    </svg>
  );
}
