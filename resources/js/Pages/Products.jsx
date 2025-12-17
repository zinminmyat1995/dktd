import InnerPageLayout from "@/Layouts/InnerPageLayout";

const demoProducts = [
  { id: 1, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
  { id: 2, img: "/images/products/p2.png", tag: "PASTRY", label: "COOKIES" },
  { id: 3, img: "/images/products/p3.png", tag: "PASTRY", label: "COOKIES" },
  { id: 4, img: "/images/products/p4.png", tag: "PASTRY", label: "COOKIES" },
  { id: 5, img: "/images/products/p5.png", tag: "PASTRY", label: "COOKIES" },
  { id: 6, img: "/images/products/p6.png", tag: "PASTRY", label: "COOKIES" },
  { id: 7, img: "/images/products/p7.png", tag: "PASTRY", label: "COOKIES" },
  { id: 8, img: "/images/products/p8.png", tag: "PASTRY", label: "COOKIES" },
  { id: 9, img: "/images/products/p9.png", tag: "PASTRY", label: "COOKIES" },
];

export default function Products() {
  return (
    <InnerPageLayout titleKey="messages.products">
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Heading */}
          <div className="text-center">
            <h2 className="text-[35px] font-semibold tracking-[0.25em] text-[#D4793F]">
              OUR PRODUCTS
            </h2>
            <p className="mt-3 text-[15px] font-semibold tracking-[0.25em] text-[#185C9B]">
              Business Insights &amp; Beyond
            </p>
          </div>

          {/* Sort button */}
          <div className="mt-10 flex justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-3 bg-[#185C9B] px-6 py-2 text-[12px] font-semibold tracking-[0.18em] text-white hover:opacity-90"
            >
              <SortIcon className="h-4 w-4" />
              Sort By
            </button>
          </div>

          {/* Grid */}
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {demoProducts.map((p) => (
              <ProductCard key={p.id} item={p} />
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

function ProductCard({ item }) {
  return (
    <div className="relative overflow-hidden">
      <img
        src={item.img}
        alt=""
        className="h-[300px] w-full object-cover sm:h-[320px] lg:h-[340px]"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />

      {/* fallback if image missing */}
      {/* <div className="h-[300px] w-full bg-slate-50 sm:h-[320px] lg:h-[340px]" /> */}

      {/* Top-right tag */}
      <div className="absolute right-4 top-4 bg-[#185C9B] px-4 py-1 text-[12px] font-semibold tracking-[0.2em] text-white">
        {item.tag}
      </div>

      {/* Bottom-left label */}
      <div className="absolute bottom-4 left-4 text-[12px] font-semibold tracking-[0.25em] text-white/80">
        {item.label}
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
