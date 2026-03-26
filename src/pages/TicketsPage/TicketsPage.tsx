import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useCustomerConfig from "../../hooks/useCustomerConfig";
import { CustomTable } from "../../components/CustomTable";
import { useEffect, useState } from "react";
import {
  deleteTicketById,
  fetchCustomerProjectDetail,
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
  MessageSquareText,
  PencilIcon,
  Ticket,
  Trash2,
} from "lucide-react";
import TicketCreateDialog, { TicketCreatePayload } from "./TicketFormDialog";
import TicketDeleteDialog from "./TicketDeleteDialog";
import { PriorityType, TicketType } from "../../utils/common";
import { clearEditRecord } from "../../store/slices/ticketSlice";

type TicketActionType = "Ask A Question" | "Report A Bug" | "Task";

const TicketsPage = () => {
  const { customerConfig } = useCustomerConfig();
  const { customer } = customerConfig;
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { projectDetail, count, entities, editRecord } = useSelector(
    (state: RootState) => state.ticket,
  );
  const [selectedTicketType, setSelectedTicketType] =
    useState<TicketActionType | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<any | null>(null);

  const [filter, setFilter] = useState({
    filter: {
      searchQuery: "",
    },
    sortOrder: "asc",
    pageSize: 5,
    pageNumber: 1,
  });

  const ticketTypeMap: Record<TicketActionType, number> = {
    "Ask A Question": 3,
    Task: 3,
    "Report A Bug": 4,
  };

  useEffect(() => {
    dispatch(fetchCustomerProjectDetail());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTickets(filter));
  }, [
    dispatch,
    filter.pageNumber,
    filter.pageSize,
    filter.sortOrder,
    filter.filter.searchQuery,
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
    if (typeId === 4) return "Report A Bug";
    if (typeId === 3 && /task/i.test(ticket?.ticketTypeName || "")) {
      return "Task";
    }
    if (/task/i.test(ticket?.ticketTypeName || "")) return "Task";
    return "Ask A Question";
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
    },
    {
      key: "ticketDescription",
      name: "Ticket Description",
      type: "string",
      formatter: (e: any) => (e?.length > 50 ? `${e?.slice(0, 50)}...` : e),
    },
    {
      key: "priority",
      name: "Priority",
      type: "string",
      formatter: (e: any) => {
        return PriorityType?.find((el) => el.value == e)?.label;
      },
    },
    {
      key: "ticketTypeId",
      name: "Ticket Type",
      type: "string",
      formatter: (e: any) => {
        return TicketType?.find((el) => el.value == e)?.label;
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
      <main className="flex-1">
        <div className="2xl:max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8 min-h-[90dvh]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
            <button
              type="button"
              className="w-full min-h-20 rounded-2xl px-6 py-5 text-white text-lg font-semibold flex items-center justify-center gap-3"
              style={{ background: customer?.primary_color }}
              onClick={() => openCreateTicketModal("Ask A Question")}
            >
              <CircleHelp className="w-6 h-6" />
              Ask A Question
            </button>
            <button
              type="button"
              className="w-full min-h-20 rounded-2xl px-6 py-5 text-white text-lg font-semibold flex items-center justify-center gap-3"
              style={{ background: customer?.primary_color }}
              onClick={() => openCreateTicketModal("Report A Bug")}
            >
              <Bug className="w-6 h-6" />
              Report A Bug
            </button>
            <button
              type="button"
              className="w-full min-h-20 rounded-2xl px-6 py-5 text-white text-lg font-semibold flex items-center justify-center gap-3"
              style={{ background: customer?.primary_color }}
              onClick={() => openCreateTicketModal("Task")}
            >
              <Ticket className="w-6 h-6" />
              Create New Task
            </button>
          </div>

          <CustomTable
            column={column}
            data={entities || []}
            count={count}
            heading={"Tickets"}
            filter={filter}
            setFilter={setFilter}
          />
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
        />
      </main>
      <Footer />
    </div>
  );
};

export default TicketsPage;
