import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

//pagination component
const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const paginate = (pageNumber) => onPageChange(pageNumber);
  const nextPage = () => onPageChange(Math.min(currentPage + 1, totalPages));
  const prevPage = () => onPageChange(Math.max(currentPage - 1, 1));

  return (
    <div className="flex justify-between items-center mt-auto pt-2 border-t border-white dark:border-darkBorder">
      {/* Previous Button */}
      <button
        onClick={prevPage}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded flex items-center transition ${
          currentPage === 1
            ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
            : "text-darkText dark:text-lightText hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        <FontAwesomeIcon icon={faChevronLeft} className="mr-1" /> Prev
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(num => num === 1 || num === totalPages || (num >= currentPage - 1 && num <= currentPage + 1))
          .map((number, idx, arr) => {
            if (idx > 0 && arr[idx - 1] !== number - 1) {
              return (
                <React.Fragment key={`ellipsis-${number}`}>
                  <span className="px-2 py-1 text-gray-500 dark:text-gray-400">...</span>
                  <button
                    onClick={() => paginate(number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full transition ${
                      currentPage === number
                        ? "bg-purpleAccent text-lightText"
                        : "text-darkText dark:text-lightText hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {number}
                  </button>
                </React.Fragment>
              );
            }
            return (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition ${
                  currentPage === number
                    ? "bg-purpleAccent text-lightText"
                    : "text-darkText dark:text-lightText hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {number}
              </button>
            );
          })}
      </div>

      {/* Next Button */}
      <button
        onClick={nextPage}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded flex items-center transition ${
          currentPage === totalPages
            ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
            : "text-darkText dark:text-lightText hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        Next <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
      </button>
    </div>
  );
};
export default Pagination;
