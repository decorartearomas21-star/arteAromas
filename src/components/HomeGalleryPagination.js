"use client";

const getVisiblePageItems = (totalPages, currentPage) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  const items = [0];
  const windowStart = Math.max(1, currentPage - 1);
  const windowEnd = Math.min(totalPages - 2, currentPage + 1);

  if (windowStart > 1) {
    items.push("ellipsis-start");
  }

  for (let pageIndex = windowStart; pageIndex <= windowEnd; pageIndex += 1) {
    items.push(pageIndex);
  }

  if (windowEnd < totalPages - 2) {
    items.push("ellipsis-end");
  }

  items.push(totalPages - 1);
  return items;
};

export default function HomeGalleryPagination({ totalPages, currentPage, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
      {getVisiblePageItems(totalPages, currentPage).map((item) => {
        if (typeof item === "string") {
          return (
            <span
              key={item}
              className="px-1 text-sm font-black tracking-wide text-(--logo2)/40"
              aria-hidden="true"
            >
              ...
            </span>
          );
        }

        const isActive = currentPage === item;

        return (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className={`min-w-9 rounded-full px-3 py-2 text-sm font-black transition-all ${
              isActive
                ? "bg-(--logo2) text-(--logo1) shadow-md"
                : "border border-(--logo2)/20 bg-white/90 text-(--logo2) hover:border-(--logo2)/40"
            }`}
            aria-label={`Ir para a página ${item + 1}`}
            aria-current={isActive}
          >
            {item + 1}
          </button>
        );
      })}
    </div>
  );
}
