import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Briefcase, ArrowRight, Calendar } from "lucide-react";

interface JobCardProps {
  id: string;
  title: string;
  location: string;
  type: string;
  postedAt: string;
  description: string;
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  location,
  type,
  postedAt,
  description,
}) => {
  return (
    <div className="border-b-[#707070] border-b py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-[#222222]">{title}</h3>
          </div>
          <p className="mt-4 text-sm text-[#222222] line-clamp-2">
            {description}
          </p>
          <div className="flex flex-wrap sm:gap-6 gap-3">
            <div className="flex items-center text-sm text-[#222222]">
              <MapPin className="w-4 h-4 mr-1" />
              {location}
            </div>
            <div className="flex items-center text-sm text-[#222222]">
              <Briefcase className="w-4 h-4 mr-1" />
              {type}
            </div>
            <div className="flex items-center text-sm text-[#222222]">
              <Calendar className="w-4 h-4 mr-1" />
              {postedAt}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:items-end gap-4">
          <Link
            to={`/job-detail/${id}`}
            className="inline-flex hover:underline items-center tex justify-start px-4 py-2 border border-transparent text-lg font-medium rounded-md text-[#222222] focus:ring-2 focus:ring-offset-2"
          >
            View Details
            <ArrowRight className="w-6 h-6 -rotate-45 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
