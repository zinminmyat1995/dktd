import InnerPageLayout from "@/Layouts/InnerPageLayout";
import useTranslate from "@/hooks/useTranslate";
import { useState } from "react";

export default function Contact() {
  const { t } = useTranslate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
  });

  const onChange = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // TODO: backend ချိတ်မယ်ဆို inertia post သုံး
    // router.post(route("contact.submit"), form)
    console.log(form);
  };

  return (
    <InnerPageLayout titleKey="messages.contact">
      {/* Page heading */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-[35px] font-semibold tracking-[0.25em] text-[#D4793F]">
              CONTACT US
            </h2>
            <p className="mt-3 text-[15px] font-semibold tracking-[0.25em] text-[#185C9B]">
              Business Insights &amp; Beyond
            </p>
          </div>

          {/* Form Card */}
          <div className="mt-14 flex justify-center">
            <div className="w-full max-w-5xl rounded-md bg-[#F6E1D6] px-8 py-12 sm:px-16">
              <form onSubmit={onSubmit} className="mx-auto max-w-2xl">
                {/* Name + Email */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <div>
                    <label className="block text-[15px] font-semibold tracking-[0.15em] text-[#185C9B]">
                      Name
                    </label>
                    <input
                      value={form.name}
                      onChange={onChange("name")}
                      type="text"
                      className="
                        mt-3 w-full rounded-md border border-[#185C9B]
                        bg-transparent px-4 py-2 text-[13px] text-[#185C9B]
                        outline-none focus:ring-0
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-[15px] font-semibold tracking-[0.15em] text-[#185C9B]">
                      Email
                    </label>
                    <input
                      value={form.email}
                      onChange={onChange("email")}
                      type="email"
                      className="
                        mt-3 w-full rounded-md border border-[#185C9B]
                        bg-transparent px-4 py-2 text-[13px] text-[#185C9B]
                        outline-none focus:ring-0
                      "
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <label className="block text-[15px] font-semibold tracking-[0.15em] text-[#185C9B]">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={onChange("description")}
                    rows={6}
                    className="
                      mt-3 w-full resize-none rounded-md border border-[#185C9B]
                      bg-transparent px-4 py-3 text-[13px] text-[#185C9B]
                      outline-none focus:ring-0
                    "
                  />
                </div>

                {/* Submit */}
                <div className="mt-8 flex justify-center">
                  <button
                    type="submit"
                    className="
                      inline-flex h-[44px] w-[220px] items-center justify-center
                      border-2 border-[#C46A2A]
                      text-[15px] font-semibold tracking-[0.15em] text-[#C46A2A]
                      hover:bg-[#C46A2A] hover:text-white transition
                    "
                  >
                    Submit
                  </button>
                </div>

                {/* Social icons below button */}
                <div className="mt-8 flex justify-center gap-6 text-[#185C9B]">
                  <a href="#" className="hover:opacity-80" aria-label="TikTok">
                    <TikTokIcon className="h-7 w-7" />
                  </a>
                  <a href="#" className="hover:opacity-80" aria-label="Instagram">
                    <InstagramIcon className="h-7 w-7" />
                  </a>
                  <a href="#" className="hover:opacity-80" aria-label="Facebook">
                    <FacebookIcon className="h-7 w-7" />
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* OUR LOCATION */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            {/* Left text */}
            <div className="lg:col-span-6">
              <p className="text-[15px] font-semibold tracking-[0.25em] text-[#185C9B]">
                Business Insights &amp; Beyond
              </p>

              <h2 className="mt-1 text-[32px] font-semibold tracking-[0.25em] text-[#D4793F]">
                OUR LOCATION
              </h2>

              <div className="mt-5 space-y-6 text-[15px]  tracking-[0.12em] text-slate-900">
                <div>
                  Opening Hour : <span className="font-semibold">9am to 9pm</span>
                </div>

                <div>
                  Address : #1065(Ground floor &amp; 1st floor), St. Betong,Phum
                  Speankpos, Sangkat Kilomaetr Lekh Prammnuy, Khan Russey Keo,
                  Phnom Penh.
                </div>
              </div>
            </div>

            {/* Right map */}
            <div className="lg:col-span-6">
              <div className="overflow-hidden rounded-sm border border-slate-200">
                <iframe
                  title="DKTD-Genki Location"
                  className="h-[180px] w-full sm:h-[220px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=Phnom%20Penh&output=embed"
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
