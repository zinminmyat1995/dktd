import { usePage } from "@inertiajs/react";

export default function InnerBanner({
  title,
  titleClassName = "",
  image = "/images/banner3.png",
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
    ? "h-[120px] sm:h-[180px] md:h-[220px] lg:h-[250px]"
    : "h-[150px] sm:h-[200px] md:h-[250px] lg:h-[280px] xl:h-[320px]";

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
              "leading-none text-[#7A3B14] drop-shadow-sm font-display",
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
