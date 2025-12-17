import InnerPageLayout from "@/Layouts/InnerPageLayout";
import useTranslate from "@/hooks/useTranslate";

const demoPromos = [
  {
    id: 1,
    img: "/images/promotion/promo-1.png",
    title: "Title",
    date: "12-March 2025",
    badge: "New",
    desc:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book........",
  },
  {
    id: 2,
    img: "/images/promotion/promo-2.png",
    title: "Title",
    date: "12-March 2025",
    badge: "New",
    desc:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book........",
  },
  {
    id: 3,
    img: "/images/promotion/promo-3.png",
    title: "Title",
    date: "12-March 2025",
    badge: "New",
    desc:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book........",
  },
  {
    id: 4,
    img: "/images/promotion/promo-4.png",
    title: "Title",
    date: "12-March 2025",
    badge: "New",
    desc:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book........",
  },
  {
    id: 5,
    img: "/images/promotion/promo-5.png",
    title: "Title",
    date: "12-March 2025",
    badge: "New",
    desc:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book........",
  },
  {
    id: 6,
    img: "/images/promotion/promo-6.png",
    title: "Title",
    date: "12-March 2025",
    badge: "New",
    desc:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book........",
  },
  {
    id: 7,
    img: "/images/promotion/promo-7.png",
    title: "Title",
    date: "12-March 2025",
    badge: "New",
    desc:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book........",
  },
];

export default function Promotion() {
  const { t } = useTranslate();

  return (
    <InnerPageLayout titleKey="messages.promotion">
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Heading */}
          <div className="text-center">
            <h2 className="text-[35px] font-semibold tracking-[0.25em] text-[#D4793F]">
              PROMOTIONS
            </h2>
            <p className="mt-3 text-[15px] font-semibold tracking-[0.25em] text-[#185C9B]">
              Business Insights &amp; Beyond
            </p>
          </div>

          {/* Sort button row */}
          <div className="mt-10 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-3 bg-[#185C9B] px-6 py-2 text-[12px] font-semibold tracking-[0.18em] text-white hover:opacity-90"
            >
              <SortIcon className="h-4 w-4" />
              Sort By
            </button>
          </div>

          {/* List */}
          <div className="mt-10 space-y-8">
            {demoPromos.map((p) => (
              <PromoRow key={p.id} item={p} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-14 flex justify-center">
            <div className="flex items-center gap-2">
              <PageBox active={false}>1</PageBox>
              <PageBox active={true}>2</PageBox>
              <PageBox active={false}>3</PageBox>
              <PageBox active={false}>4</PageBox>
            </div>
          </div>
        </div>
      </section>
    </InnerPageLayout>
  );
}

function PromoRow({ item }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
      {/* Left image */}
      <div className="md:col-span-4">
        <div className="relative overflow-hidden border border-slate-200">
          {/* NEW badge */}
          <div className="absolute left-0 top-0 z-10 bg-[#185C9B] px-6 py-1 text-[12px] font-semibold tracking-[0.2em] text-white">
            {item.badge}
          </div>

          <img
            src={item.img}
            alt={item.title}
            className="h-[150px] w-full object-cover md:h-[165px]"
            onError={(e) => {
              // fallback blank
              e.currentTarget.style.display = "none";
            }}
          />

          {/* if image missing, keep height */}
          {/* <div className="h-[150px] w-full bg-slate-50 md:h-[165px]" /> */}
        </div>
      </div>

      {/* Right content */}
      <div className="relative md:col-span-8">
        {/* Title + Date row */}
        <div className="flex items-end justify-between gap-4">
          <h3 className="text-[30px] font-semibold tracking-[0.12em] text-slate-900">
            {item.title}
          </h3>

          <div className="bg-[#185C9B] px-6 py-1 text-[12px] font-semibold tracking-[0.2em] text-white">
            {item.date}
          </div>
        </div>

        {/* ✅ dotted line: title အောက် + date အောက် “တန်းတူ” */}
        <div className="mt-2 h-[1px] w-full border-t border-dotted border-slate-300" />

        <p className="mt-3 text-[15px] leading-6 tracking-[0.12em] text-slate-800">
          {item.desc}
        </p>
      </div>
    </div>
  );
}

function PageBox({ active, children }) {
  return (
    <button
      type="button"
      className={[
        "h-9 w-9 border text-[13px] font-semibold",
        active
          ? "border-[#1E4F7A] bg-[#1E4F7A] text-white"
          : "border-slate-400 bg-white text-slate-900 hover:bg-slate-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function SortIcon({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h10" />
      <path d="M3 12h14" />
      <path d="M3 18h18" />
      <path d="M17 6l2 2 2-2" />
    </svg>
  );
}
