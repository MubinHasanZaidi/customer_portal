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
  customer: any | null;
  projectDetail: any | null;
  primary_color: string;
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
  customer,
  projectDetail,
  primary_color,
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
      <div className="grid grid-cols-3 gap-4 my-1 lg:my-3">
        <div
          style={{ backgroundColor: primary_color, borderRadius: "9px" }}
          className="p-2 md:p-4 space-y-1 md:space-y-3"
        >
          <h3 className="text-white text-sm md:text-md">
            Tickets Generated :{" "}
            {projectDetail?.tickets?.filter(
              (e: any) => e.ticketTypeId == 3 && !e?.isQuestion,
            )?.length || 0}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 text-xs md:text-sm text-white font-light">
            <p>
              Completed :{" "}
              {projectDetail?.tickets?.filter(
                (e: any) =>
                  e.ticketTypeId == 3 &&
                  !e?.isQuestion &&
                  e?.TicketStatus?.statusTypeId == 616,
              )?.length || 0}
            </p>
            <p>
              In Progress :{" "}
              {projectDetail?.tickets?.filter(
                (e: any) =>
                  e.ticketTypeId == 3 &&
                  !e?.isQuestion &&
                  e?.TicketStatus?.statusTypeId != 616,
              )?.length || 0}
            </p>
          </div>
        </div>
        <div
          style={{ backgroundColor: primary_color, borderRadius: "9px" }}
          className="p-2 md:p-4 space-y-1 md:space-y-3"
        >
          <h3 className="text-white text-sm md:text-md">
            Bugs Reported :{" "}
            {projectDetail?.tickets?.filter(
              (e: any) => e.ticketTypeId == 4 && !e?.isQuestion,
            )?.length || 0}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 text-xs md:text-sm text-white font-light">
            <p>
              Completed :{" "}
              {projectDetail?.tickets?.filter(
                (e: any) =>
                  e.ticketTypeId == 4 &&
                  !e?.isQuestion &&
                  e?.TicketStatus?.statusTypeId == 616,
              )?.length || 0}
            </p>
            <p>
              In Progress :{" "}
              {projectDetail?.tickets?.filter(
                (e: any) =>
                  e.ticketTypeId == 4 &&
                  !e?.isQuestion &&
                  e?.TicketStatus?.statusTypeId != 616,
              )?.length || 0}
            </p>
          </div>
        </div>
        <div
          style={{ backgroundColor: primary_color, borderRadius: "9px" }}
          className="p-2 md:p-4 space-y-1 md:space-y-3"
        >
          {" "}
          <h3 className="text-white text-sm md:text-md">
            Question Raised :{" "}
            {projectDetail?.tickets?.filter(
              (e: any) => e.ticketTypeId == 3 && e?.isQuestion,
            )?.length || 0}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 text-xs md:text-sm text-white font-light">
            <p>
              Completed :{" "}
              {projectDetail?.tickets?.filter(
                (e: any) =>
                  e.ticketTypeId == 3 &&
                  e?.isQuestion &&
                  e?.TicketStatus?.statusTypeId == 616,
              )?.length || 0}
            </p>
            <p>
              In Progress :{" "}
              {projectDetail?.tickets?.filter(
                (e: any) =>
                  e.ticketTypeId == 3 &&
                  e?.isQuestion &&
                  e?.TicketStatus?.statusTypeId != 616,
              )?.length || 0}
            </p>
          </div>
        </div>
      </div>
      <div
        style={{ backgroundColor: customer?.secondary_color }}
        className="flex px-4 pb-2 md:pb-0 pt-2 rounded-xl flex-col gap-2 md:flex-row md:items-center md:justify-between"
      >
        <h3 className="text-black hidden md:block text-md font-semibold flex mx-auto">
          Filters
        </h3>
        <div className="grid gap-1 md:gap-2 grid-cols-2 md:grid-cols-7">
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
          <div className="">
            <InputArea
              id="ticket-search"
              placeholder="Search"
              value={searchQuery || ""}
              onChange={(e) => methods.setValue("searchQuery", e.target.value)}
            />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default TicketsFilter;
