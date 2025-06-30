import { useEffect, useState } from "react";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  FormProvider,
  Controller,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SelectOption from "../components/SelectOption";
import InputArea from "../components/Inputarea";
import TextArea from "../components/TextArea";
import { CirclePlus, CircleUserRound, MinusCircle } from "lucide-react";
import StarRating from "../components/StarRating";
import useCompanyConfig from "../hooks/useCompanyConfig";
import {
  applicatFormSubmit,
  fetchApplicant,
  fetchCityOptionAction,
  fetchCountryOptionAction,
  fetchFormOptionAction,
  fetchJobMandatorySkills,
  uploadFiles,
} from "../store/actions/jobActions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { getUploadUrl } from "../../lib/utils";

// Utility to convert '26-Feb-1999' to '1999-02-26'
function convertDateString(dateStr: string): string {
  if (!dateStr || typeof dateStr !== "string") return dateStr;
  const match = dateStr.match(/^\d{1,2}-[A-Za-z]{3}-\d{4}$/);
  if (!match) return dateStr;
  const [_, day, mon, year] =
    dateStr.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/) || [];
  const months: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  return `${year}-${months[mon] || "01"}-${day.padStart(2, "0")}`;
}

function convertApplicantDates(
  data: any,
  setPhoto: any,
  setCvFileName: any
): any {
  if (!data) return data;
  const newData = { ...data };
  if (newData?.profile_image) {
    setPhoto(getUploadUrl(newData?.profile_image));
  }
  if (newData?.file) {
    setCvFileName(newData?.file);
  }
  if (newData.dateOfBirth)
    newData.dateOfBirth = convertDateString(newData.dateOfBirth);
  if (Array.isArray(newData.academics)) {
    newData.academics = newData.academics.map((a: any) => ({
      ...a,
      startDate: a.startDate ? convertDateString(a.startDate) : a.startDate,
      endDate: a.endDate ? convertDateString(a.endDate) : a.endDate,
    }));
  }
  if (Array.isArray(newData.experiences)) {
    newData.experiences = newData.experiences.map((e: any) => ({
      ...e,
      startDate: e.startDate ? convertDateString(e.startDate) : e.startDate,
      endDate: e.endDate ? convertDateString(e.endDate) : e.endDate,
    }));
  }
  if (Array.isArray(newData.skills)) {
    newData.skills = newData.skills.map((s: any) => ({
      ...s,
      startDate: s.startDate ? convertDateString(s.startDate) : s.startDate,
      endDate: s.endDate ? convertDateString(s.endDate) : s.endDate,
    }));
  }
  return newData;
}

// Utility to build Zod schema dynamically from applicantFormConfig
function buildApplicantFormSchema(applicantFormConfig: any) {
  // Helper to decide required/optional string
  const str = (key: string) =>
    applicantFormConfig?.[key]
      ? z.string().min(1, "Required")
      : z.string().optional();
  // Helper to decide required/optional number
  const num = (key: string) =>
    applicantFormConfig?.[key]
      ? z.coerce
          .number({
            required_error: "Required",
            invalid_type_error: "Required",
          })
          .min(1, "Required")
      : z.coerce.number().optional();
  // Helper for email
  const email = (key: string) =>
    applicantFormConfig?.[key]
      ? z.string().email("Invalid")
      : z.string().optional();

  // Academic Table
  const academicRequired = !!applicantFormConfig?.academic_info;
  const academicObj = z.object({
    institutionId: num("academic_info"),
    degreeId: num("academic_info"),
    gpa: academicRequired
      ? z.coerce
          .number()
          .min(1, "Required")
          .max(4, "GPA must be between 1 and 4")
      : z.coerce.number().optional(),
    startDate: str("academic_info"),
    endDate: str("academic_info"),
    cityId: num("academic_info"),
    countryId: num("academic_info"),
  });

  // Experience Table
  const experienceRequired = !!applicantFormConfig?.experience_info;
  const experienceObj = z.object({
    companyName: str("professional_info"),
    positionHeld: str("professional_info"),
    startDate: str("professional_info"),
    endDate: str("professional_info"),
    cityId: num("professional_info"),
    countryId: num("professional_info"),
  });

  // Skills Table
  const skillsRequired = !!applicantFormConfig?.skills_info;
  const skillObj = z.object({
    isReq: z.boolean().optional(),
    skill: str("skills_info"),
    description: str("skills_info"),
    startDate: str("skills_info"),
    endDate: str("skills_info"),
    ratingScale: skillsRequired
      ? z.number().min(0).max(5)
      : z.number().optional(),
  });

  return z.object({
    // Basic Information
    title: str("title"),
    firstName: str("firstName"),
    middleName: str("middleName"),
    lastName: str("lastName"),

    // Personal Information
    dateOfBirth: str("dateOfBirth").refine((date) => {
      if (!date) return true;
      const today = new Date();
      const birthDate = new Date(date);
      return birthDate <= today;
    }, "Date of birth cannot be in the future"),
    nic_no: str("nic_no"),
    passportNo: str("passportNo"),
    relation_name: str("relation_name"),
    nationality: num("nationality"),
    gender: str("gender"),
    maritalStatus: num("maritalStatus"),
    lastDawnSalaryCurrencyId: num("current_salary"),
    expectedSalaryCurrencyId: num("expected_salary"),
    religionId: num("religion"),

    // Contact Information
    countryId: num("countryId"),
    cityId: num("cityId"),
    additional_summary: str("address"),
    phone_cell: str("phone_cell"),
    phone_official: str("phone_official"),
    email_personal: email("email_personal"),

    // General Information
    applicantCanJoin: num("applicantCanJoin"),
    currentDesignation: str("currentDesignation"),
    lastDawnSalary: num("current_salary"),
    expectedSalaryRangeFrom: num("expected_salary"),
    expectedSalaryRangeTo: num("expected_salary"),
    otherInformation: str("otherInformation"),
    profile_image: applicantFormConfig?.profile_image
      ? z
          .union([z.string(), z.instanceof(File)])
          .nullable()
          .optional()
      : z.any().optional(),
    file: applicantFormConfig?.file
      ? z
          .union([z.string(), z.instanceof(File)])
          .nullable()
          .optional()
      : z.any().optional(),

    // Academic Information
    academics: academicRequired
      ? z.array(academicObj).min(1, "At least one academic record is required")
      : z.array(academicObj).optional(),

    // Professional Experience
    experiences: experienceRequired
      ? z
          .array(experienceObj)
          .min(1, "At least one experience record is required")
      : z.array(experienceObj).optional(),

    // Skills
    skills: skillsRequired
      ? z.array(skillObj).min(1, "At least one skill is required")
      : z.array(skillObj).optional(),

    // Add notification boolean
    isNotifiedForJobPosting: z.boolean().optional(),
  });
}

const ApplicantFormPage = () => {
  const { companyConfig } = useCompanyConfig();
  const {
    company,
    themeConfig,
    applicantFormConfig,
    applicant_form_percent_config,
  } = companyConfig;
  const { primary_color, secondary_color } = themeConfig;

  const dispatch = useDispatch<AppDispatch>();

  const jobStates = useSelector((state: RootState) => state.jobs);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string>("");
  const jobId = localStorage.getItem("jobId");

  // Build schema dynamically
  const applicantFormSchema = buildApplicantFormSchema(applicantFormConfig);

  type ApplicantFormData = z.infer<typeof applicantFormSchema>;

  const methods = useForm<z.infer<typeof applicantFormSchema>>({
    resolver: zodResolver(applicantFormSchema) as any,
    defaultValues: jobStates?.applicantData || {},
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = methods;

  // Watch all form fields for changes
  const formValues = watch();

  const {
    fields: academicFields,
    append: appendAcademic,
    remove: removeAcademic,
  } = useFieldArray({
    control,
    name: "academics",
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experiences",
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  const appendNewSkill = () => {
    appendSkill({
      isReq: false,
      skill: "",
      description: "",
      startDate: "",
      endDate: "",
      ratingScale: 0,
    });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setValue("profile_image", file as any);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const requiredForForm = (key: any, form: any) => {
    return applicantFormConfig[key] ? (form ? true : false) : true;
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    let completion = 0;

    // Basic Info (20%)
    if (
      requiredForForm("title", formValues.title) &&
      requiredForForm("firstName", formValues.firstName) &&
      requiredForForm("middleName", formValues.middleName) &&
      requiredForForm("lastName", formValues.lastName)
    ) {
      completion += Number(applicant_form_percent_config?.basic_info_perc);
    }

    // Personal Info (20%)
    if (
      requiredForForm("dateOfBirth", formValues.dateOfBirth) &&
      requiredForForm("nic_no", formValues.nic_no) &&
      requiredForForm("passportNo", formValues.passportNo) &&
      requiredForForm("nationality", formValues.nationality) &&
      requiredForForm("gender", formValues.gender) &&
      requiredForForm("maritalStatus", formValues.maritalStatus) &&
      requiredForForm("relation_name", formValues.relation_name)
    ) {
      completion += Number(applicant_form_percent_config?.personal_info_perc);
    }

    // Contact Info (20%)
    if (
      requiredForForm("countryId", formValues.countryId) &&
      requiredForForm("cityId", formValues.cityId) &&
      requiredForForm("address", formValues.additional_summary) &&
      requiredForForm("phone_cell", formValues.phone_cell) &&
      requiredForForm("phone_official", formValues.phone_official) &&
      requiredForForm("email_personal", formValues.email_personal)
    ) {
      completion += Number(applicant_form_percent_config?.contact_info_perc);
    }

    // General Info (20%)
    if (
      requiredForForm("applicantCanJoin", formValues.applicantCanJoin) &&
      requiredForForm("currentDesignation", formValues.currentDesignation) &&
      requiredForForm("current_salary", formValues.lastDawnSalary) &&
      requiredForForm("expected_salary", formValues.expectedSalaryRangeFrom) &&
      requiredForForm("expected_salary", formValues.expectedSalaryRangeTo)
    ) {
      completion += Number(applicant_form_percent_config?.general_info_perc);
    }

    // Academic Info (20%)
    if (formValues.academics && formValues.academics.length > 0) {
      completion += Number(applicant_form_percent_config?.academic_info_perc);
    }
    // Experience Info
    if (formValues.experiences && formValues.experiences.length > 0) {
      completion += Number(
        applicant_form_percent_config?.professional_info_perc
      );
    }
    // skills Info
    if (formValues.skills && formValues.skills.length > 0) {
      completion += Number(applicant_form_percent_config?.skills_info_perc);
    }

    if (photo) {
      completion += Number(applicant_form_percent_config?.profile_pic_perc);
    }
    if (cvFileName) {
      completion += Number(applicant_form_percent_config?.cv_upload_perc);
    }
    return completion;
  };

  const completionPercentage = calculateCompletion();

  const onSubmit: SubmitHandler<ApplicantFormData> = async (data) => {
    // setIsSubmitting(true);
    if (data?.file && typeof data?.file === "object") {
      await uploadFiles(data?.file).then((e) => {
        data.file = e?.data?.filename;
      });
    }
    if (data?.profile_image && typeof data?.profile_image === "object") {
      await uploadFiles(data?.profile_image).then((e) => {
        data.profile_image = e?.data?.filename;
      });
    }

    const payload = {
      ...data,
      jobId: jobId !== "none" ? jobId : null,
    };
    dispatch(
      applicatFormSubmit({
        data: payload,
        setIsSubmitting,
        setSubmitSuccess,
        setError,
      })
    );
  };

  useEffect(() => {
    dispatch(fetchApplicant());
    dispatch(
      fetchFormOptionAction({ parentId: "128", key: "nationalityList" })
    );
    dispatch(fetchFormOptionAction({ parentId: "187", key: "genderList" }));
    dispatch(
      fetchFormOptionAction({ parentId: "190", key: "maritalStatusList" })
    );
    dispatch(fetchFormOptionAction({ parentId: "87", key: "religionList" }));
    dispatch(fetchFormOptionAction({ parentId: "109", key: "insitutionList" }));
    dispatch(fetchFormOptionAction({ parentId: "126", key: "currencyList" }));
    dispatch(
      fetchFormOptionAction({ parentId: "108", key: "qualificationList" })
    );
    dispatch(fetchCountryOptionAction({ key: "countryList" }));
    dispatch(fetchCityOptionAction({ key: "academicCityList" }));
    dispatch(fetchCityOptionAction({ key: "profCityList" }));
  }, []);

  useEffect(() => {
    if (jobStates?.applicantData) {
      const converted = convertApplicantDates(
        jobStates.applicantData,
        setPhoto,
        setCvFileName
      );
      methods.reset(converted);
    }
  }, [jobStates?.applicantData]);

  let countryId = watch("countryId");
  useEffect(() => {
    if (countryId) {
      dispatch(fetchCityOptionAction({ key: "cityList", countryId }));
    }
  }, [countryId]);

  useEffect(() => {
    // Only run if jobId and applicantData are loaded
    if (jobId && jobStates?.applicantData) {
      fetchJobMandatorySkills(jobId).then((res) => {
        // Get current skills from form
        const currentSkills = methods.getValues("skills") || [];
        res.forEach((e: any) => {
          // Check if skill already exists
          const exists = currentSkills.some(
            (s) => s.skill === e?.formName && s.isReq
          );
          if (!exists) {
            appendSkill({
              isReq: true,
              skill: e?.formName,
              description: "",
              startDate: "",
              endDate: "",
              ratingScale: 0,
            });
          }
        });
      });
    }
    // eslint-disable-next-line
  }, [jobId, jobStates?.applicantData]);

  if (submitSuccess && error === null) {
    return (
      <div
        style={{ background: secondary_color }}
        className="min-h-screen flex flex-col"
      >
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="mb-4 p-4  text-green-700 rounded-md">
              {localStorage.getItem("jobId") !== "none"
                ? "Application submitted successfully! We will review your application and get back to you soon."
                : "Profile updated successfully"}
            </div>
            <Link
              to="/jobs"
              className="mt-4 px-4 py-2 bg-transparent text-sm border-[#000000] border rounded-full text-[#00000]"
            >
              Back to Jobs
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{ background: secondary_color }}
        className="min-h-screen flex flex-col"
      >
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="mb-4 p-4  text-red-700 rounded-md">{error}</div>
            <Link
              to="/jobs"
              className="mt-4 px-4 py-2 bg-transparent text-sm border-[#000000] border rounded-full text-[#00000]"
            >
              Back to Jobs
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      {jobStates?.isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div
          style={{ background: secondary_color }}
          className={`min-h-screen flex flex-col`}
        >
          <Header />
          <main className="flex-1 py-8">
            <div className="2xl:max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Form */}
                <div className="lg:col-span-3 order-2 lg:order-1">
                  <FormProvider {...methods}>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      {/* Basic Information */}
                      <div className="py-4">
                        <h2 className="text-xl font-medium text-[#222222] mb-2">
                          Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                          <div>
                            <SelectOption
                              placeholder="Title"
                              options={[
                                { value: "Mr.", label: "Mr." },
                                { value: "Ms.", label: "Ms." },
                                { value: "Mrs.", label: "Mrs." },
                                { value: "Dr.", label: "Dr." },
                                { value: "Professor.", label: "Professor." },
                              ]}
                              error={errors.title?.message}
                              registration={{
                                ...register("title"),
                              }}
                            />
                          </div>
                          <InputArea
                            id="firstName"
                            placeholder="First Name"
                            type="text"
                            error={errors.firstName?.message}
                            registration={{
                              ...register("firstName"),
                            }}
                          />
                          <InputArea
                            id="middleName"
                            placeholder="Middle Name"
                            type="text"
                            error={errors.middleName?.message}
                            registration={{
                              ...register("middleName"),
                            }}
                          />
                          <InputArea
                            id="lastName"
                            placeholder="Last Name"
                            type="text"
                            error={errors.lastName?.message}
                            registration={{
                              ...register("lastName"),
                            }}
                          />
                        </div>
                      </div>

                      {/* Personal Information */}
                      <div className="py-4">
                        <h2 className="text-xl font-medium text-[#222222] mb-2">
                          Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <InputArea
                            id="dateOfBirth"
                            placeholder="Date of Birth"
                            type="date"
                            max={new Date().toISOString().split("T")[0]}
                            error={errors.dateOfBirth?.message}
                            registration={{
                              ...register("dateOfBirth"),
                            }}
                          />
                          <InputArea
                            id="nic_no"
                            placeholder="Id Card No"
                            type="text"
                            error={errors.nic_no?.message}
                            registration={{
                              ...register("nic_no"),
                            }}
                          />
                          <InputArea
                            id="passportNo"
                            placeholder="Passport No"
                            type="text"
                            error={errors.passportNo?.message}
                            registration={{
                              ...register("passportNo"),
                            }}
                          />
                          <div>
                            <SelectOption
                              placeholder="Nationality"
                              options={
                                Array.isArray(jobStates?.nationalityList)
                                  ? jobStates.nationalityList.map((e) => {
                                      return {
                                        label: e?.label,
                                        value: e?.value,
                                      };
                                    })
                                  : []
                              }
                              error={errors.nationality?.message}
                              registration={{
                                ...register("nationality"),
                              }}
                            />
                          </div>
                          <div>
                            <SelectOption
                              placeholder="Gender"
                              options={
                                Array.isArray(jobStates?.genderList)
                                  ? jobStates.genderList.map((e) => {
                                      return {
                                        label: e?.label,
                                        value: e?.label,
                                      };
                                    })
                                  : []
                              }
                              error={errors.gender?.message}
                              registration={{
                                ...register("gender"),
                              }}
                            />
                          </div>
                          <div>
                            <SelectOption
                              placeholder="Marital Status"
                              options={
                                Array.isArray(jobStates?.maritalStatusList)
                                  ? jobStates.maritalStatusList
                                  : []
                              }
                              error={errors.maritalStatus?.message}
                              registration={{
                                ...register("maritalStatus"),
                              }}
                            />
                          </div>
                          <div>
                            <SelectOption
                              placeholder="Religion"
                              options={
                                Array.isArray(jobStates?.religionList)
                                  ? jobStates.religionList
                                  : []
                              }
                              error={errors.religionId?.message}
                              registration={{
                                ...register("religionId"),
                              }}
                            />
                          </div>
                          <InputArea
                            id="relation_name"
                            placeholder="S/O, D/O, W/O"
                            type="text"
                            error={errors.relation_name?.message}
                            registration={{
                              ...register("relation_name"),
                            }}
                          />
                        </div>
                      </div>

                      {/* Current Address and Contact Information */}
                      <div className="py-4">
                        <h2 className="text-xl font-medium text-[#222222] mb-2">
                          Current Address and Contact Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                          <div>
                            <SelectOption
                              placeholder="Country"
                              options={
                                Array.isArray(jobStates?.countryList)
                                  ? jobStates.countryList
                                  : []
                              }
                              error={errors.countryId?.message}
                              registration={{
                                ...register("countryId"),
                              }}
                            />
                          </div>
                          <div>
                            <SelectOption
                              placeholder="City"
                              disable={!watch("countryId")}
                              options={
                                Array.isArray(jobStates?.cityList)
                                  ? jobStates.cityList
                                  : []
                              }
                              error={errors.cityId?.message}
                              registration={{
                                ...register("cityId"),
                              }}
                            />
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <InputArea
                              id="additional_summary"
                              placeholder="Address"
                              type="text"
                              error={errors.additional_summary?.message}
                              registration={{
                                ...register("additional_summary"),
                              }}
                            />
                          </div>
                          <div>
                            <InputArea
                              id="phone_cell"
                              placeholder="Phone (Offical)"
                              type="tel"
                              error={errors.phone_cell?.message}
                              registration={{
                                ...register("phone_cell"),
                              }}
                            />
                          </div>
                          <div>
                            <InputArea
                              id="phone_official"
                              placeholder="Cell No"
                              type="tel"
                              error={errors.phone_official?.message}
                              registration={{
                                ...register("phone_official"),
                              }}
                            />
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <InputArea
                              id="email_personal"
                              placeholder="Email Address"
                              type="email"
                              error={errors.email_personal?.message}
                              registration={{
                                ...register("email_personal"),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      {/* General Information */}
                      <div className="py-4">
                        <h2 className="text-xl font-medium text-[#222222] mb-2">
                          General Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                          <div>
                            <InputArea
                              id="applicantCanJoin"
                              placeholder="Tenative Days of Joining"
                              type="number"
                              error={errors.applicantCanJoin?.message}
                              registration={{
                                ...register("applicantCanJoin"),
                              }}
                            />
                          </div>
                          <div>
                            <SelectOption
                              placeholder="Currency"
                              options={
                                Array.isArray(jobStates?.currencyList)
                                  ? jobStates.currencyList
                                  : []
                              }
                              error={errors.lastDawnSalaryCurrencyId?.message}
                              registration={{
                                ...register(`lastDawnSalaryCurrencyId`),
                              }}
                            />
                          </div>
                          <div>
                            <Controller
                              control={control}
                              name="lastDawnSalary"
                              render={({ field }) => (
                                <InputArea
                                  id="lastDawnSalary"
                                  amountFormat={true}
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder="Current Salary"
                                  type="number"
                                  error={errors.lastDawnSalary?.message}
                                />
                              )}
                            />
                          </div>
                          <div>
                            <InputArea
                              id="currentDesignation"
                              placeholder="Current Designation"
                              type="text"
                              error={errors.currentDesignation?.message}
                              registration={{
                                ...register("currentDesignation"),
                              }}
                            />
                          </div>
                          <div>
                            <SelectOption
                              placeholder="Expected Currency"
                              options={
                                Array.isArray(jobStates?.currencyList)
                                  ? jobStates.currencyList
                                  : []
                              }
                              error={errors.expectedSalaryCurrencyId?.message}
                              registration={{
                                ...register(`expectedSalaryCurrencyId`),
                              }}
                            />
                          </div>
                          <div>
                            <Controller
                              control={control}
                              name="expectedSalaryRangeFrom"
                              render={({ field }) => (
                                <InputArea
                                  id="expectedSalaryRangeFrom"
                                  amountFormat={true}
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder="Expected Salary Range From"
                                  type="number"
                                  error={
                                    errors.expectedSalaryRangeFrom?.message
                                  }
                                />
                              )}
                            />
                          </div>
                          <div className="col-span-1 md:col-span-1">
                            <Controller
                              control={control}
                              name="expectedSalaryRangeTo"
                              render={({ field }) => (
                                <InputArea
                                  id="expectedSalaryRangeTo"
                                  amountFormat={true}
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder="Expected Salary Range To"
                                  type="number"
                                  error={errors.expectedSalaryRangeTo?.message}
                                />
                              )}
                            />
                          </div>
                          <div className="col-span-1 md:col-span-4">
                            <TextArea
                              id="otherInformation"
                              placeholder="Enter any other relevant information you wish to share"
                              error={errors.otherInformation?.message}
                              registration={{
                                ...register("otherInformation"),
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Academic Information */}
                      <div className="py-4">
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-xl font-medium text-[#222222]">
                            Academic
                            <span className="text-xs font-normal ml-2 text-red-600">
                              {errors.academics?.root?.message}
                            </span>
                          </h2>
                          <button
                            type="button"
                            onClick={() =>
                              appendAcademic({
                                institutionId: undefined,
                                degreeId: undefined,
                                gpa: 0,
                                startDate: "",
                                endDate: "",
                                cityId: undefined,
                                countryId: undefined,
                              })
                            }
                            className="text-xs bg-[#222222] hover:bg-transparent hover:text-[#222222] border border-[#222222] rounded-full text-white px-3 p-1"
                          >
                            <CirclePlus className="inline-block w-3 h-3" /> Add
                          </button>
                        </div>
                        <div>
                          <div className="overflow-x-auto">
                            <div className="min-w-[800px]">
                              <table className="w-full font-normal">
                                <thead>
                                  <tr className="bg-white rounded-md text-[#222222]">
                                    <th className="px-4 py-2 text-left text-sm font-normal">
                                      Action
                                    </th>
                                    <th className="px-4 py-2 min-w-40 text-left text-sm font-normal">
                                      Institution
                                    </th>
                                    <th className="px-4 py-2 min-w-36 text-left text-sm font-normal">
                                      Qualification
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-normal">
                                      CGPA
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-normal">
                                      Start Date
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-normal">
                                      End Date
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm min-w-28 font-normal">
                                      Country
                                    </th>
                                    <th className="px-4 py-2 text-left min-w-28 text-sm font-normal">
                                      City
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {academicFields.map((field, index) => (
                                    <tr
                                      key={field.id}
                                      className="border-b text-[#222222] text-center"
                                    >
                                      <td>
                                        <button
                                          type="button"
                                          onClick={() => removeAcademic(index)}
                                          className="text-red-500 hover:text-red-600"
                                        >
                                          <MinusCircle className="w-4 h-4" />
                                        </button>
                                      </td>
                                      <td className="p-1">
                                        <div>
                                          <SelectOption
                                            placeholder="Institution"
                                            options={
                                              Array.isArray(
                                                jobStates?.insitutionList
                                              )
                                                ? jobStates.insitutionList
                                                : []
                                            }
                                            error={
                                              errors.academics?.[index]
                                                ?.institutionId?.message
                                            }
                                            registration={{
                                              ...register(
                                                `academics.${index}.institutionId`
                                              ),
                                            }}
                                          />
                                        </div>
                                      </td>
                                      <td className="p-1">
                                        <div>
                                          <SelectOption
                                            placeholder="Qualification"
                                            options={
                                              Array.isArray(
                                                jobStates?.qualificationList
                                              )
                                                ? jobStates.qualificationList
                                                : []
                                            }
                                            error={
                                              errors.academics?.[index]
                                                ?.degreeId?.message
                                            }
                                            registration={{
                                              ...register(
                                                `academics.${index}.degreeId`
                                              ),
                                            }}
                                          />
                                        </div>
                                      </td>
                                      <td className="p-1">
                                        <InputArea
                                          id="gpa"
                                          placeholder="CGPA"
                                          type="number"
                                          error={
                                            errors.academics?.[index]?.gpa
                                              ?.message
                                          }
                                          registration={{
                                            ...register(
                                              `academics.${index}.gpa`
                                            ),
                                          }}
                                        />
                                      </td>
                                      <td className="p-1">
                                        <InputArea
                                          id="startDate"
                                          placeholder="Start Date"
                                          type="date"
                                          error={
                                            errors.academics?.[index]?.startDate
                                              ?.message
                                          }
                                          registration={{
                                            ...register(
                                              `academics.${index}.startDate`
                                            ),
                                          }}
                                        />
                                      </td>
                                      <td className="p-1">
                                        <InputArea
                                          id="endDate"
                                          placeholder="End Date"
                                          type="date"
                                          error={
                                            errors.academics?.[index]?.endDate
                                              ?.message
                                          }
                                          registration={{
                                            ...register(
                                              `academics.${index}.endDate`
                                            ),
                                          }}
                                        />
                                      </td>

                                      <td className="p-1">
                                        <SelectOption
                                          placeholder="Country"
                                          options={
                                            Array.isArray(
                                              jobStates?.countryList
                                            )
                                              ? jobStates.countryList
                                              : []
                                          }
                                          error={
                                            errors.academics?.[index]?.countryId
                                              ?.message
                                          }
                                          registration={{
                                            ...register(
                                              `academics.${index}.countryId`
                                            ),
                                          }}
                                        />
                                      </td>
                                      <td className="p-1">
                                        <SelectOption
                                          disable={
                                            !watch(
                                              `academics.${index}.countryId`
                                            )
                                          }
                                          placeholder="City"
                                          options={
                                            Array.isArray(
                                              jobStates?.academicCityList
                                            )
                                              ? jobStates.academicCityList.filter(
                                                  (e) =>
                                                    e?.countryId ===
                                                    watch(
                                                      `academics.${index}.countryId`
                                                    )
                                                )
                                              : []
                                          }
                                          error={
                                            errors.academics?.[index]?.cityId
                                              ?.message
                                          }
                                          registration={{
                                            ...register(
                                              `academics.${index}.cityId`
                                            ),
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Experience Section */}
                      <div className="py-4">
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="text-xl font-medium text-[#222222]">
                            Professional
                            <span className="text-xs font-normal ml-2 text-red-600">
                              {errors.experiences?.root?.message}
                            </span>
                          </h2>
                          <button
                            type="button"
                            onClick={() =>
                              appendExperience({
                                companyName: "",
                                positionHeld: "",
                                startDate: "",
                                endDate: "",
                                cityId: undefined,
                                countryId: undefined,
                              })
                            }
                            className="text-xs bg-[#222222] text-white hover:bg-transparent hover:text-[#222222] border border-[#222222] px-3 p-1 rounded-full"
                          >
                            <CirclePlus className="inline-block w-3 h-3" /> Add
                          </button>
                        </div>
                        <div className="overflow-x-auto">
                          <div className="min-w-[800px]">
                            <table className="w-full font-normal">
                              <thead>
                                <tr className="bg-white rounded-md text-[#222222]">
                                  <th className="px-4 py-2 text-left text-sm font-normal">
                                    Action
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-normal">
                                    Employer
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-normal">
                                    Designation
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-normal">
                                    Start Date
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-normal">
                                    End Date
                                  </th>
                                  <th className="px-4 py-2 text-left min-w-28 text-sm font-normal">
                                    Country
                                  </th>
                                  <th className="px-4 py-2 text-left min-w-28 text-sm font-normal">
                                    City
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {experienceFields.map((field, index) => (
                                  <tr
                                    key={field.id}
                                    className="border-b text-[#222222] text-center"
                                  >
                                    <td>
                                      <button
                                        type="button"
                                        onClick={() => removeExperience(index)}
                                        className="text-red-500 hover:text-red-600"
                                      >
                                        <MinusCircle className="w-4 h-4" />
                                      </button>
                                    </td>
                                    <td className="p-1">
                                      <InputArea
                                        id="companyName"
                                        placeholder="Employer"
                                        type="text"
                                        error={
                                          errors.experiences?.[index]
                                            ?.companyName?.message
                                        }
                                        registration={{
                                          ...register(
                                            `experiences.${index}.companyName`
                                          ),
                                        }}
                                      />
                                    </td>
                                    <td className="p-1">
                                      <InputArea
                                        id="positionHeld"
                                        placeholder="Designation"
                                        type="text"
                                        error={
                                          errors.experiences?.[index]
                                            ?.positionHeld?.message
                                        }
                                        registration={{
                                          ...register(
                                            `experiences.${index}.positionHeld`
                                          ),
                                        }}
                                      />
                                    </td>
                                    <td className="p-1">
                                      <InputArea
                                        id="startDate"
                                        placeholder="Start Date"
                                        type="date"
                                        error={
                                          errors.experiences?.[index]?.startDate
                                            ?.message
                                        }
                                        registration={{
                                          ...register(
                                            `experiences.${index}.startDate`
                                          ),
                                        }}
                                      />
                                    </td>
                                    <td className="p-1">
                                      <InputArea
                                        id="endDate"
                                        placeholder="End Date"
                                        type="date"
                                        error={
                                          errors.experiences?.[index]?.endDate
                                            ?.message
                                        }
                                        registration={{
                                          ...register(
                                            `experiences.${index}.endDate`
                                          ),
                                        }}
                                      />
                                    </td>
                                    <td className="p-1">
                                      <SelectOption
                                        placeholder="Country"
                                        options={
                                          Array.isArray(jobStates?.countryList)
                                            ? jobStates.countryList
                                            : []
                                        }
                                        error={
                                          errors.experiences?.[index]?.countryId
                                            ?.message
                                        }
                                        registration={{
                                          ...register(
                                            `experiences.${index}.countryId`
                                          ),
                                        }}
                                      />
                                    </td>
                                    <td className="p-1">
                                      <SelectOption
                                        placeholder="City"
                                        disable={
                                          !watch(
                                            `experiences.${index}.countryId`
                                          )
                                        }
                                        options={
                                          Array.isArray(jobStates?.profCityList)
                                            ? jobStates.profCityList.filter(
                                                (e) =>
                                                  e?.countryId ===
                                                  watch(
                                                    `experiences.${index}.countryId`
                                                  )
                                              )
                                            : []
                                        }
                                        error={
                                          errors.experiences?.[index]?.cityId
                                            ?.message
                                        }
                                        registration={{
                                          ...register(
                                            `experiences.${index}.cityId`
                                          ),
                                        }}
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Skills Section */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold">
                            Skills
                            <span className="text-xs font-normal ml-2 text-red-600">
                              {errors.skills?.root?.message}
                            </span>
                          </h2>
                          <button
                            type="button"
                            onClick={appendNewSkill}
                            className="text-xs bg-[#222222] text-white text-center px-3 p-1 hover:bg-transparent hover:text-[#222222] border border-[#222222] rounded-full"
                          >
                            <CirclePlus className="inline-block w-3 h-3" /> Add
                          </button>
                        </div>
                        <div className="overflow-x-auto">
                          <div className="min-w-[800px]">
                            <table className="w-full">
                              <thead className="rounded-xl">
                                <tr className="bg-white text-[#222222]">
                                  <th className="px-4 py-2 text-left text-sm font-normal">
                                    Action
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-normal">
                                    Skill Name
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-normal">
                                    Details
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-normal">
                                    Start Date
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-normal">
                                    End Date
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-normal">
                                    Rating
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {skillFields.map((field, index) => (
                                  <tr
                                    key={field.id}
                                    className="border-b text-[#222222] text-center"
                                  >
                                    <td>
                                      <button
                                        type="button"
                                        disabled={field?.isReq}
                                        onClick={() => removeSkill(index)}
                                        className={
                                          field?.isReq
                                            ? "text-red-200 hover:text-red-300 cursor-not-allowed"
                                            : "text-red-500 hover:text-red-600 cursor-pointer"
                                        }
                                      >
                                        <MinusCircle className="w-4 h-4" />
                                      </button>
                                    </td>
                                    <td className="p-1">
                                      <InputArea
                                        id="skill"
                                        disable={field?.isReq}
                                        placeholder="Skill Name"
                                        type="text"
                                        error={
                                          errors.skills?.[index]?.skill?.message
                                        }
                                        registration={{
                                          ...register(`skills.${index}.skill`),
                                        }}
                                      />
                                    </td>
                                    <td className="p-1">
                                      <InputArea
                                        id="description"
                                        placeholder="Details"
                                        type="text"
                                        error={
                                          errors.skills?.[index]?.description
                                            ?.message
                                        }
                                        registration={{
                                          ...register(
                                            `skills.${index}.description`
                                          ),
                                        }}
                                      />
                                    </td>
                                    <td className="p-1">
                                      <InputArea
                                        id="startDate"
                                        placeholder="Start Date"
                                        type="date"
                                        error={
                                          errors.skills?.[index]?.startDate
                                            ?.message
                                        }
                                        registration={{
                                          ...register(
                                            `skills.${index}.startDate`
                                          ),
                                        }}
                                      />
                                    </td>
                                    <td className="p-1">
                                      <InputArea
                                        id="endDate"
                                        placeholder="End Date"
                                        type="date"
                                        error={
                                          errors.skills?.[index]?.endDate
                                            ?.message
                                        }
                                        registration={{
                                          ...register(
                                            `skills.${index}.endDate`
                                          ),
                                        }}
                                      />
                                    </td>
                                    <td className="p-1">
                                      <StarRating
                                        value={
                                          watch(
                                            `skills.${index}.ratingScale`
                                          ) ?? 1
                                        }
                                        onChange={(value) => {
                                          setValue(
                                            `skills.${index}.ratingScale`,
                                            value,
                                            {
                                              shouldValidate: true,
                                              shouldDirty: true,
                                            }
                                          );
                                        }}
                                        error={
                                          errors.skills?.[index]?.ratingScale
                                            ?.message
                                        }
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Upload CV */}

                      {/* Submit Button */}
                      <div>
                        <label className="flex items-center gap-2 mb-4">
                          <input
                            type="checkbox"
                            {...register("isNotifiedForJobPosting")}
                            defaultChecked={false}
                          />
                          <span className="text-xs text-[#222222]">Receive new job posting notification</span>
                        </label>
                        <div className="flex flex-col md:flex-row justify-between md:items-center">
                          <div className="py-6">
                            <h2 className="text-xl font-medium text-[#222222] mb-4">
                              Upload Your Updated CV
                            </h2>
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                setValue("file", file as any);
                                setCvFileName(file?.name || "");
                              }}
                              className="hidden"
                              id="cv-upload"
                            />
                            <label
                              htmlFor="cv-upload"
                              className="text-xs bg-[#222222] hover:bg-transparent hover:text-[#222222] border border-[#222222] text-white px-4 p-2 rounded-full cursor-pointer inline-flex items-center py-2 "
                            >
                              Choose File
                            </label>
                            {cvFileName && (
                              <span className="ml-2 text-sm text-gray-700">
                                {cvFileName}
                              </span>
                            )}
                            <p className="mt-2 text-xs text-gray-500">
                              Upload your CV in .PDF, .DOC, or .DOCX format
                            </p>
                          </div>
                          <button
                            type="submit"
                            className="px-4 disabled:opacity-50 h-fit hover:bg-transparent text-sm hover:text-[#222222] border-2 border-[#222222] bg-[#222222] text-white py-2 rounded-full font-medium hover:bg-black transition-colors"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : "Submit"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </FormProvider>
                </div>

                {/* Progress Sidebar */}
                <div className="justify-self-center order-1 lg:order-2 lg:justify-self-end lg:col-span-1">
                  <div className="sticky top-8 flex flex-row gap-2 lg:gap-4 lg:flex-col">
                    <div className="bg-white rounded-xl w-fit shadow-sm px-8 py-6 ">
                      <p className="text-black text-sm text-center mb-4">
                        Profile Picture
                      </p>
                      <div className="text-center">
                        <div className="w-20 h-20 sm:w-32 mx-auto sm:h-32 rounded-full mb-2 flex items-center justify-center overflow-hidden">
                          {photo ? (
                            <img
                              src={photo}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <CircleUserRound className="w-20 h-20 sm:w-32 sm:h-32 stroke-[1.4]" />
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden w-0"
                          id="photo-upload"
                        />
                        <label
                          htmlFor="photo-upload"
                          className="text-xs bg-[#222222] text-white px-3 py-2 rounded-full cursor-pointer"
                        >
                          {photo ? "Change Photo" : "Choose File"}
                        </label>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl w-fit shadow-sm px-8 py-6 ">
                      <p className="text-black text-sm text-center mb-4">
                        Profile Status
                      </p>
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-20 h-20 sm:w-32 sm:h-32 rounded-full flex items-center justify-center mb-2 ${
                            completionPercentage <= 40
                              ? "bg-[#E23F35]"
                              : completionPercentage <= 60
                              ? "bg-[#F1E007]"
                              : completionPercentage <= 80
                              ? "bg-[#DD8941]"
                              : "bg-[#34B9A3]"
                          }`}
                        >
                          <span className="text-white text-2xl font-bold">
                            {completionPercentage}%
                          </span>
                        </div>
                        <p
                          className={`text-xs text-white rounded-full px-3 py-2 ${
                            completionPercentage <= 40
                              ? "bg-[#E23F35]"
                              : completionPercentage <= 60
                              ? "bg-[#F1E007]"
                              : completionPercentage <= 80
                              ? "bg-[#DD8941]"
                              : "bg-[#34B9A3]"
                          }`}
                        >
                          {completionPercentage <= 40
                            ? "Incomplete"
                            : completionPercentage <= 60
                            ? "Good"
                            : completionPercentage <= 80
                            ? "Excellent"
                            : "Completed"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      )}
    </>
  );
};

export default ApplicantFormPage;
