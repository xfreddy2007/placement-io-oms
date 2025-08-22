import React from "react";
import classNames from "classnames";

type PaginationProps = {
  currentPage: number;
  paginationList: number[];
  hasPreviousHiddenPagination: boolean;
  hasNextHiddenPagination: boolean;
  isPreviousPageCtaDisabled: boolean;
  isNextPageCtaDisabled: boolean;
  onPaginationChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  paginationList,
  hasPreviousHiddenPagination,
  hasNextHiddenPagination,
  isPreviousPageCtaDisabled,
  isNextPageCtaDisabled,
  onPaginationChange,
}) => {
  return (
    <div className="flex h-12 w-full items-center justify-center gap-x-4 py-3 border-[1px] border-solid border-gray-500">
      <button
        disabled={isPreviousPageCtaDisabled}
        className="cursor-pointer"
        onClick={() => onPaginationChange(currentPage - 1)}
      >
        {"<"}
      </button>
      {hasPreviousHiddenPagination && <div>...</div>}
      {paginationList.map((pageItem) => {
        return (
          <button
            key={crypto.randomUUID()}
            className={classNames(
              "cursor-pointer",
              currentPage === pageItem && "underline"
            )}
            onClick={() => onPaginationChange(pageItem)}
          >
            {pageItem}
          </button>
        );
      })}
      {hasNextHiddenPagination && <div>...</div>}
      <button
        disabled={isNextPageCtaDisabled}
        className="cursor-pointer"
        onClick={() => onPaginationChange(currentPage + 1)}
      >
        {">"}
      </button>
    </div>
  );
};

export default React.memo(Pagination);
