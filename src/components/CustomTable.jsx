import { useMemo } from "react";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
} from "@material-tailwind/react";
import { getNestedValue } from "../utils/common";

export function CustomTable({
  column,
  data,
  heading,
  filterComponent,
  filter,
  setFilter,
  count,
}) {
  const pageSize = filter?.pageSize || 5;
  const pageNumber = filter?.pageNumber || 1;
  const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize));

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages || nextPage === pageNumber) {
      return;
    }

    setFilter((prev) => ({
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
    <Card className="h-full w-full shadow-none rounded-none">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4">
          {/* <div>
            <Typography variant="h5" color="blue-gray">
              {heading}
            </Typography>
          </div> */}
          {filterComponent ? (
            <div className="mt-3">{filterComponent}</div>
          ) : null}
        </div>
      </CardHeader>
      <CardBody className="py-2  overflow-auto px-0">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr className="rounded-xl bg-[#F5F5F5]">
              {column.map((head, index) => {
                const isFirst = index === 0;
                const isLast = index === column.length - 1;

                return (
                  <th
                    key={head.key || head.name}
                    className={`py-4 px-2 ${isFirst ? "rounded-s-xl" : ""} ${isLast ? "rounded-e-xl" : ""}`}
                  >
                    <p className="font-semibold text-sm text-black leading-none opacity-70">
                      {head?.name}
                    </p>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((e, i) => {
              const isLast = i === data.length - 1;
              const classes = isLast
                ? "p-3.5"
                : "p-3.5 border-b border-blue-gray-50";

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
                        data-title={displayValue}
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
          className="rounded-xl"
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
                className="rounded-xl"
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
          className="rounded-xl"
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
