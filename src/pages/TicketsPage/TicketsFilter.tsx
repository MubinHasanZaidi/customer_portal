import React, { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import InputArea from "../../components/Inputarea";
import SelectOption from "../../components/SelectOption";
import { PriorityType, TicketType } from "../../utils/common";

interface TicketFilterState {
  filter: {
    searchQuery: string;
    ticketTypeId: string;
    priority: string;
    ticketStatusId: string;
  };
  sortOrder: string;
  pageSize: number;
  pageNumber: number;
}

interface TicketsFilterProps {
  filter: TicketFilterState;
  setFilter: React.Dispatch<React.SetStateAction<TicketFilterState>>;
  ticketStatusOptions: { value: string; label: string }[];
}

type FilterFormValues = {
  searchQuery: string;
  priority: string | null;
  ticketTypeId: string | null;
  ticketStatusId: string | null;
};

const TicketsFilter: React.FC<TicketsFilterProps> = ({
  filter,
  setFilter,
  ticketStatusOptions,
}) => {
  const methods = useForm<FilterFormValues>({
    defaultValues: {
      searchQuery: filter?.filter?.searchQuery || "",
      priority: filter?.filter?.priority || "",
      ticketTypeId: filter?.filter?.ticketTypeId || "",
      ticketStatusId: filter?.filter?.ticketStatusId || "",
    },
  });

  const { register, watch, reset } = methods;
  const searchQuery = watch("searchQuery");
  const priority = watch("priority");
  const ticketTypeId = watch("ticketTypeId");
  const ticketStatusId = watch("ticketStatusId");

  const priorityOptions = useMemo(
    () => [
      { value: "", label: "All Priorities" },
      ...PriorityType.map((item) => ({
        value: String(item.value),
        label: item.label,
      })),
    ],
    [],
  );

  const ticketTypeOptions = useMemo(
    () => [
      { value: "", label: "All Ticket Types" },
      ...TicketType?.filter((e) => e.show).map((item) => ({
        value: String(item.value),
        label: item.label,
      })),
    ],
    [],
  );

  const statusOptions = useMemo(
    () => [{ value: "", label: "All Statuses" }, ...ticketStatusOptions],
    [ticketStatusOptions],
  );

  useEffect(() => {
    reset({
      searchQuery: filter?.filter?.searchQuery || "",
      priority: filter?.filter?.priority || "",
      ticketTypeId: filter?.filter?.ticketTypeId || "",
      ticketStatusId: filter?.filter?.ticketStatusId || "",
    });
  }, [
    filter?.filter?.searchQuery,
    filter?.filter?.priority,
    filter?.filter?.ticketTypeId,
    filter?.filter?.ticketStatusId,
    reset,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextSearch = searchQuery || "";
      const nextPriority = priority || "";
      const nextTicketTypeId = ticketTypeId || "";
      const nextTicketStatusId = ticketStatusId || "";

      setFilter((prev) => {
        const isSame =
          (prev?.filter?.searchQuery || "") === nextSearch &&
          (prev?.filter?.priority || "") === nextPriority &&
          (prev?.filter?.ticketTypeId || "") === nextTicketTypeId &&
          (prev?.filter?.ticketStatusId || "") === nextTicketStatusId;

        if (isSame) {
          return prev;
        }

        return {
          ...prev,
          pageNumber: 1,
          filter: {
            ...(prev?.filter || {}),
            searchQuery: nextSearch,
            priority: nextPriority,
            ticketTypeId: nextTicketTypeId,
            ticketStatusId: nextTicketStatusId,
          },
        };
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchQuery, priority, ticketTypeId, ticketStatusId, setFilter]);

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3 md:w-3/5">
          <SelectOption
            options={priorityOptions}
            placeholder="Priority"
            registration={register("priority")}
          />
          <SelectOption
            options={ticketTypeOptions}
            placeholder="Ticket Type"
            registration={register("ticketTypeId")}
          />
          <SelectOption
            options={statusOptions}
            placeholder="Ticket Status"
            registration={register("ticketStatusId")}
          />
        </div>
        <div className="w-full md:w-72">
          <InputArea
            id="ticket-search"
            placeholder="Search"
            value={searchQuery || ""}
            onChange={(e) => methods.setValue("searchQuery", e.target.value)}
          />
        </div>
      </div>
    </FormProvider>
  );
};

export default TicketsFilter;
