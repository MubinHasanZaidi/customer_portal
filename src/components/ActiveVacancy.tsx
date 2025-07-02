import { Check, Upload, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import {
  downloadOfferLetter,
  handleJobOffer,
  uploadFiles,
} from "../store/actions/jobActions";
import { useState, useRef } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../components/ui/alert-dialog";
import { toast } from "react-toastify";

interface IActiveVacancy {
  primary_color?: string;
  secondary_color?: string;
  company?: any;
  activeVacancy?: any;
  userConfig?: any;
  applicantStatuses?: any;
}

// Status codes for clarity

function getStatusMessage(
  status: number,
  primary_color?: string,
  STATUS?: any
) {
  if (STATUS.CV_SUBMITTED.includes(status)) {
    return (
      <p style={{ color: primary_color }} className="text-xs">
        CV Submitted
      </p>
    );
  }
  if (STATUS.CV_VIEWED.includes(status)) {
    return (
      <p style={{ color: primary_color }} className="text-xs">
        CV Viewed
      </p>
    );
  }
  if (STATUS.ANOTHER_CANDIDATE.includes(status)) {
    return (
      <p style={{ color: primary_color }} className="text-xs">
        We've selected another candidate and appreciate your time.
        <br /> Best of luck for the future openings.
      </p>
    );
  }
  if (status === STATUS.HIRED) {
    return (
      <p style={{ color: primary_color }} className="text-xs">
        Hired
      </p>
    );
  }
  if (status === STATUS.OFFER_REJECTED) {
    return <p className="text-xs text-red-600">Offer Letter Rejected</p>;
  }
  if (status === STATUS.OFFER_ACCEPTED) {
    return (
      <p style={{ color: primary_color }} className="text-xs">
        Offer Letter Accepted
      </p>
    );
  }
  if (STATUS.CV_REJECTED.includes(status)) {
    return <p className="text-xs text-red-600">CV Rejected</p>;
  }
  return null;
}

const ActiveVacancy = ({
  primary_color,
  secondary_color,
  company,
  activeVacancy,
  userConfig,
  applicantStatuses,
}: IActiveVacancy) => {
  const dispatch = useDispatch<AppDispatch>();
  const [offerFile, setOfferFile] = useState<File | null>(null);
  const [dialogType, setDialogType] = useState<null | "accept" | "reject">(
    null
  );
  const STATUS = {
    CV_SUBMITTED: [applicantStatuses?.appliedForJobId],
    CV_VIEWED: [
      applicantStatuses?.inReviewScreeningId,
      applicantStatuses?.interviewScheduledId,
      applicantStatuses?.shortlistedForInterviewId,
      applicantStatuses?.shortlistedForTestId,
      applicantStatuses?.recommendedForNextInterviewId,
      applicantStatuses?.finalizedForHiringId,
    ],
    CV_REJECTED: [
      applicantStatuses?.rejectedInApplicationPhaseId,
      applicantStatuses?.noShowForInterviewId,
    ],
    ANOTHER_CANDIDATE: [
      applicantStatuses?.rejectedInEvaluationPhaseId,
      applicantStatuses?.rejectedInFinalDecisionPhaseId,
    ],
    HIRED: applicantStatuses?.hiredId,
    OFFER_REJECTED: applicantStatuses?.offerLetterRejectedId,
    OFFER_ACCEPTED: applicantStatuses?.offerLetterAcceptedId,
    OFFER_ISSUED: applicantStatuses?.offerLetterIssuedId,
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  if (
    !userConfig ||
    !activeVacancy?.activeVacancy ||
    !activeVacancy?.activeJobName ||
    activeVacancy?.applicantStatus == null
  ) {
    return null;
  }

  const { applicantStatus } = activeVacancy;

  const downloadOfferLetterClick = async () => {
    dispatch(downloadOfferLetter());
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setOfferFile(file);
  };

  const handleAcceptClick = () => {
    if (!offerFile || offerFile.type !== "application/pdf") {
      toast.warning("Accept offer letter file is required only pdf format");
      return;
    }
    setDialogType("accept");
  };

  const handleRejectClick = () => setDialogType("reject");

  const handleDialogClose = () => setDialogType(null);

  const handleDialogConfirm = async () => {
    try {
      if (dialogType === "accept") {
        if (!offerFile) {
          toast.warning("No file selected");
          return;
        }
        const filename = await uploadFiles(offerFile);
        dispatch(
          handleJobOffer({ acceptFile: filename?.data?.filename, accept: true })
        );
        setOfferFile(null);
      } else if (dialogType === "reject") {
        dispatch(handleJobOffer({ acceptFile: null, accept: false }));
      }
    } catch (error) {
      // Error toasts are handled in actions
    } finally {
      setDialogType(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex justify-end">
      <div className="min-h-10 rounded-2xl w-full bg-white">
        <h4 className="bg-[#222222] rounded-t-2xl text-white px-4 py-2 text-sm">
          <b>Active Jobs Vacancy</b> : {activeVacancy?.activeJobName}
        </h4>
        {applicantStatus !== STATUS.OFFER_ISSUED && (
          <div className="flex gap-5 px-4 py-2">
            <p className="text-xs min-w-32">Application Status : </p>
            {getStatusMessage(applicantStatus, primary_color, STATUS)}
          </div>
        )}
        {applicantStatus === STATUS.HIRED && (
          <div>
            <p className="text-xs px-4 pb-2">
              Congratulations! Looking forward to welcoming you at{" "}
              {company.name}
            </p>
          </div>
        )}
        {applicantStatus === STATUS.OFFER_ISSUED && (
          <div className="flex gap-5 px-4 py-2">
            <div className="flex flex-1 gap-5">
              <p className="text-xs min-w-32">Application Status</p>
              <div className="text-xs">
                <p style={{ color: primary_color }}>Offer letter issued</p>
                <p>
                  Accept the offer to download the offer letter. Once downloaded
                  please sign and upload to finalize the process.
                </p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <div className="space-x-2">
                <button
                  className="text-xs text-green-600 border border-green-400 bg-green-200 px-2 py-1 rounded-full text-center"
                  onClick={handleAcceptClick}
                >
                  <Check className="inline-block w-3 h-4" /> Accept
                </button>
                <button
                  className="text-xs text-red-600 border border-red-400 bg-red-200 px-2 py-1 rounded-full text-center"
                  onClick={handleRejectClick}
                >
                  <X className="inline-block w-4 h-3" /> Reject
                </button>
              </div>
              <div>
                <button
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ color: primary_color, background: secondary_color }}
                  onClick={downloadOfferLetterClick}
                >
                  Download Offer Letter
                  <Upload className="-rotate-180 inline-block w-4 h-4 ml-2" />
                </button>
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  id="offer-upload-input"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <button
                  className="text-xs px-2 py-1 rounded-full"
                  style={{ color: primary_color, background: secondary_color }}
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  Upload Offer Letter
                  <Upload className="inline-block w-4 h-4 ml-2" />
                </button>
              </div>
              {offerFile && (
                <span className="text-xs ml-2">{offerFile.name}</span>
              )}
            </div>
            {/* Confirmation Dialog */}
            <AlertDialog open={!!dialogType} onOpenChange={handleDialogClose}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {dialogType === "accept"
                      ? "Confirm Accept Offer"
                      : "Confirm Reject Offer"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {dialogType === "accept"
                      ? "Are you sure you want to accept this offer?"
                      : "Are you sure you want to reject this offer?"}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={handleDialogClose}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDialogConfirm}>
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveVacancy;
