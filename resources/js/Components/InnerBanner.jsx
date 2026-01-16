import { usePage } from "@inertiajs/react";

export default function InnerBanner({
  title,
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

        {/* Overlays */}
        {/* dark-to-transparent gradient (left focus) */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
        {/* subtle top shade for header separation */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent" />
        {/* bottom fade into page background */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/70 to-transparent" />
      
        {/* Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-12">
          <div className="max-w-2xl">
            

            {/* Title card */}
            <div className="mt-4 inline-block rounded-[28px] border border-white/20 bg-white/10 px-6 py-5 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.28)]">
              <h1
                className={[
                  "text-[28px] sm:text-[38px] md:text-[46px] lg:text-[54px]",
                  "leading-[1.05] text-white drop-shadow",
                  titleClass,
                ].join(" ")}
              >
                {title}
              </h1>

              {subtitle ? (
                <p className="mt-2 max-w-xl text-[12px] sm:text-[13px] md:text-[14px] text-white/85 tracking-wide">
                  {subtitle}
                </p>
              ) : null}

              {/* tiny underline */}
              <div className="mt-4 h-[2px] w-16 rounded-full bg-gradient-to-r from-[#D4793F] to-white/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
