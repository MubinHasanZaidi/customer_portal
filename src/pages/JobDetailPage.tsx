import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import {
  fetchJobDetailStart,
  fetchJobDetailSuccess,
  fetchJobDetailFailure,
} from "../store/slices/jobsSlice";
import type { RootState } from "../store";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { mockJobs } from "../data/mockData";
import { ArrowRight, Briefcase, Calendar, MapPin } from "lucide-react";

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { selectedJob, isLoading, error } = useSelector(
    (state: RootState) => state.jobs
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchJobDetailStart());

      // Simulate API call with mock data
      setTimeout(() => {
        try {
          const job = mockJobs.find((job) => job.id === id);
          if (job) {
            dispatch(fetchJobDetailSuccess(job));
          } else {
            dispatch(fetchJobDetailFailure("Job not found"));
          }
        } catch (err) {
          dispatch(fetchJobDetailFailure("Failed to fetch job details"));
        }
      }, 1000);
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !selectedJob) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-red-500 mb-4">{error || "Job not found"}</p>
          <Link
            to="/jobs"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Back to Jobs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#E6F8FF]">
      <Header />

      <main className="flex-1 py-8">
        <div className="2xl:max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="m-2 md:m-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <div className="inline-block text-sm mb-2">
                  Position available
                </div>
                <h1 className="text-xl sm:text-3xl font-bold text-[#222222]">
                  {selectedJob.title}
                </h1>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center text-sm text-[#222222] gap-2">
                    <Calendar className="w-4 h-4" />
                    Apply by: {selectedJob.applyBy}
                  </div>

                  <div className="flex items-center text-sm text-[#222222] gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedJob.location}
                  </div>

                  <div className="flex items-center text-sm text-[#222222] gap-2">
                    <Briefcase className="w-4 h-4" />
                    {selectedJob.type}
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col gap-2">
                <Link
                  to="/applicant-form"
                  className="inline-flex hover:underline items-center justify-start md:justify-end border border-transparent text-lg font-medium rounded-md text-[#222222] focus:ring-2 focus:ring-offset-2"
                >
                  Apply Now
                  <ArrowRight className="w-6 h-6 -rotate-45 ml-2" />
                </Link>
                <Link
                  to="/jobs"
                  className={`py-2 w-fit px-4 text-sm hover:bg-transparent hover:text-[#222222] hover:border hover:border-[#222222] rounded-full font-medium bg-[#222222] text-white`}
                >
                  View all Jobs
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <h3 className="text-xs font-bold text-[#222222] w-32">
                      Department:
                    </h3>
                    <p className="text-xs text-[#222222]">
                      {selectedJob.department}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <h3 className="text-xs font-bold text-[#222222] w-32">
                      Job type:
                    </h3>
                    <p className="text-xs text-[#222222]">
                      {selectedJob.jobType}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <h3 className="text-xs font-bold text-[#222222] w-32">
                      Career level:
                    </h3>
                    <p className="text-xs text-[#222222]">
                      {selectedJob.level}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <h3 className="text-xs font-bold text-[#222222] w-32">
                      Experience:
                    </h3>
                    <p className="text-xs text-[#222222]">
                      {selectedJob.experience}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <h3 className="text-xs font-bold text-[#222222] w-32">
                      Salary range:
                    </h3>
                    <p className="text-xs text-[#222222]">
                      {selectedJob.salary}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <h3 className="text-xs font-bold text-[#222222] w-32">
                      Last date to apply:
                    </h3>
                    <p className="text-xs text-[#222222]">
                      {selectedJob.applyBy}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <h3 className="text-xs font-bold text-[#222222] w-32">
                      Total positions:
                    </h3>
                    <p className="text-xs text-[#222222]">
                      {selectedJob.positions}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t m-2 md:m-6 border-[#707070]">
            <div className="py-3 text-[#222222]">
              <h2 className="text-lg font-medium ">Description</h2>
              <div className="mt-4 max-w-none  text-sm">
                <p>
                  Dynasoft Cloud is seeking a {selectedJob.title} with a passion
                  for developing high-quality software solutions for HRMS,
                  Payroll, and ERP systems to join our team.
                </p>
                <p className="mt-4">
                  The ideal candidate should have strong expertise in MERN stack
                  technologies (Express.js, React.js, and Node.js) along with a
                  solid understanding of databases, Object-Oriented Programming
                  (OOP), and data structures. Experience with HRMS, Payroll, or
                  ERP systems is a plus.
                </p>
              </div>
            </div>
          </div>

          <div className="py-3 text-[#222222] m-2 md:m-6">
            <h2 className="text-lg font-medium ">Heading One</h2>
            <ul className="mt-4 space-y-2 list-disc list-inside text-sm">
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
              <li>
                Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua
              </li>
              <li>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
              </li>
              <li>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
              </li>
              <li>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
              </li>
            </ul>
          </div>

          <div className="py-3 text-[#222222] m-2 md:m-6">
            <h2 className="text-lg font-medium">Heading Two</h2>
            <ul className="mt-4 space-y-2 list-disc list-inside text-sm">
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
              <li>
                Sed do eiusmod tempor incididunt ut labore et dolore magna
                aliqua
              </li>
              <li>
                Ut enim ad minim veniam, quis nostrud exercitation ullamco
              </li>
              <li>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
              </li>
              <li>
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
              </li>
            </ul>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetailPage;
