import {useCallback, useEffect, useMemo, useState} from 'react';

import {Table} from '@tanstack/react-table';

type UseTablePaginationProps<T> = {
  table: Table<T>;
  maxPageCount?: number;
  pageSize?: number;
};

type UseTablePaginationReturn = {
  paginationList: number[];
  currentPage: number;
  onPaginationChange: (page: number) => void;
};

export default function useTablePagination<T>({
  table,
  maxPageCount = 5,
  pageSize,
}: UseTablePaginationProps<T>): UseTablePaginationReturn {
  const sortedRowModel = table.getSortedRowModel();
  const [currentPage, setCurrentPage] = useState(1);
  const paginationList = useMemo(() => {
    if (sortedRowModel) {
      const numOfPages = Math.min(maxPageCount, table.getPageCount()) || 1;

      // If pages is less than or equal to maxPageCount, return all pages
      if (table.getPageCount() <= maxPageCount) {
        return Array.from({length: numOfPages}, (_, i) => i + 1);
      }

      const middlePageIndex = Math.floor(numOfPages / 2);

      // For current page is less than middlePageIndex, get the first maxPageCount pages
      if (currentPage <= middlePageIndex) {
        return Array.from({length: numOfPages}, (_, i) => i + 1);
      }

      // For current page is greater than middlePageIndex, get the last maxPageCount pages
      if (currentPage > table.getPageCount() - middlePageIndex) {
        return Array.from(
          {length: numOfPages},
          (_, i) => table.getPageCount() - numOfPages + i + 1,
        );
      }

      // Get the maxPageCount pages around the current page

      const startPage = Math.max(1, currentPage - middlePageIndex);

      return Array.from({length: numOfPages}, (_, i) => startPage + i);
    }
    return [];
  }, [currentPage, maxPageCount, sortedRowModel, table]);

  useEffect(() => {
    if (sortedRowModel) setCurrentPage(1);
  }, [sortedRowModel]);

  useEffect(() => {
    if (pageSize) {
      table.setPageSize(pageSize);
      setCurrentPage(1);
      table.setPageIndex(0);
    }
  }, [pageSize, table]);

  const onPaginationChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      table.setPageIndex(page - 1);
    },
    [table],
  );

  return {
    paginationList,
    currentPage,
    onPaginationChange,
  };
}
