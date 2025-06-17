import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchJobsStart,
  fetchJobsSuccess,
  fetchJobsFailure,
} from "../store/slices/jobsSlice";
import type { RootState } from "../store";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { mockJobs } from "../data/mockData";
import InputArea from "../components/Inputarea";
import { Search } from "lucide-react";
import JobCard from "../components/JobCard";
import MultiSelect from "../components/MultiSelect";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  postedAt: string;
}

const JobsPage = () => {
  const dispatch = useDispatch();
  const { jobs, isLoading, error } = useSelector(
    (state: RootState) => state.jobs
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchJobsStart());

    // Simulate API call with mock data
    setTimeout(() => {
      try {
        dispatch(fetchJobsSuccess(mockJobs));
      } catch (err) {
        dispatch(fetchJobsFailure("Failed to fetch jobs"));
      }
    }, 1000);
  }, [dispatch]);

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };

  const filteredJobs = jobs.filter((job) => {
    // Filter by search term
    const matchesSearchTerm =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by location
    const matchesLocation =
      searchLocation.length === 0 ||
      searchLocation.some((location) =>
        job.location.toLowerCase().includes(location.toLowerCase())
      );

    // Filter by job type
    const matchesFilter =
      activeFilter === "all" ||
      job.title.toLowerCase().includes(activeFilter.toLowerCase());

    return matchesSearchTerm && matchesLocation && matchesFilter;
  });

  const filterOptions = [
    { id: "all", label: "View All" },
    { id: "functional consultant", label: "Functional Consultant" },
    { id: "technical manager", label: "Technical Manager" },
    { id: "software engineer", label: "Software Engineer" },
    { id: "admin officer", label: "Admin Officer" },
    { id: "accountant", label: "Accountant" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#E6F8FF]">
      <Header />
      <main className="flex-1">
        <section className="pt-10">
          <div className="2xl:max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8 pb-5 sm:pb-10 space-y-6  md:space-y-14">
            <div className="text-left">
              <p className="text-[#000000] text-xs sm:text-sm">
                Join a team that values innovation, collaboration, and
                continuous growth!
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#000000] mt-3">
                Your next career move starts here.
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
              <InputArea
                id="job-keyword"
                placeholder="Job keyword"
                value={searchTerm}
                rightIcon={<Search className="w-4 h-4 text-[#000000]" />}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MultiSelect
                options={[
                  { value: "karachi", label: "Karachi" },
                  { value: "lahore", label: "Lahore" },
                  { value: "dubai", label: "Dubai" },
                  { value: "abu dhabi", label: "Abu Dhabi" },
                  { value: "sharjah", label: "Sharjah" },
                  { value: "ajman", label: "Ajman" },
                  { value: "fujairah", label: "Fujairah" },
                  { value: "ras al khaimah", label: "Ras Al Khaimah" },
                  { value: "umm al quwain", label: "Umm Al Quwain" },
                ]}
                value={searchLocation}
                onChange={(values) => setSearchLocation(values)}
              />
            </div>
            <div className="flex overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((filter) => (
                  <button
                    key={filter.id}
                    className={`px-4 py-2 text-xs rounded-3xl whitespace-nowrap ${
                      activeFilter === filter.id
                        ? "bg-[#222222] text-[#E6F8FF]"
                        : "bg-transparent text-[#222222] border border-[#222222]"
                    }`}
                    onClick={() => handleFilterClick(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-b-[#707070] border-b"></div>
          </div>
        </section>

        <section className="py-2">
          <div className="2xl:max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                  onClick={() => {
                    dispatch(fetchJobsStart());
                    setTimeout(() => {
                      dispatch(fetchJobsSuccess(mockJobs));
                    }, 1000);
                  }}
                >
                  Try Again
                </button>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No jobs found matching your criteria.
                </p>
              </div>
            ) : (
              <div className="space-y-6 pb-6 sm:pb-12 lg:pb-28">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    id={job.id}
                    title={job.title}
                    location={job.location}
                    type={job.type}
                    postedAt={job.postedAt}
                    description={job.description}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JobsPage;
