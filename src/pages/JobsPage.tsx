import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchActiveVacancyAction,
  fetchJobDepartments,
  fetchJobLocations,
  fetchJobs,
} from "../store/actions/jobActions";
import type { RootState, AppDispatch } from "../store";
import Header from "../components/Header";
import Footer from "../components/Footer";
import InputArea from "../components/Inputarea";
import {
  AccessibilityIcon,
  Check,
  Cross,
  Search,
  Upload,
  X,
} from "lucide-react";
import JobCard from "../components/JobCard";
import MultiSelect from "../components/MultiSelect";
import useCompanyConfig from "../hooks/useCompanyConfig";
import useDebounce from "../hooks/useDebounce";
import { format } from "date-fns";
import ActiveVacancy from "../components/ActiveVacancy";

const JobsPage = () => {
  /// comapny Config
  const { companyConfig, userConfig } = useCompanyConfig();
  const { company, themeConfig, applicantStatuses } = companyConfig;
  const { primary_color, secondary_color } = themeConfig;
  /// redux related
  const dispatch = useDispatch<AppDispatch>();
  const {
    jobs,
    isLoading,
    error,
    locations,
    departments,
    count,
    activeVacancy,
  } = useSelector((state: RootState) => state.jobs);
  // internal states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  // Debounced search term to prevent excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const jobListRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to the job list
    jobListRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    dispatch(fetchJobLocations(company?.Id));
    dispatch(fetchJobDepartments(company?.Id));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, selectedLocation, selectedDept]);

  useEffect(() => {
    if (company?.Id) {
      dispatch(
        fetchJobs({
          companyId: company.Id,
          currentPage,
          jobsPerPage,
          searchTerm: debouncedSearchTerm,
          selectedLocation,
          applicantId: userConfig?.Id,
          selectedDept,
        })
      );
      window.scrollTo(0, 0);
    }
  }, [
    dispatch,
    company?.Id,
    currentPage,
    jobsPerPage,
    debouncedSearchTerm,
    selectedLocation,
    selectedDept,
    userConfig,
  ]);

  useEffect(() => {
    if (userConfig) {
      dispatch(fetchActiveVacancyAction());
    }
  }, [userConfig]);

  const totalPages = Math.max(1, Math.ceil(count / jobsPerPage) || 1);

  return (
    <div
      style={{ background: secondary_color }}
      className={`min-h-screen flex flex-col`}
    >
      <Header />
      <main className="flex-1">
        <section className="pt-10">
          <div className="2xl:max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8 pb-5 sm:pb-10 space-y-6  md:space-y-14">
            <div className="flex flex-col-reverse gap-8 lg:flex-row justify-between">
              <div className="flex-1 space-y-6  md:space-y-14">
                <div className="text-left w-fit">
                  <p className="text-[#222222] text-xs sm:text-sm">
                    Join a team that values innovation, collaboration, and
                    continuous growth!
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#222222] mt-3">
                    Your next career move starts here.
                  </h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                  <InputArea
                    id="job-keyword"
                    placeholder="Job keyword"
                    value={searchTerm}
                    rightIcon={<Search className="w-4 h-4 text-[#222222]" />}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <MultiSelect
                    options={locations}
                    placeholder={"location"}
                    value={selectedLocation}
                    onChange={(values) => setSelectedLocation(values)}
                  />
                </div>
              </div>
              <div className="flex-1">
                <ActiveVacancy
                  primary_color={primary_color}
                  secondary_color={secondary_color}
                  company={company}
                  activeVacancy={activeVacancy}
                  userConfig={userConfig}
                  applicantStatuses={applicantStatuses}
                />
              </div>
            </div>
            <div className="flex overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 text-xs rounded-3xl whitespace-nowrap ${
                    selectedDept === ""
                      ? `bg-[#222222] text-white`
                      : "bg-transparent text-[#222222] border border-[#222222]"
                  }`}
                  onClick={() => setSelectedDept("")}
                >
                  View All
                </button>
                {departments.map((filter) => (
                  <button
                    key={filter.value}
                    className={`px-4 py-2 text-xs rounded-3xl whitespace-nowrap ${
                      selectedDept === filter.value
                        ? `bg-[#222222] text-white`
                        : "bg-transparent text-[#222222] border border-[#222222]"
                    }`}
                    onClick={() => {
                      setSelectedDept(filter.value);
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-b-[#707070] border-b"></div>
          </div>
        </section>

        <section className="py-2" ref={jobListRef}>
          <div className="2xl:max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500">{error}</p>
                <button
                  className="mt-4 px-4 py-2 bg-transparent text-sm border-[#000000] border rounded-full text-[#00000]"
                  onClick={() => {
                    dispatch(
                      fetchJobs({
                        companyId: company.Id,
                        applicantId: userConfig?.Id,
                        currentPage,
                        jobsPerPage,
                        searchTerm: debouncedSearchTerm,
                        selectedLocation,
                        selectedDept,
                      })
                    );
                  }}
                >
                  Try Again
                </button>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No jobs found matching your criteria.
                </p>
              </div>
            ) : (
              <div className=" pb-6 sm:pb-12 lg:pb-28">
                {jobs.map((job) => (
                  <JobCard
                    key={job.Id}
                    id={job.Id}
                    title={job.Designation?.formName || ""}
                    location={(job.Locations || []).join(",  ")}
                    type={job.JobPreference?.formName || ""}
                    postedAt={
                      format(new Date(job.jobPostingDateTo), "dd-MMM-yyyy") ||
                      ""
                    }
                    workExpFrom={job?.workExpFrom}
                    workExpTo={job?.workExpTo}
                    description={job?.jobSummary || ""}
                    isAppliedForJob={job?.isAppliedForJob}
                    applicant={userConfig}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {totalPages > 1 && (
          <div className="flex justify-center mb-12 space-x-2">
            <button
              type="submit"
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                type="submit"
                onClick={() => handlePageChange(idx + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === idx + 1 ? "bg-[#222222] text-white" : ""
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              type="submit"
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default JobsPage;
