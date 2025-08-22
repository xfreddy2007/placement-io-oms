import { Table } from "@tanstack/react-table";
import classNames from "classnames";
import React, { useState, useCallback } from "react";

export type FilterObjectType = {
  searchValue: string;
  category?: string | undefined;
};

type TableHeadBarProps<T> = {
  table: Table<T>;
  filterTarget: string;
  categories?: string[];
};

const TableHeadBar = <T,>({
  table,
  filterTarget,
  categories,
}: TableHeadBarProps<T>) => {
  const [searchValue, setSearchValue] = useState("");
  const [currentCategory, setCurrentCategory] = useState<string | undefined>(
    undefined
  );

  const toggleCategory = useCallback((selectedCategory: string) => {
    setCurrentCategory((prev) => {
      return prev === selectedCategory ? undefined : selectedCategory;
    });
  }, []);

  return (
    <div className="flex items-center w-full py-2 gap-x-4">
      <div className="border-[1px] border-black rounded-md p-2 flex gap-x-1">
        <img src="/Icon/svg/search.svg" loading="lazy" alt="search" />
        <input
          value={searchValue}
          onChange={(e) => {
            const value = e.target.value;
            const filterObject = {
              searchValue: value,
              category: currentCategory,
            };
            table.getColumn(filterTarget)?.setFilterValue(filterObject);
            setSearchValue(value);
          }}
          className="focus:outline-0"
        />
      </div>
      {categories && categories.length > 0 && (
        <div className="flex items-center gap-x-2">
          {categories.map((item) => {
            return (
              <div
                key={crypto.randomUUID()}
                className={classNames(
                  "cursor-pointer border-[1px] border-black px-4 py-2 rounded-md hover:border-gray-300",
                  currentCategory === item && "border-[2px] border-red-500"
                )}
                onClick={() => {
                  const filterObject = {
                    searchValue,
                    category: currentCategory === item ? undefined : item,
                  };
                  table.getColumn(filterTarget)?.setFilterValue(filterObject);
                  toggleCategory(item);
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TableHeadBar;
