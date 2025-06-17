import { useState } from "react";
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  FormProvider,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SelectOption from "../components/SelectOption";
import InputArea from "../components/Inputarea";
import TextArea from "../components/TextArea";
import { CircleUserRound, MinusCircle } from "lucide-react";
import StarRating from "../components/StarRating";

// Define the schema for the form
const applicantFormSchema = z.object({
  // Basic Information
  title: z.string().min(1, "Title is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),

  // Personal Information
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  citizenship: z.string().min(1, "Citizenship is required"),
  nationalId: z.string().min(1, "National ID is required"),
  nationality: z.string().min(1, "Nationality is required"),
  gender: z.string().min(1, "Gender is required"),
  maritalStatus: z.string().min(1, "Marital status is required"),
  religion: z.string().optional(),
  nic: z.string().min(1, "NIC/CNIC/SNIC is required"),

  // Contact Information
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  mobileWithCountryCode: z.string().min(1, "Mobile number is required"),
  landlineWithCountryCode: z.string().optional(),
  emailAddress: z.string().email("Invalid email address"),

  // General Information
  tenativeDaysOfJoining: z.coerce
    .number()
    .min(1, "Tenative days of joining is required"),
  currentDesignation: z.string().min(1, "Current designation is required"),
  currentEmployer: z.string().min(1, "Current employer is required"),
  currentSalary: z.coerce.number().min(1, "Current salary is required"),
  expectedSalaryRangeFrom: z.coerce
    .number()
    .min(1, "Expected salary range from is required"),
  expectedSalaryRangeTo: z.coerce
    .number()
    .min(1, "Expected salary range to is required"),
  anyOtherRelevantInformationYouWishToShare: z.string().optional(),

  // Academic Information
  academics: z
    .array(
      z.object({
        institution: z.string().min(1, "Institution is required"),
        qualification: z.string().min(1, "Qualification is required"),
        cgpa: z.string().min(1, "CGPA is required"),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().min(1, "End date is required"),
        city: z.string().min(1, "City is required"),
        country: z.string().min(1, "Country is required"),
      })
    )
    .min(1, "At least one academic record is required"),

  // Professional Experience
  experiences: z
    .array(
      z.object({
        employer: z.string().min(1, "Employer is required"),
        designation: z.string().min(1, "Designation is required"),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().min(1, "End date is required"),
        city: z.string().min(1, "City is required"),
        country: z.string().min(1, "Country is required"),
      })
    )
    .min(1, "At least one experience record is required"),

  // Skills
  skills: z
    .array(
      z.object({
        skillName: z.string().min(1, "Skill name is required"),
        details: z.string().min(1, "Skill details are required"),
        startDate: z.string().min(1, "Start date is required"),
        endDate: z.string().min(1, "End date is required"),
        rating: z.number().min(0).max(5),
        certification: z.string().optional(),
      })
    )
    .min(1, "At least one skill is required"),
});

type ApplicantFormData = z.infer<typeof applicantFormSchema>;

const ApplicantFormPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);

  const methods = useForm<ApplicantFormData>({
    resolver: zodResolver(applicantFormSchema) as any,
    defaultValues: {
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      citizenship: "",
      nationalId: "",
      nationality: "",
      gender: "",
      maritalStatus: "",
      religion: "",
      nic: "",
      country: "",
      city: "",
      address: "",
      mobileWithCountryCode: "",
      landlineWithCountryCode: "",
      emailAddress: "",
      tenativeDaysOfJoining: 0,
      currentDesignation: "",
      currentEmployer: "",
      currentSalary: 0,
      expectedSalaryRangeFrom: 0,
      expectedSalaryRangeTo: 0,
      anyOtherRelevantInformationYouWishToShare: "",
      academics: [],
      experiences: [],
      skills: [],
    },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    getValues,
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
      skillName: "",
      details: "",
      startDate: "",
      endDate: "",
      rating: 1,
      certification: "",
    });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    let completion = 0;

    // Basic Info (20%)
    if (formValues.title && formValues.firstName && formValues.lastName) {
      completion += 20;
    }

    // Personal Info (20%)
    if (
      formValues.dateOfBirth &&
      formValues.citizenship &&
      formValues.nationalId &&
      formValues.nationality &&
      formValues.gender &&
      formValues.maritalStatus &&
      formValues.nic
    ) {
      completion += 20;
    }

    // Contact Info (20%)
    if (
      formValues.country &&
      formValues.city &&
      formValues.address &&
      formValues.mobileWithCountryCode &&
      formValues.emailAddress
    ) {
      completion += 20;
    }

    // General Info (20%)
    if (
      formValues.tenativeDaysOfJoining &&
      formValues.currentDesignation &&
      formValues.currentEmployer &&
      formValues.currentSalary &&
      formValues.expectedSalaryRangeFrom &&
      formValues.expectedSalaryRangeTo
    ) {
      completion += 20;
    }

    // Academic Info (20%)
    if (formValues.academics && formValues.academics.length > 0) {
      completion += 20;
    }

    return completion;
  };

  const completionPercentage = calculateCompletion();

  const onSubmit: SubmitHandler<ApplicantFormData> = (data) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", data);
      setIsSubmitting(false);
      setSubmitSuccess(true);
    }, 2000);
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
              Application submitted successfully! We will review your
              application and get back to you soon.
            </div>
            <Link
              to="/jobs"
              className="inline-block bg-[#0096d6] text-white py-2 px-4 rounded-md font-medium hover:bg-[#007bb8] transition-colors"
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
    <div className="min-h-screen flex flex-col bg-[#f5fafd]">
      <Header />
      <main className="flex-1 py-8">
        <div className="2xl:max-w-[85vw] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Form */}
            <div className="lg:col-span-3">
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                            { value: "Mr", label: "Mr" },
                            { value: "Ms", label: "Ms" },
                            { value: "Mrs", label: "Mrs" },
                            { value: "Dr", label: "Dr" },
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
                        error={errors.dateOfBirth?.message}
                        registration={{
                          ...register("dateOfBirth"),
                        }}
                      />
                      <InputArea
                        id="citizenship"
                        placeholder="Citizenship Number"
                        type="text"
                        error={errors.citizenship?.message}
                        registration={{
                          ...register("citizenship"),
                        }}
                      />
                      <InputArea
                        id="nationalId"
                        placeholder="National ID"
                        type="text"
                        error={errors.nationalId?.message}
                        registration={{
                          ...register("nationalId"),
                        }}
                      />
                      <InputArea
                        id="nationality"
                        placeholder="Nationality"
                        type="text"
                        error={errors.nationality?.message}
                        registration={{
                          ...register("nationality"),
                        }}
                      />
                      <div>
                        <SelectOption
                          placeholder="Gender"
                          options={[
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" },
                            { value: "Other", label: "Other" },
                          ]}
                          error={errors.gender?.message}
                          registration={{
                            ...register("gender"),
                          }}
                        />
                      </div>
                      <div>
                        <SelectOption
                          placeholder="Marital Status"
                          options={[
                            { value: "Single", label: "Single" },
                            { value: "Married", label: "Married" },
                            { value: "Divorced", label: "Divorced" },
                            { value: "Widowed", label: "Widowed" },
                          ]}
                          error={errors.maritalStatus?.message}
                          registration={{
                            ...register("maritalStatus"),
                          }}
                        />
                      </div>
                      <InputArea
                        id="religion"
                        placeholder="Religion"
                        type="text"
                        error={errors.religion?.message}
                        registration={{
                          ...register("religion"),
                        }}
                      />
                      <InputArea
                        id="nic"
                        placeholder="S/O, D/O, W/O"
                        type="text"
                        error={errors.nic?.message}
                        registration={{
                          ...register("nic"),
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
                      <div className="col-span-1">
                        <InputArea
                          id="country"
                          placeholder="Country"
                          type="text"
                          error={errors.country?.message}
                          registration={{
                            ...register("country"),
                          }}
                        />
                      </div>
                      <div className="col-span-1">
                        <InputArea
                          id="city"
                          placeholder="City"
                          type="text"
                          error={errors.city?.message}
                          registration={{
                            ...register("city"),
                          }}
                        />
                      </div>
                      <div className="col-span-2">
                        <InputArea
                          id="address"
                          placeholder="Address"
                          type="text"
                          error={errors.address?.message}
                          registration={{
                            ...register("address"),
                          }}
                        />
                      </div>
                      <div className="col-span-1">
                        <InputArea
                          id="mobileWithCountryCode"
                          placeholder="Mobile with country code"
                          type="tel"
                          error={errors.mobileWithCountryCode?.message}
                          registration={{
                            ...register("mobileWithCountryCode"),
                          }}
                        />
                      </div>
                      <div className="col-span-1">
                        <InputArea
                          id="landlineWithCountryCode"
                          placeholder="Landline with country code"
                          type="tel"
                          error={errors.landlineWithCountryCode?.message}
                          registration={{
                            ...register("landlineWithCountryCode"),
                          }}
                        />
                      </div>
                      <div className="col-span-2">
                        <InputArea
                          id="emailAddress"
                          placeholder="Email Address"
                          type="email"
                          error={errors.emailAddress?.message}
                          registration={{
                            ...register("emailAddress"),
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
                      <div className="col-span-1">
                        <InputArea
                          id="tenativeDaysOfJoining"
                          placeholder="Tenative Days of Joining"
                          type="number"
                          error={errors.tenativeDaysOfJoining?.message}
                          registration={{
                            ...register("tenativeDaysOfJoining"),
                          }}
                        />
                      </div>
                      <div className="col-span-1">
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
                      <div className="col-span-2">
                        <InputArea
                          id="currentEmployer"
                          placeholder="Current Employer"
                          type="text"
                          error={errors.currentEmployer?.message}
                          registration={{
                            ...register("currentEmployer"),
                          }}
                        />
                      </div>
                      <div className="col-span-1">
                        <InputArea
                          id="currentSalary"
                          placeholder="Current Salary"
                          type="number"
                          error={errors.currentSalary?.message}
                          registration={{
                            ...register("currentSalary"),
                          }}
                        />
                      </div>
                      <div className="col-span-1">
                        <InputArea
                          id="expectedSalaryRangeFrom"
                          placeholder="Expected Salary Range From"
                          type="number"
                          error={errors.expectedSalaryRangeFrom?.message}
                          registration={{
                            ...register("expectedSalaryRangeFrom"),
                          }}
                        />
                      </div>
                      <div className="col-span-2">
                        <InputArea
                          id="expectedSalaryRangeTo"
                          placeholder="Expected Salary Range To"
                          type="number"
                          error={errors.expectedSalaryRangeTo?.message}
                          registration={{
                            ...register("expectedSalaryRangeTo"),
                          }}
                        />
                      </div>
                      <div className="col-span-4">
                        <TextArea
                          id="anyOtherRelevantInformationYouWishToShare"
                          placeholder="Enter any other relevant information you wish to share"
                          error={
                            errors.anyOtherRelevantInformationYouWishToShare
                              ?.message
                          }
                          registration={{
                            ...register(
                              "anyOtherRelevantInformationYouWishToShare"
                            ),
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="py-4">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-medium text-[#222222]">
                        Academic Information
                      </h2>
                      <button
                        type="button"
                        onClick={() =>
                          appendAcademic({
                            institution: "",
                            qualification: "",
                            cgpa: "",
                            startDate: "",
                            endDate: "",
                            city: "",
                            country: "",
                          })
                        }
                        className="text-sm bg-[#222222] hover:bg-transparent hover:text-[#222222] border border-[#222222] rounded-full text-white px-4 p-2"
                      >
                        + Add
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <div className="min-w-[800px]">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-white rounded-md text-[#222222]">
                              <th className="px-4 py-2 text-left text-sm">
                                Action
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                Institution
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                Qualification
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                CGPA
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                Start Date
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                End Date
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                City
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                Country
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
                                  <InputArea
                                    id="institution"
                                    placeholder="Institution"
                                    type="text"
                                    error={
                                      errors.academics?.[index]?.institution
                                        ?.message
                                    }
                                    registration={{
                                      ...register(
                                        `academics.${index}.institution`
                                      ),
                                    }}
                                  />
                                </td>
                                <td className="p-1">
                                  <InputArea
                                    id="qualification"
                                    placeholder="Qualification"
                                    type="text"
                                    error={
                                      errors.academics?.[index]?.qualification
                                        ?.message
                                    }
                                    registration={{
                                      ...register(
                                        `academics.${index}.qualification`
                                      ),
                                    }}
                                  />
                                </td>
                                <td className="p-1">
                                  <InputArea
                                    id="cgpa"
                                    placeholder="CGPA"
                                    type="number"
                                    error={
                                      errors.academics?.[index]?.cgpa?.message
                                    }
                                    registration={{
                                      ...register(`academics.${index}.cgpa`),
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
                                      ...register(`academics.${index}.startDate`),
                                    }}
                                  />
                                </td>
                                <td className="p-1">
                                  <InputArea
                                    id="endDate"
                                    placeholder="End Date"
                                    type="date"
                                    error={
                                      errors.academics?.[index]?.endDate?.message
                                    }
                                    registration={{
                                      ...register(`academics.${index}.endDate`),
                                    }}
                                  />
                                </td>
                                <td className="p-1">
                                  <InputArea
                                    id="city"
                                    placeholder="City"
                                    type="text"
                                    error={
                                      errors.academics?.[index]?.city?.message
                                    }
                                    registration={{
                                      ...register(`academics.${index}.city`),
                                    }}
                                  />
                                </td>
                                <td className="p-1">
                                  <InputArea
                                    id="country"
                                    placeholder="Country"
                                    type="text"
                                    error={
                                      errors.academics?.[index]?.country?.message
                                    }
                                    registration={{
                                      ...register(`academics.${index}.country`),
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

                  {/* Experience Section */}
                  <div className="py-4">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-medium text-[#222222]">
                        Professional Experience
                      </h2>
                      <button
                        type="button"
                        onClick={() =>
                          appendExperience({
                            employer: "",
                            designation: "",
                            startDate: "",
                            endDate: "",
                            city: "",
                            country: "",
                          })
                        }
                        className="text-sm bg-[#222222] text-white hover:bg-transparent hover:text-[#222222] border border-[#222222] px-4 p-2 rounded-full"
                      >
                        + Add Experience
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <div className="min-w-[800px]">
                        <table className="w-full font-normal">
                          <thead>
                            <tr className="bg-white rounded-md text-[#222222]">
                              <th className="px-4 py-2 text-left text-sm">
                                Action
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                Employer
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                Designation
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                Start Date
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                End Date
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                City
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                Country
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
                                    id="employer"
                                    placeholder="Employer"
                                    type="text"
                                    error={
                                      errors.experiences?.[index]?.employer
                                        ?.message
                                    }
                                    registration={{
                                      ...register(
                                        `experiences.${index}.employer`
                                      ),
                                    }}
                                  />
                                </td>
                                <td className="p-1">
                                  <InputArea
                                    id="designation"
                                    placeholder="Designation"
                                    type="text"
                                    error={
                                      errors.experiences?.[index]?.designation
                                        ?.message
                                    }
                                    registration={{
                                      ...register(
                                        `experiences.${index}.designation`
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
                                      ...register(`experiences.${index}.endDate`),
                                    }}
                                  />
                                </td>
                                <td className="p-1">
                                  <InputArea
                                    id="city"
                                    placeholder="City"
                                    type="text"
                                    error={
                                      errors.experiences?.[index]?.city?.message
                                    }
                                    registration={{
                                      ...register(`experiences.${index}.city`),
                                    }}
                                  />
                                </td>
                                <td className="p-1">
                                  <InputArea
                                    id="country"
                                    placeholder="Country"
                                    type="text"
                                    error={
                                      errors.experiences?.[index]?.country
                                        ?.message
                                    }
                                    registration={{
                                      ...register(`experiences.${index}.country`),
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
                      <h2 className="text-lg font-semibold">Skills</h2>
                      <button
                        type="button"
                        onClick={appendNewSkill}
                        className="text-sm bg-[#222222] text-white px-4 p-2 hover:bg-transparent hover:text-[#222222] border border-[#222222] rounded-full"
                      >
                        + Add Skill
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <div className="min-w-[900px]">
                        <table className="w-full">
                          <thead className="rounded-xl">
                            <tr className="bg-white text-[#222222]">
                              <th className="px-4 py-2 text-left text-sm">
                                Action
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                Skill Name
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                Details
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                Start Date
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                End Date
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                Rating
                              </th>
                              <th className="px-4 py-2 text-left text-sm">
                                Certification
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
                                    onClick={() => removeSkill(index)}
                                    className="text-red-500 hover:text-red-600"
                                  >
                                    <MinusCircle className="w-4 h-4" />
                                  </button>
                                </td>
                                <td className="p-1">
                                  <InputArea
                                    id="skillName"
                                    placeholder="Skill Name"
                                    type="text"
                                    error={
                                      errors.skills?.[index]?.skillName?.message
                                    }
                                    registration={{
                                      ...register(`skills.${index}.skillName`),
                                    }}
                                  />
                                </td>
                                <td className="p-1">
                                  <InputArea
                                    id="details"
                                    placeholder="Details"
                                    type="text"
                                    error={
                                      errors.skills?.[index]?.details?.message
                                    }
                                    registration={{
                                      ...register(`skills.${index}.details`),
                                    }}
                                  />
                                </td>
                                <td className="p-1">
                                  <InputArea
                                    id="startDate"
                                    placeholder="Start Date"
                                    type="date"
                                    error={
                                      errors.skills?.[index]?.startDate?.message
                                    }
                                    registration={{
                                      ...register(`skills.${index}.startDate`),
                                    }}
                                  />
                                </td>
                                <td className="p-1">
                                  <InputArea
                                    id="endDate"
                                    placeholder="End Date"
                                    type="date"
                                    error={
                                      errors.skills?.[index]?.endDate?.message
                                    }
                                    registration={{
                                      ...register(`skills.${index}.endDate`),
                                    }}
                                  />
                                </td>
                                <td className="p-1">
                                  <StarRating
                                    value={watch(`skills.${index}.rating`) ?? 1}
                                    onChange={(value) => {
                                      setValue(`skills.${index}.rating`, value, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                      });
                                    }}
                                    error={
                                      errors.skills?.[index]?.rating?.message
                                    }
                                  />
                                </td>
                                <td className="p-1">
                                  <InputArea
                                    id="certification"
                                    placeholder="Certification"
                                    type="text"
                                    error={
                                      errors.skills?.[index]?.certification
                                        ?.message
                                    }
                                    registration={{
                                      ...register(
                                        `skills.${index}.certification`
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

                  {/* Upload CV */}
                  <div className="py-6">
                    <h2 className="text-xl font-medium text-[#222222] mb-4">
                      Upload Your Updated CV
                    </h2>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id="cv-upload"
                    />
                    <label
                      htmlFor="cv-upload"
                      className="text-sm bg-[#222222] hover:bg-transparent hover:text-[#222222] border border-[#222222] text-white px-4 p-2 rounded-full cursor-pointer inline-flex items-center py-2 "
                    >
                      Choose File
                    </label>
                    <p className="mt-2 text-sm text-gray-500">
                      Upload your CV in PDF, DOC, or DOCX format
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-8 disabled:opacity-50 hover:bg-transparent hover:text-[#222222] border-2 border-[#222222] bg-[#222222] text-white py-4 rounded-full font-medium hover:bg-black transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              </FormProvider>
            </div>

            {/* Progress Sidebar */}
            <div className="max-sm:m-auto lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white rounded-xl w-fit shadow-sm px-8 py-6 mb-4">
                  <div className="text-center mb-6">
                    <div className="w-32 h-32 rounded-full mb-2 flex items-center justify-center overflow-hidden">
                      {photo ? (
                        <img
                          src={photo}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <CircleUserRound className="w-32 h-32" />
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
                <div className="bg-white rounded-xl w-fit shadow-sm px-8 py-6 mb-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-32 h-32 rounded-full flex items-center justify-center mb-2 ${
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
  );
};

export default ApplicantFormPage;
