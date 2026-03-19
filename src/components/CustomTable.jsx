import { PencilIcon } from "@heroicons/react/24/solid";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import InputArea from "./Inputarea";
import { getNestedValue } from "../utils/common";

export function CustomTable({
  column,
  data,
  heading,
  filter,
  setFilter,
  count,
}) {
  const pageSize = filter?.pageSize || 5;
  const pageNumber = filter?.pageNumber || 1;
  const searchQuery = filter?.filter?.searchQuery || "";
  const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize));
  const [searchValue, setSearchValue] = useState(searchQuery);

  const isSameFilter = useCallback(
    (prev, next) =>
      prev?.pageNumber === next?.pageNumber &&
      prev?.pageSize === next?.pageSize &&
      prev?.sortOrder === next?.sortOrder &&
      (prev?.filter?.searchQuery || "") === (next?.filter?.searchQuery || ""),
    [],
  );

  const updateFilter = useCallback(
    (updater) => {
      setFilter((prev) => {
        const next = updater(prev);
        return isSameFilter(prev, next) ? prev : next;
      });
    },
    [isSameFilter, setFilter],
  );

  useEffect(() => {
    setSearchValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentQuery = filter?.filter?.searchQuery || "";
      if (searchValue === currentQuery) {
        return;
      }

      updateFilter((prev) => ({
        ...prev,
        pageNumber: 1,
        filter: {
          ...(prev?.filter || {}),
          searchQuery: searchValue,
        },
      }));
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchValue, filter?.filter?.searchQuery, updateFilter]);

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === pageNumber) {
      return;
    }

    updateFilter((prev) => ({
      ...prev,
      pageNumber: nextPage,
    }));
  };

  const pageItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const items = [1];
    const start = Math.max(2, pageNumber - 1);
    const end = Math.min(totalPages - 1, pageNumber + 1);

    if (start > 2) {
      items.push("left-ellipsis");
    }

    for (let page = start; page <= end; page += 1) {
      items.push(page);
    }

    if (end < totalPages - 1) {
      items.push("right-ellipsis");
    }

    items.push(totalPages);
    return items;
  }, [pageNumber, totalPages]);

  return (
    <Card className="h-full w-full shadow-none mt-3">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <Typography variant="h5" color="blue-gray">
              {heading}
            </Typography>
          </div>
          <div className="flex w-full shrink-0 gap-2 md:w-max">
            <div className="w-full md:w-72">
              <InputArea
                id="table-search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="py-2  overflow-scroll px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {column.map((head) => (
                <th
                  key={head.key || head.name}
                  className="border-y border-black px-2 py-1"
                >
                  <p className="font-semibold text-xs text-black leading-none opacity-70">
                    {head?.name}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((e, i) => {
              const isLast = i === data.length - 1;
              const classes = isLast
                ? "p-2"
                : "p-2 border-b border-blue-gray-50";

              return (
                <tr key={i} className="hover:bg-gray-50">
                  {column.map((col) => {
                    // Agar action type hai
                    if (col.type === "action" && col.formatter) {
                      return (
                        <td key={col.name} className={`${classes} text-right`}>
                          {col.formatter(e)}
                        </td>
                      );
                    }

                    // Simple value extraction for nested properties
                    const value = col.key
                      ? getNestedValue(e, col.key)
                      : undefined;

                    // Agar formatter hai to use karo, otherwise direct value
                    const displayValue = col.formatter
                      ? col.formatter(value, e)
                      : value;

                    return (
                      <td
                        title={value}
                        key={col.key || col.name}
                        className={classes}
                      >
                        <p className="font-medium text-[11px] text-black leading-none opacity-70">
                          {displayValue ?? "-"}
                        </p>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-2">
        <Button
          variant="outlined"
          size="sm"
          disabled={pageNumber <= 1}
          onClick={() => goToPage(pageNumber - 1)}
        >
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {pageItems.map((item) =>
            typeof item === "number" ? (
              <IconButton
                key={item}
                variant={item === pageNumber ? "outlined" : "text"}
                size="sm"
                onClick={() => goToPage(item)}
              >
                {item}
              </IconButton>
            ) : (
              <IconButton key={item} variant="text" size="sm" disabled>
                ...
              </IconButton>
            ),
          )}
        </div>
        <Button
          variant="outlined"
          size="sm"
          disabled={pageNumber >= totalPages}
          onClick={() => goToPage(pageNumber + 1)}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
