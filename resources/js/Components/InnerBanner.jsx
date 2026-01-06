import { usePage } from "@inertiajs/react";

export default function InnerBanner({
  title,
  image = "/images/banner.png",
  // banner image ရဲ့ focus ကိုညှိချင်ရင် override လုပ်လို့ရ
  objectPosition = "center",
}) {
  const { props } = usePage();
  const locale = props.locale ?? "en";

  // Title font style (optional)
  const titleClass = locale === "en" ? "font-[cursive]" : "font-SemiBold";

  return (
    <section className="relative w-full overflow-hidden">
      {/* Responsive heights:
          mobile: 140px
          sm: 170px
          md: 200px
          lg: 230px
      */}
      <div className="relative w-full border-b border-slate-100 h-[140px] sm:h-[170px] md:h-[200px] lg:h-[230px]">
        {/* Banner image */}
        <img
          src={image}
          alt="Page banner"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition }}
          draggable={false}
        />

        {/* Optional overlay for readability (မလိုရင် comment လုပ်) */}
        <div className="absolute inset-0 bg-white/10" />

        {/* Title overlay */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <h1
            className={[
              // responsive title size
              "text-[28px] sm:text-[34px] md:text-[40px] lg:text-[44px]",
              "leading-none text-[#7A3B14] drop-shadow-sm",
              titleClass,
            ].join(" ")}
          >
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
