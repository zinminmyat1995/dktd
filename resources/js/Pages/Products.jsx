import { useState } from 'react';
import InnerPageLayout from "@/Layouts/InnerPageLayout";

const ITEMS_PER_PAGE = 9;

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
  { id: 10, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
  { id: 11, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
  { id: 12, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
  { id: 13, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
  { id: 14, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
  { id: 15, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
  { id: 16, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
  { id: 17, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
  { id: 18, img: "/images/products/p7.png", tag: "PASTRY", label: "COOKIES" },
  { id: 19, img: "/images/products/p8.png", tag: "PASTRY", label: "COOKIES" },
  { id: 20, img: "/images/products/p9.png", tag: "PASTRY", label: "COOKIES" },
  { id: 21, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
  { id: 22, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
  { id: 23, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
  { id: 24, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
  { id: 25, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
  { id: 26, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
  { id: 27, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
  { id: 28, img: "/images/products/p1.png", tag: "PASTRY", label: "COOKIES" },
];

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(demoProducts.length / ITEMS_PER_PAGE);
  
  // Get current items
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = demoProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
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
            {currentItems.map((p) => (
              <ProductCard key={p.id} item={p} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-14 flex justify-center">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => paginate(1)} 
                disabled={currentPage === 1}
                className="h-9 w-9 border border-slate-400 bg-white text-[13px] font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-50"
              >
                «
              </button>
              <button 
                onClick={() => paginate(Math.max(1, currentPage - 1))} 
                disabled={currentPage === 1}
                className="h-9 w-9 border border-slate-400 bg-white text-[13px] font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-50"
              >
                ‹
              </button>
              
              {pageNumbers.map(number => (
                <PageBox 
                  key={number} 
                  active={currentPage === number}
                  onClick={() => paginate(number)}
                >
                  {number}
                </PageBox>
              ))}
              
              <button 
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))} 
                disabled={currentPage === totalPages}
                className="h-9 w-9 border border-slate-400 bg-white text-[13px] font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-50"
              >
                ›
              </button>
              <button 
                onClick={() => paginate(totalPages)} 
                disabled={currentPage === totalPages}
                className="h-9 w-9 border border-slate-400 bg-white text-[13px] font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-50"
              >
                »
              </button>
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

function PageBox({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
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
