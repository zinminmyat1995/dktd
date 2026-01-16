import { usePage } from "@inertiajs/react";

export default function InnerBanner({
  title,
  titleClassName = "",
  image = "/images/banner.png",
  objectPosition = "center",
  subtitle = "", // optional: small line under title
  compact = false, // optional: smaller banner for some pages
}) {
  const { props } = usePage();
  const locale = props.locale ?? "en";

  // Title font style
  const titleClass = locale === "en" ? "font-[cursive]" : "font-SemiBold";

  // Responsive heights
  const h = compact
    ? "h-[170px] sm:h-[210px] md:h-[240px] lg:h-[280px]"
    : "h-[210px] sm:h-[260px] md:h-[320px] lg:h-[380px] xl:h-[420px]";

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div className={`relative w-full ${h}`}>
        {/* Background image */}
        <img
          src={image}
          alt="Page banner"
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
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
