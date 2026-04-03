import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/store";
import { getTicketById } from "../../store/actions/ticketActions";
import { PriorityType, TicketType } from "../../utils/common";

interface TicketDetailProps {
  ticketId?: string | number;
}

const TicketDetail: React.FC<TicketDetailProps> = ({ ticketId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (ticketId) {
      setLoading(true);
      dispatch(getTicketById({ Id: ticketId }))
        .then((response: any) => {
          if (response) {
            setData(response?.payload);
          }
        })
        .catch((error: any) => {
          console.error("Error fetching ticket:", error);
          setData({});
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setData({});
    }
  }, [ticketId, dispatch]);

  const formatEmployee = (employee: any): string => {
    if (!employee) return "N/A";
    const name = `${employee.firstName || ""} ${
      employee.middleName || ""
    } ${employee.lastName || ""}`.trim();
    return `${employee.employeeCode || ""}  ${name}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-tsecondary rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border grid grid-cols-3 border-black mt-4 rounded-2xl p-4">
        {/* Header Section */}
        <div className="col-span-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
            <div>
              <h2 className="text-md font-bold text-tprimary">Ticket Detail</h2>
            </div>
          </div>

          {/* Main Grid - 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Column - Column 1 */}
            <div className="grid text-xs grid-cols-7 gap-y-2">
              <div className="text-black col-span-2">Ticket Number</div>
              <div className="font-medium text-black col-span-5">
                {data?.ticketCode ? `${data?.ticketCode}` : "N/A"}
              </div>

              <div className="text-black col-span-2">Project Name</div>
              <div className="font-medium text-black col-span-5">
                {data?.Project?.projectName
                  ? `${data?.Project?.projectName}`
                  : "N/A"}
              </div>

              <div className="text-black col-span-2">Report To</div>
              <div className="font-medium text-black col-span-5">
                {data?.CustomerUser?.name}
              </div>

              <div className="text-black col-span-2">Assign To</div>
              <div className="font-medium text-black col-span-5">
                {formatEmployee(data?.AssignToEmp)}
              </div>

              <div className="text-black col-span-2">Start Date</div>
              <div className="font-medium text-black col-span-5">
                {data?.startDate || "N/A"}
              </div>

              <div className="text-black col-span-2">Due Date</div>
              <div className="font-medium text-black col-span-5">
                {data?.dueDate || "N/A"}
              </div>
              {/* Right Column - Column 2 */}
              <div className="text-black col-span-2">Ticket Type</div>
              <div className="font-medium text-black col-span-5">
                {TicketType.find((el: any) => el.value == data?.ticketTypeId)
                  ?.label || "N/A"}
              </div>
              <div className="text-black col-span-2">Estimated Hours</div>
              <div className="font-medium text-black col-span-5">
                {data?.noOfHours || 0} hours
              </div>
              <div className="text-black col-span-2">Priority</div>
              <div className="font-medium text-black col-span-5">
                {PriorityType.find((e: any) => e.value == data?.priority)
                  ?.label || "N/A"}
              </div>

              <div className="text-black col-span-2">Ticket Status</div>
              <div className="font-medium text-black col-span-5">
                {data?.TicketStatus?.statusName || "N/A"}
              </div>
{/* 
              {data?.ParentEpic?.ticketSummary && (
                <>
                  {" "}
                  <div className="text-black col-span-2">Parent Epic</div>
                  <div className="font-medium text-black col-span-5">
                    {data?.ParentEpic?.ticketSummary
                      ? `${data?.ParentEpic?.ticketCode} - ${data?.ParentEpic?.ticketSummary}`
                      : "N/A"}
                  </div>
                </>
              )}

              {data?.ParentTask?.ticketSummary && (
                <>
                  <div className="text-black col-span-2">Parent Task</div>
                  <div className="font-medium text-black col-span-5">
                    {data?.ParentTask?.ticketSummary
                      ? `${data?.ParentTask?.ticketCode} - ${data?.ParentTask?.ticketSummary}`
                      : "N/A"}
                  </div>{" "}
                </>
              )} */}
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
            <div>
              <h2 className="text-md font-bold text-tprimary">Description</h2>
              <p className="font-normal text-black text-sm">
                {data?.ticketDescription}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketDetail;
