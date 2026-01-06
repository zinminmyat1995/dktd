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
            <h1 className="text-[36px] text-[#7A3B14] font-display font-SemiBold">
              Lorem Ipsum Is Simply Dummy
            </h1>

            <div className="mt-4 flex items-center gap-4 text-[#2C5A7A]">
              <span className="h-[1px] w-16 bg-[#2C5A7A]" />
              <span>★</span>
              <span className="h-[1px] w-16 bg-[#2C5A7A]" />
            </div>

            <p className="mt-4 max-w-md text-[14px] tracking-[0.15em] text-[#2C5A7A] font-sans">
              Lorem Ipsum is simply dummy text of t.
            </p>

            <Link
              href={route("contact")}
              className="
                mt-6 inline-flex items-center justify-center
                border-2 border-[#C46A2A]
                px-8 py-3 text-[12px]
                font-SemiBold tracking-[0.18em]
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
              <p className="text-[20px] font-SemiBold tracking-[0.25em] text-[#185C9B]">
                Business Insights &amp; Beyond
              </p>

              <h2 className="mt-3 text-[34px] font-SemiBold tracking-[0.25em] text-[#C46A2A] sm:text-[40px] font-display">
                {t("messages.about", "About Us")}
              </h2>

              <p className="mt-4 max-w-xl text-[15px] font-Medium leading-6 tracking-[0.12em] text-[#185C9B]">
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
                className="mt-6 inline-flex items-center rounded-3xl border-2 justify-center border border-[#C46A2A] px-8 py-3 text-[15px] font-SemiBold tracking-[0.1em] text-[#C46A2A] hover:bg-[#C46A2A] hover:text-white transition"
              >
                See More
              </button>

              {/* two small images */}
              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className="overflow-hidden rounded-sm rounded-2xl ">
                  <img
                    src="/images/about/image1.png"
                    alt=""
                    className="h-[170px] w-full object-cover sm:h-[190px] hover:scale-105 transition-all duration-300"
                  />
                </div>

                <div className="overflow-hidden rounded-sm rounded-2xl">
                  <img
                    src="/images/about/image2.png"
                    alt=""
                    className="h-[170px] w-full object-cover sm:h-[190px] hover:scale-105 transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Right big image */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-sm rounded-2xl">
                <img
                  src="/images/about/image3.png"
                  alt=""
                  className="h-[360px] w-full object-cover sm:h-[430px] lg:h-[606px] hover:scale-105 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OUR PRODUCTS ================= */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="mt-3 text-[35px] tracking-[0.25em] text-[#D4793F] font-display font-SemiBold">
              OUR PRODUCTS
            </h2>
            <p className="text-[15px] tracking-[0.25em] text-[#185C9B]">
              Business Insights & Beyond
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                name: "SNACKS",
                description: "Discover our delicious range of healthy and tasty snacks perfect for any time of day. Made with the finest ingredients for maximum flavor and satisfaction.",
                image: "/images/products/p1.png"
              },
              {
                id: 2,
                name: "COOKIES",
                description: "Crunchy, chewy, and full of flavor - our cookies are made with premium ingredients. Perfect for a quick snack or a sweet treat any time of day.",
                image: "/images/products/p2.png"
              },
              {
                id: 3,
                name: "CRACKERS",
                description: "Light, crispy, and perfectly seasoned crackers for your snacking pleasure. Great on their own or paired with your favorite dips and spreads.",
                image: "/images/products/p3.png"
              }
            ].map((product) => (
              <div key={product.id} className="group relative h-120 overflow-hidden rounded-2xl bg-gray-50 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-amber-100/20">
                {/* Product Image */}
                <div className="h-full w-full overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.png';
                    }}
                  />
                </div>
                
                {/* Product Info Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end rounded-2xl bg-gradient-to-t from-black/60 via-black/0 to-transparent p-6 text-white transition-all duration-300 group-hover:from-black/70 group-hover:via-black/0">
                  <div className="mb-2">
                    <span className="text-xl font-SemiBold text-white font-display">
                      0{product.id}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-SemiBold tracking-wider text-white mb-2 ">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm leading-5 text-white mb-4 line-clamp-2 transition-all duration-300 group-hover:line-clamp-3">
                    {product.description}
                  </p>
                  
                  <Link
                    href={route("products")}
                    className="inline-flex items-center text-sm font-SemiBold text-[#D4793F] hover:text-amber-200 transition-colors"
                  >
                    Explore Collection
                    <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={route("products")}
              className="
                inline-flex items-center justify-center
                border-2 border-[#C46A2A]
                px-8 py-3 text-[12px]
                font-SemiBold tracking-[0.18em]
                text-[#C46A2A]
                hover:bg-[#C46A2A] hover:text-white transition
                rounded-3xl
              "
            >
              View All Products
            </Link>
          </div>
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
                    <h3 className="text-[28px] font-regular tracking-[0.12em] text-slate-900">
                      Title
                    </h3>

                    <div className="mt-2 shrink-0 bg-[#1E4F7A] px-6 py-1 text-[12px] font-SemiBold tracking-[0.25em] text-white">
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
                font-SemiBold tracking-[0.18em]
                text-[#C46A2A]
                hover:bg-[#C46A2A] hover:text-white transition
                rounded-3xl
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
              <p className="text-[15px] font-SemiBold tracking-[0.25em] text-[#185C9B]">
                Business Insights &amp; Beyond
              </p>

              <h2 className="mt-1 text-[32px] font-SemiBold tracking-[0.25em] text-[#D4793F]">
                OUR LOCATION
              </h2>

              <div className="mt-5 space-y-6 text-[15px]  tracking-[0.12em] text-slate-900">
                <div>
                  Opening Hour : <span className="font-SemiBold">9am to 9pm</span>
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
