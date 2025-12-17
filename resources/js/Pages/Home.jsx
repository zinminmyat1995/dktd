import InnerPageLayout from "@/Layouts/InnerPageLayout";
import useTranslate from "@/hooks/useTranslate";
import { Link } from "@inertiajs/react";

export default function Home() {
  const { t } = useTranslate();

  return (
    <InnerPageLayout titleKey="messages.home" isHome>
      {/* ================= HERO SECTION ================= */}
      <section className="relative">
       

        {/* overlay text */}
        {/* <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-7xl px-4">
            <h1 className="font-[cursive] text-[36px] text-[#7A3B14]">
              Lorem Ipsum Is Simply Dummy
            </h1>

            <div className="mt-4 flex items-center gap-4 text-[#2C5A7A]">
              <span className="h-[1px] w-16 bg-[#2C5A7A]" />
              <span>★</span>
              <span className="h-[1px] w-16 bg-[#2C5A7A]" />
            </div>

            <p className="mt-4 max-w-md text-[14px] tracking-[0.15em] text-[#2C5A7A]">
              Lorem Ipsum is simply dummy text of t.
            </p>

            <Link
              href={route("contact")}
              className="
                mt-6 inline-flex items-center justify-center
                border-2 border-[#C46A2A]
                px-8 py-3 text-[12px]
                font-semibold tracking-[0.18em]
                text-[#C46A2A]
                hover:bg-[#C46A2A] hover:text-white transition
              "
            >
              Contact Us
            </Link>
          </div>
        </div> */}
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left */}
            <div className="lg:col-span-7">
              <p className="text-[20px] font-semibold tracking-[0.25em] text-[#185C9B]">
                Business Insights &amp; Beyond
              </p>

              <h2 className="mt-3 text-[34px] font-semibold tracking-[0.25em] text-[#C46A2A] sm:text-[40px]">
                {t("messages.about", "About Us")}
              </h2>

              <p className="mt-4 max-w-xl text-[15px] leading-6 tracking-[0.12em] text-[#185C9B]">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. Lorem
                Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </p>

              <button
                type="button"
                className="mt-6 inline-flex items-center border-2 justify-center border border-[#C46A2A] px-8 py-3 text-[15px] font-semibold tracking-[0.1em] text-[#C46A2A] hover:bg-[#C46A2A] hover:text-white transition"
              >
                See More
              </button>

              {/* two small images */}
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="overflow-hidden rounded-sm">
                  <img
                    src="/images/about/image1.png"
                    alt=""
                    className="h-[170px] w-full object-cover sm:h-[190px]"
                  />
                </div>

                <div className="overflow-hidden rounded-sm">
                  <img
                    src="/images/about/image2.png"
                    alt=""
                    className="h-[170px] w-full object-cover sm:h-[190px]"
                  />
                </div>
              </div>
            </div>

            {/* Right big image */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-sm">
                <img
                  src="/images/about/image3.png"
                  alt=""
                  className="h-[360px] w-full object-cover sm:h-[430px] lg:h-[606px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= AVAILABLE ================= */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="mt-3 text-[35px] tracking-[0.25em] text-[#D4793F]">
            AVAILABLE
          </h2>
          <p className="text-[15px] tracking-[0.25em] text-[#185C9B]">
            Business Insights & Beyond
          </p>
         

          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
            {["SNACK1", "SNACK2", "SNACK3"].map((item, i) => (
              <div key={i} className="text-center">
                {/* 01 */}
                <div className="text-[35px] font-semibold tracking-[0.12em] text-[#C46A2A]">
                  0{i + 1}
                </div>

                {/* ✅ rectangle (center) */}
                <div className="mt-4">
                  <img
                    src="/images/rectangle.png"
                    alt=""
                    className="mx-auto h-[18px] w-[18px] object-contain"
                  />
                </div>

                {/* SNACK1 */}
                <div className="mt-5 text-[18px] font-semibold tracking-[0.35em] text-[#185C9B]">
                  {item}
                </div>

                {/* ✅ justify text */}
                <p className="mx-auto mt-4 max-w-[260px] text-[12px] leading-6 tracking-[0.12em] text-slate-700 text-justify">
                  Lorem Ipsum is simply dummy text of the printing and typesetting
                  industry. Lorem Ipsum has been the industry's standard dummy text ever
                  since the 1500s, when an unknown printer took a galley of type and
                  scrambled it to make a type specimen book.
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="mt-3 text-[35px] tracking-[0.25em] text-[#D4793F]">
            OUR PRODUCTS
          </h2>
          <p className="text-[15px] tracking-[0.25em] text-[#185C9B]">
            Business Insights & Beyond
          </p>
         

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src={`/images/products/p${i}.png`}
                className="w-full rounded-md"
                alt=""
              />
            ))}
          </div>

          <Link
            href={route("products")}
            className="
              mt-10 inline-flex items-center justify-center
              border-2 border-[#C46A2A]
              px-8 py-3 text-[12px]
              font-semibold tracking-[0.18em]
              text-[#C46A2A]
              hover:bg-[#C46A2A] hover:text-white transition
            "
          >
            See More
          </Link>
        </div>
      </section>

      {/* ================= PROMOTION ================= */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mt-3 text-center text-[35px] tracking-[0.25em] text-[#D4793F]">
            PROMOTIONS OR NEWS
          </h2>
          <p className="text-center text-[15px] tracking-[0.25em] text-[#185C9B]">
            Business Insights & Beyond
          </p>
          

          {/* List */}
          <div className="mt-12 space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-8 border-slate-200 pb-8">
                {/* Left image */}
                <img
                  src={`/images/promotion/promo-${i}.png`}
                  alt=""
                  className="h-[95px] w-[170px] shrink-0 object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />

                {/* Right content */}
                <div className="min-w-0 flex-1">
                  {/* Title row + NEW badge */}
                  <div className="flex items-start justify-between gap-6">
                    <h3 className="text-[28px] font-semibold tracking-[0.12em] text-slate-900">
                      Title
                    </h3>

                    <div className="mt-2 shrink-0 bg-[#1E4F7A] px-6 py-1 text-[12px] font-semibold tracking-[0.25em] text-white">
                      NEW
                    </div>
                  </div>

                  {/* dotted line under title */}
                  <div className=" h-[1px] w-full border-t border-dotted border-slate-300" />

                  {/* description */}
                  <p className="mt-3 text-[13px] leading-6 tracking-[0.12em] text-slate-700">
                    Lorem Ipsum is simply dummy text of the printing and typesetting
                    industry. Lorem Ipsum has been the industry&apos;s standard dummy
                    text ever since the 1500s, when an unknown printer took a galley of
                    type and scrambled it to make a type specimen book........
                  </p>
                </div>
              </div>
            ))}
          </div>


          <div className="mt-10 text-center">
            <Link
              href={route("promotion")}
              className="
                inline-flex items-center justify-center
                border-2 border-[#C46A2A]
                px-8 py-3 text-[12px]
                font-semibold tracking-[0.18em]
                text-[#C46A2A]
                hover:bg-[#C46A2A] hover:text-white transition
              "
            >
              See More
            </Link>
          </div>
        </div>
      </section>

       <section className="py-10">
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
