import InnerPageLayout from "@/Layouts/InnerPageLayout";
import useTranslate from "@/hooks/useTranslate";

export default function About() {
  const { t } = useTranslate();

  return (
    <InnerPageLayout titleKey="messages.about">
      {/* Section 1: About Us (left text + right big image + 2 small images) */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 items-center">
            {/* Left */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-12 bg-[#185C9B]" />
                <p className="text-[14px] font-Bold tracking-[0.3em] text-[#185C9B] uppercase">
                  Our Mission & Vision
                </p>
              </div>

              <h2 className="text-[40px] font-Bold tracking-[0.1em] text-[#C46A2A] sm:text-[48px] font-display uppercase leading-tight">
                {t("messages.about")}
              </h2>

              <div className="mt-8 space-y-6">
                <p className="max-w-xl text-[16px] font-Medium leading-relaxed tracking-wide text-slate-600 whitespace-pre-line">
                  {t("messages.full_Desc")}
                </p>
              </div>

              {/* two small images */}
              <div className="mt-16 grid grid-cols-2 gap-8">
                <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100 group">
                  <img
                    src="/images/about/image1.jpg"
                    alt="About visual 1"
                    className="h-[200px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => (e.target.src = "/images/placeholder.png")}
                  />
                </div>

                <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-slate-200/50 ring-1 ring-slate-100 group">
                  <img
                    src="/images/about/image2.jpg"
                    alt="About visual 2"
                    className="h-[200px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => (e.target.src = "/images/placeholder.png")}
                  />
                </div>
              </div>
            </div>

            {/* Right big image */}
            <div className="lg:col-span-5">
              <div className="relative group">
                <div className="overflow-hidden rounded-[3rem] shadow-2xl shadow-slate-300 ring-1 ring-slate-100">
                  <img
                    src="/images/about/image3.jpg"
                    alt="Main about visual"
                    className="h-[400px] w-full object-cover sm:h-[500px] lg:h-[650px] transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => (e.target.src = "/images/placeholder.png")}
                  />
                </div>
                {/* Decorative floating badge */}
                <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-50 hidden sm:block">
                  <p className="text-[32px] font-Bold text-[#185C9B] leading-none">25+</p>
                  <p className="text-[10px] font-Bold text-slate-400 uppercase tracking-widest mt-2">Years of Legacy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Our Leader (left image + right text) */}
      <section className="py-16 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 items-center">
            {/* Left image */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-[3rem] shadow-2xl shadow-slate-200 ring-4 ring-white group">
                <img
                  src="/images/about/image4.png"
                  alt="Our Leader"
                  className="h-[400px] w-full object-cover sm:h-[500px] transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => (e.target.src = "/images/placeholder.png")}
                />
              </div>
            </div>

            {/* Right text */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-12 bg-[#185C9B]" />
                <p className="text-[14px] font-Bold tracking-[0.3em] text-[#185C9B] uppercase">
                  Leadership & Excellence
                </p>
              </div>

              <h2 className="text-[36px] font-Bold tracking-[0.1em] text-[#C46A2A] sm:text-[44px] font-display uppercase leading-tight">
                Our Leader
              </h2>

              <p className="mt-8 max-w-xl text-[16px] font-Medium leading-relaxed tracking-wide text-slate-600">
                {t("messages.leader")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Our Factory (left text + right image) */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 items-center">
            {/* Left text */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-12 bg-[#185C9B]" />
                <p className="text-[14px] font-Bold tracking-[0.3em] text-[#185C9B] uppercase">
                  Production & Quality
                </p>
              </div>

              <h2 className="text-[36px] font-Bold tracking-[0.1em] text-[#C46A2A] sm:text-[44px] font-display uppercase leading-tight">
                Our Factory
              </h2>

              <p className="mt-8 max-w-xl text-[16px] font-Medium leading-relaxed tracking-wide text-slate-600">
                {t("messages.factory")}
              </p>
            </div>

            {/* Right image */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-[3rem] shadow-2xl shadow-slate-200 ring-4 ring-white group">
                <img
                  src="/images/about/image5.png"
                  alt="Our Factory"
                  className="h-[400px] w-full object-cover sm:h-[500px] transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => (e.target.src = "/images/placeholder.png")}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </InnerPageLayout>
  );
}
