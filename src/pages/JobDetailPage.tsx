import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchJobDetail } from "../store/actions/jobActions";
import type { RootState, AppDispatch } from "../store";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowRight, Briefcase, Calendar, MapPin } from "lucide-react";
import useCompanyConfig from "../hooks/useCompanyConfig";
import { format } from "date-fns";

const JobDetailPage = () => {
  const { companyConfig } = useCompanyConfig();
  const { company, themeConfig, jobDetailConfig } = companyConfig;
  const { primary_color, secondary_color } = themeConfig;
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedJob, isLoading, error } = useSelector(
    (state: RootState) => state.jobs
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchJobDetail(id));
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
            className="mt-4 px-4 py-2 bg-transparent text-sm border-[#000000] border rounded-full text-[#00000]"
          >
            Back to Jobs
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      style={{ background: secondary_color }}
      className={`min-h-screen flex flex-col `}
    >
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
                  {selectedJob?.Designation?.formName}
                </h1>
                <div className="flex flex-wrap gap-3 sm:gap-8 mt-4">
                  <div
                    title="Location"
                    className="flex items-center text-sm text-[#222222] gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    {selectedJob.Locations.map((e: any) => e?.formName).join(
                      ", "
                    )}
                  </div>
                  <div
                    title="Job type"
                    className="flex items-center text-sm text-[#222222] gap-2"
                  >
                    <Briefcase className="w-4 h-4" />
                    {selectedJob.JobPreference?.formName}
                  </div>
                  <div
                    title="Experience"
                    className="flex items-center text-sm text-[#222222]"
                  >
                    <Briefcase className="w-4 h-4 mr-1" />
                    {selectedJob?.workExpFrom} to {selectedJob?.workExpTo} Year
                  </div>
                  <div
                    title="Last date of application"
                    className="flex items-center text-sm text-[#222222] gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Apply by:{" "}
                    {format(
                      new Date(selectedJob.jobPostingDateTo),
                      "dd-MMM-yyyy"
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col gap-2">
                <Link
                  onClick={(e) =>
                    localStorage.setItem("jobId", selectedJob?.Id)
                  }
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
                <div className="flex flex-col gap-3">
                  {/* Job Code: */}
                  {jobDetailConfig?.job_code && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Job Code:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob?.jobCode ? selectedJob?.jobCode : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Job Date: */}
                  {jobDetailConfig?.job_publishing_date && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Job Date:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob?.jobDate
                          ? format(
                              new Date(selectedJob?.jobDate),
                              "dd-MMM-yyyy"
                            )
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Job Title: */}
                  {jobDetailConfig?.job_title && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Job Title:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob?.jobTitle ? selectedJob?.jobTitle : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Grade: */}
                  {jobDetailConfig?.grade && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Grade:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob?.Grade?.formName
                          ? selectedJob?.Grade?.formName
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Country: */}
                  {jobDetailConfig?.country && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Country:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob?.Country?.name
                          ? selectedJob?.Country?.name
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Cities: */}
                  {jobDetailConfig?.city && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        City:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob?.Cities?.length > 0
                          ? selectedJob?.Cities.map((el: any) => el?.name).join(
                              ",  "
                            )
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Employee Type: */}
                  {jobDetailConfig?.employee_type && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Employee Type:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob?.EmployeeType?.formName
                          ? selectedJob?.EmployeeType?.formName
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Employee Status: */}
                  {jobDetailConfig?.employee_status && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Employee Status:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob?.EmployeeStatus?.formName
                          ? selectedJob?.EmployeeStatus?.formName
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Department: */}
                  {jobDetailConfig?.department && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Department:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob.Department?.deptName
                          ? selectedJob.Department?.deptName
                          : ""}
                      </p>
                    </div>
                  )}
                  {/* Last date to apply: */}
                  {jobDetailConfig?.jobPostingDateTo && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Last date to apply:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob.jobPostingDateTo
                          ? format(
                              new Date(selectedJob.jobPostingDateTo),
                              "dd-MMM-yyyy"
                            )
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Report To: */}
                  {jobDetailConfig?.report_to && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Report To:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob.ReportToDesignation?.formName
                          ? selectedJob.ReportToDesignation?.formName
                          : ""}
                      </p>
                    </div>
                  )}
                  {/* Total positions: */}
                  {jobDetailConfig?.no_of_vacancies && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Total positions:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob?.noOfPosition
                          ? selectedJob?.noOfPosition
                          : ""}
                      </p>
                    </div>
                  )}
                  {/* Job type: */}
                  {jobDetailConfig?.job_prefrences && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Job type:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob.JobPreference?.formName
                          ? selectedJob.JobPreference?.formName
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Job Period: */}
                  {jobDetailConfig?.job_prefrences && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Job Period:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob.jobPeriodStart
                          ? format(
                              new Date(selectedJob?.jobPeriodStart),
                              "dd-MMM-yyyy"
                            )
                          : "N/A"}{" "}
                        to{" "}
                        {selectedJob?.jobPeriodStart
                          ? format(
                              new Date(selectedJob?.jobPeriodEnd),
                              "dd-MMM-yyyy"
                            )
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Date Of Appointment: */}
                  {jobDetailConfig?.desire_date_of_apointment && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Date Of Appointment:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob.desireDateOfApp
                          ? format(
                              new Date(selectedJob?.desireDateOfApp),
                              "dd-MMM-yyyy"
                            )
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Appointment Type: */}
                  {jobDetailConfig?.appointment_type && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Appointment Type:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob.AppointmentType?.formName
                          ? selectedJob.AppointmentType?.formName
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Priority: */}
                  {jobDetailConfig?.priority && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Priority:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob.PriorityType?.formName
                          ? selectedJob.PriorityType?.formName
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Age: */}
                  {jobDetailConfig?.preferred_age_range && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Age:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob.preferredAgeFrom
                          ? selectedJob.preferredAgeFrom
                          : "N/A"}{" "}
                        to{" "}
                        {selectedJob.preferredAgeTo
                          ? selectedJob.preferredAgeTo
                          : "N/A"}{" "}
                        Year(s)
                      </p>
                    </div>
                  )}
                  {/* Qualification: */}
                  {jobDetailConfig?.preferred_qualification && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Qualification:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob.PreferredQualification?.formName
                          ? selectedJob.PreferredQualification?.formName
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Shifts: */}
                  {jobDetailConfig?.preferred_shift && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Shifts:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob?.PreferedShift?.length > 0
                          ? selectedJob?.PreferedShift.map(
                              (el: any) => el?.formName
                            ).join(",  ")
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Gender: */}
                  {jobDetailConfig?.preferred_gender && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Gender:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob?.Gender?.length > 0
                          ? selectedJob?.Gender.map(
                              (el: any) => el?.formName
                            ).join(",  ")
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Preferred Skills: */}
                  {jobDetailConfig?.preferred_job_skills && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Preferred Skills:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob?.PreferedSkills?.length > 0
                          ? selectedJob?.PreferedSkills.map(
                              (el: any) => el?.formName
                            ).join(",  ")
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Preferred Industry: */}
                  {jobDetailConfig?.preferred_job_industry && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Preferred Industry:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob?.PreferredJobIndustry?.formName
                          ? selectedJob?.PreferredJobIndustry?.formName
                          : "N/A"}
                      </p>
                    </div>
                  )}
                  {/* Experience: */}
                  {jobDetailConfig?.work_experience_range && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Experience:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob.workExpFrom && selectedJob.workExpTo
                          ? `${selectedJob.workExpFrom} to ${selectedJob.workExpTo} Year(s)`
                          : ""}
                      </p>
                    </div>
                  )}
                  {/* Salary range: */}
                  {jobDetailConfig?.salary_range && (
                    <div className="flex items-center">
                      <h3 className="text-xs font-bold text-[#222222] w-40">
                        Salary range:
                      </h3>
                      <p className="text-xs text-[#222222]">
                        {selectedJob?.currency || " "}{" "}
                        {selectedJob.salaryRangeFrom &&
                        selectedJob.salaryRangeTo
                          ? `${Number(
                              selectedJob.salaryRangeFrom
                            ).toLocaleString()} to
                      ${Number(selectedJob.salaryRangeTo).toLocaleString()}`
                          : "N/A"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t m-2 md:m-6 border-[#707070]">
            <div className="py-3 text-[#222222]">
              <h2 className="text-lg font-medium ">Description</h2>
              <div className="mt-4 max-w-none  text-sm">
                {jobDetailConfig?.job_summary && (
                  <div>
                    <h5 className="text-md font-medium my-2 underline ">
                      Summary
                    </h5>
                    <p>{selectedJob?.jobSummary || ""}</p>
                  </div>
                )}
                {jobDetailConfig?.work_experience_detail && (
                  <div>
                    <h5 className="text-md font-medium my-2 underline ">
                      Experience Detail
                    </h5>
                    <p className="mt-4">{selectedJob?.workExpDetail || ""}</p>
                  </div>
                )}
                {jobDetailConfig?.incentive_package && (
                  <div>
                    <h5 className="text-md font-medium my-2 underline ">
                      Incentive
                    </h5>
                    <p className="mt-4">
                      {selectedJob?.incentivePackages || ""}
                    </p>
                  </div>
                )}
                {jobDetailConfig?.other_benefits && (
                  <div>
                    <h5 className="text-md font-medium my-2 underline ">
                      Benefits
                    </h5>
                    <p className="mt-4">{selectedJob?.otherBenefits || ""}</p>
                  </div>
                )}
                {jobDetailConfig?.comments && (
                  <div>
                    <h5 className="text-md font-medium my-2 underline ">
                      Remarks
                    </h5>
                    <p className="mt-4">{selectedJob?.comment || ""}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetailPage;
