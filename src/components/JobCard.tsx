import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  ArrowRight,
  Calendar,
  ThumbsUp,
} from "lucide-react";

interface JobCardProps {
  id: string;
  title: string;
  location: string;
  type: string;
  postedAt: string;
  description: string;
  workExpFrom?: string;
  workExpTo?: string;
  isAppliedForJob?: boolean;
  applicant?: any;
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  location,
  type,
  postedAt,
  description,
  workExpFrom,
  workExpTo,
  isAppliedForJob,
  applicant,
}) => {
  return (
    <div className="border-b-[#707070] border-b py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2 w-full">
          <div>
            <h3 className="text-lg font-semibold text-[#222222]">{title}</h3>
          </div>
          <p className="mt-4 text-sm text-[#222222] line-clamp-2">
            {description}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
            <div
              title="Location"
              className="col-span-1 flex items-center text-sm text-[#222222]"
            >
              <MapPin className="w-4 h-4 mr-1" />
              {location}
            </div>
            <div
              title="Job type"
              className="col-span-1 flex items-center text-sm text-[#222222]"
            >
              <Briefcase className="w-4 h-4 mr-1" />
              {type}
            </div>
            <div
              title="Experience"
              className="col-span-1 flex items-center text-sm text-[#222222]"
            >
              <Briefcase className="w-4 h-4 mr-1" />
              {workExpFrom} to {workExpTo} Year
            </div>
            <div
              title="Last date of application"
              className="col-span-1 flex items-center text-sm text-[#222222]"
            >
              <Calendar className="w-4 h-4 mr-1" />
              {postedAt}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:items-end gap-2">
          {isAppliedForJob && applicant?.Id ? (
            <span className="inline-flex items-center min-w-max sm:px-4 sm:p-2 border border-transparent text-lg font-medium rounded-md text-[#34B9A3] focus:ring-2 focus:ring-offset-2">
              Applied
              <ThumbsUp className="w-6 h-6 ml-2" />
            </span>
          ) : (
            <Link
              to={`/job-detail/${id}`}
              className="inline-flex items-center min-w-max hover:underline sm:px-4 sm:p-2 border border-transparent text-lg font-medium rounded-md text-[#222222] focus:ring-2 focus:ring-offset-2"
            >
              View Details
              <ArrowRight className="w-6 h-6 -rotate-45 ml-2" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
