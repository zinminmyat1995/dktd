import InnerPageLayout from "@/Layouts/InnerPageLayout";
import useTranslate from "@/hooks/useTranslate";

export default function About() {
  const { t } = useTranslate();

  return (
    <InnerPageLayout titleKey="messages.about">
      {/* Section 1: About Us (left text + right big image + 2 small images) */}
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
                Contact US
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

      {/* Section 2: Our Leader (left image + right text) */}
      <section className="py-10 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
            {/* Left image */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-sm bg-slate-50">
                <img
                  src="/images/about/image4.png"
                  alt=""
                  className="h-[260px] w-full object-cover sm:h-[320px]"
                />
              </div>
            </div>

            {/* Right text */}
            <div className="lg:col-span-7">
              <p className="text-[20px] font-semibold tracking-[0.35em] text-[#185C9B]">
                Business Insights &amp; Beyond
              </p>

              <h2 className="mt-3 text-[32px] font-semibold tracking-[0.25em] text-[#C46A2A] sm:text-[38px]">
                Our Leader
              </h2>

              <p className="mt-4 text-[15px] leading-6 tracking-[0.12em] text-[#185C9B]">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.Lorem
                Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.standard
                dummy text ever since the 1500s, when an unknown printer took a
                galley of type and scrambled it to make a type specimen book.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Our Factory (left text + right image) */}
      <section className="py-10 sm:py-14 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
            {/* Left text */}
            <div className="lg:col-span-7">
              <p className="text-[20px] font-semibold tracking-[0.35em] text-[#185C9B]">
                Business Insights &amp; Beyond
              </p>

              <h2 className="mt-3 text-[32px] font-semibold tracking-[0.25em] text-[#C46A2A] sm:text-[38px]">
                Our Factory
              </h2>

              <p className="mt-4 text-[15px] leading-6 tracking-[0.12em] text-[#185C9B]">
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.Lorem
                Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.standard
                dummy text ever since the 1500s, when an unknown printer took a
                galley of type and scrambled it to make a type specimen book.
              </p>
            </div>

            {/* Right image */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-sm bg-slate-50">
                <img
                  src="/images/about/image5.png"
                  alt=""
                  className="h-[260px] w-full object-cover sm:h-[320px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </InnerPageLayout>
  );
}
