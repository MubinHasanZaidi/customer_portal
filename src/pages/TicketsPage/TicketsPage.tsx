import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useCustomerConfig from "../../hooks/useCustomerConfig";
import { CustomTable } from "../../components/CustomTable";
import { useEffect, useMemo, useState } from "react";
import {
  deleteTicketById,
  fetchCustomerProjectDetail,
  fetchTicketStatus,
  getTicketById,
  getTickets,
  ticketFormSubmit,
} from "../../store/actions/ticketActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/src/store";
import {
  Bug,
  CircleHelp,
  CirclePlus,
  MessageSquareText,
  PencilIcon,
  Ticket,
  Trash2,
} from "lucide-react";
import TicketCreateDialog, { TicketCreatePayload } from "./TicketFormDialog";
import TicketDeleteDialog from "./TicketDeleteDialog";
import { PriorityType, TicketType } from "../../utils/common";
import { clearEditRecord } from "../../store/slices/ticketSlice";
import TicketsFilter from "./TicketsFilter";

type TicketActionType = "Ask Question" | "Report Bug" | "Task";

const TicketsPage = () => {
  const { customerConfig } = useCustomerConfig();
  const { customer } = customerConfig;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { projectDetail, count, entities, editRecord, ticketStatus } =
    useSelector((state: RootState) => state.ticket);
  const [selectedTicketType, setSelectedTicketType] =
    useState<TicketActionType | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<any | null>(null);

  const [filter, setFilter] = useState({
    filter: {
      searchQuery: "",
      ticketTypeId: "",
      priority: "",
      ticketStatusId: "",
    },
    sortOrder: "asc",
    pageSize: 5,
    pageNumber: 1,
  });

  const ticketTypeMap: Record<TicketActionType, number> = {
    "Ask Question": 3,
    Task: 3,
    "Report Bug": 4,
  };

  useEffect(() => {
    dispatch(fetchCustomerProjectDetail());
    dispatch(fetchTicketStatus());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTickets(filter));
  }, [
    dispatch,
    filter.pageNumber,
    filter.pageSize,
    filter.sortOrder,
    filter.filter.searchQuery,
    filter.filter.priority,
    filter.filter.ticketTypeId,
    filter.filter.ticketStatusId,
  ]);

  const openCreateTicketModal = (type: TicketActionType) => {
    dispatch(clearEditRecord());
    setSelectedTicketType(type);
  };

  const closeCreateTicketModal = () => {
    dispatch(clearEditRecord());
    setSelectedTicketType(null);
  };

  const getTicketTypeLabel = (ticket: any): TicketActionType => {
    const typeId = ticket?.ticketTypeId ?? ticket?.TicketType?.Id;
    if (typeId === 4) return "Report Bug";
    if (typeId === 3 && /task/i.test(ticket?.ticketTypeName || "")) {
      return "Task";
    }
    if (/task/i.test(ticket?.ticketTypeName || "")) return "Task";
    return "Ask Question";
  };

  const isAbove24Hours = (createdAt?: string) => {
    if (!createdAt) return false;
    const createdAtTime = new Date(createdAt).getTime();
    if (Number.isNaN(createdAtTime)) return false;
    return Date.now() - createdAtTime > 24 * 60 * 60 * 1000;
  };

  const handleEditClick = (ticket: any) => {
    dispatch(getTicketById({ Id: ticket?.Id }));
    setSelectedTicketType(getTicketTypeLabel(ticket));
  };

  const handleDeleteClick = (ticket: any) => {
    setDeleteRecord(ticket);
  };

  const closeDeleteModal = () => {
    setDeleteRecord(null);
  };

  const confirmDeleteTicket = () => {
    if (!deleteRecord?.Id) return;
    dispatch(deleteTicketById({ Id: deleteRecord.Id }));
    closeDeleteModal();
  };

  const handleTicketActivityClick = (e: any) => {
    navigate(`/ticket/activity/${e?.Id}`);
  };

  const handleSaveTicket = (payload: TicketCreatePayload) => {
    const requestBody = {
      ...payload,
      projectName: projectDetail?.projectName,
      epicTicket: projectDetail?.epicTicket,
      reportEmp: projectDetail?.reportEmp,
    };
    dispatch(
      ticketFormSubmit({
        data: requestBody,
        closeModel: closeCreateTicketModal,
      }),
    );
  };
  const column = [
    {
      key: "ticketCode",
      name: "Ticket Number",
      type: "string",
      formatter: (e: any, row: any) => {
        const color = PriorityType.find(
          (el) => el?.value == row?.priority,
        )?.color;
        return (
          <div className="flex gap-2">
            <span className="flex items-center gap-1">
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: color,
                  display: "inline-block",
                }}
              ></span>
            </span>
            <span>{e}</span>
          </div>
        );
      },
    },
    {
      key: "ticketDescription",
      name: "Ticket Description",
      type: "string",
      formatter: (e: any) => (e?.length > 50 ? `${e?.slice(0, 50)}...` : e),
    },
    {
      key: "ticketTypeId",
      name: "Ticket Type",
      type: "string",
      formatter: (e: any, cell: any) => {
        return cell?.isQuestion
          ? "Question"
          : TicketType?.find((el) => el.value == e)?.label;
      },
    },
    {
      key: "TicketStatus.statusName",
      name: "Ticket Status",
      type: "string",
    },
    {
      key: "AssignToEmp.name",
      name: "Assign Employee",
      type: "string",
      formatter: (e: any) => (e ? e : ""),
    },
    {
      key: "CustomerUser.name",
      name: "Report To",
      type: "string",
    },
    {
      key: "createdAt",
      name: "Creation Date",
      type: "string",
      formatter: (cell: any) => new Date(cell).toDateString(),
    },
    {
      name: "Action",
      type: "action",
      formatter: (cell: any, row: any) => {
        return (
          <div className="flex  gap-1 items-end justify-end">
            <button onClick={() => handleEditClick(cell || row)}>
              <PencilIcon className="w-3 h-3 text-black" />
            </button>
            <button onClick={() => handleTicketActivityClick(cell || row)}>
              <MessageSquareText className="w-3 h-3 text-black" />
            </button>
            {!isAbove24Hours((cell || row)?.createdAt) && (
              <button onClick={() => handleDeleteClick(cell || row)}>
                <Trash2 className="w-3 h-3 text-black" />
              </button>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <div
      style={{ background: customer?.secondary_color }}
      className={`min-h-screen flex flex-col`}
    >
      <Header />
      <main className="flex-1 mt-2">
        <div className="mx-auto min-h-[90dvh]  bg-white grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-5">
          <div
            style={{ backgroundColor: customer?.secondary_color }}
            className="col-span-1 mt-0 lg:mt-2 py-2 max-lg:border-t max-lg:border-t-black lg:py-6 px-4 rounded-none flex flex-row lg:flex-col item-center gap-1 md:gap-3"
          >
            <button
              type="button"
              className=" rounded-full p-2 md:p-3 text-black bg-white text-xs md:text-sm font-semibold flex items-center justify-center gap-1 md:gap-2 hover:shadow-md"
              onClick={() => openCreateTicketModal("Task")}
            >
              <CirclePlus className="w-4 h-4" />
              Create Task
            </button>

            <button
              type="button"
              className=" rounded-full p-2 md:p-3 text-black bg-white text-xs md:text-sm font-semibold flex items-center justify-center gap-1 md:gap-2 hover:shadow-md"
              onClick={() => openCreateTicketModal("Report Bug")}
            >
              <Bug className="w-4 h-4" />
              Report Bug
            </button>
            <button
              type="button"
              className=" rounded-full p-2 md:p-3 text-black bg-white text-xs md:text-sm font-semibold flex items-center justify-center gap-1 md:gap-2 hover:shadow-md"
              onClick={() => openCreateTicketModal("Ask Question")}
            >
              <CircleHelp className="w-4 h-4" />
              Ask Question
            </button>
            <p className="hidden lg:block text-center mt-auto text-xs font-semibold text-[#222222]">
              Powered by Dynasoft Cloud
            </p>
          </div>
          <div className="col-span-4 px-3">
            <CustomTable
              column={column}
              data={entities || []}
              count={count}
              heading={"Tickets"}
              filterComponent={
                <TicketsFilter
                  filter={filter}
                  setFilter={setFilter}
                  ticketStatusOptions={ticketStatus}
                  customer={customer}
                  projectDetail={projectDetail}
                  primary_color={customer?.primary_color}
                />
              }
              filter={filter}
              setFilter={setFilter}
            />
          </div>
        </div>

        <TicketCreateDialog
          open={Boolean(selectedTicketType)}
          selectedTicketType={selectedTicketType}
          ticketTypeId={
            selectedTicketType ? ticketTypeMap[selectedTicketType] : 3
          }
          onClose={closeCreateTicketModal}
          onSave={handleSaveTicket}
          primaryColor={customer?.primary_color}
          secondaryColor={customer?.secondary_color}
          projectDetail={projectDetail}
          editRecord={editRecord}
        />
        <TicketDeleteDialog
          open={Boolean(deleteRecord)}
          onClose={closeDeleteModal}
          onDelete={confirmDeleteTicket}
          ticketCode={deleteRecord?.ticketCode}
          secondaryColor={customer?.secondary_color}
        />
      </main>
      <Footer />
    </div>
  );
};

export default TicketsPage;
