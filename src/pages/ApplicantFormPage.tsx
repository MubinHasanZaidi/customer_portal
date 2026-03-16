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
import { formatDates } from "../utils/common";
import { ArrowRight, CirclePlus, CircleUserRound, Trash2 } from "lucide-react";
import StarRating from "../components/StarRating";
import useCustomerConfig from "../hooks/useCustomerConfig";
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
import useHandleNavigation from "../hooks/useHandleNavigation";
import InputDate from "../components/InputDate";
import MaskedInputField from "../components/MaskedInput";

function convertApplicantDates(
  data: any,
  setPhoto: any,
  setCvFileName: any
): any {
  if (!data) return data;
  const newData = { ...data };
  if (newData?.profile_image) {
    setPhoto(newData?.profile_image);
  }
  if (newData?.file) {
    setCvFileName(newData?.file);
  }
  return newData;
}

// Utility to build Zod schema dynamically from applicantFormConfig
function buildApplicantFormSchema(
  applicantFormConfig: any,
  localizationId: any
) {
  // Helper to decide required/optional string
  const str = (key: string) =>
    applicantFormConfig?.[key]
      ? z
          .string()
          .nullable()
          .refine((val) => val !== null && val.trim() !== "", {
            message: "Required",
          })
      : z.string().nullable().optional();
  // Helper to decide required/optional number
  const num = (key: string) =>
    applicantFormConfig?.[key]
      ? z.coerce
          .number({
            required_error: "Required",
            invalid_type_error: "Required",
          })
          .min(1, "Required")
      : z.coerce.number().nullable().optional().default(null);
  // Helper for email
  const email = (key: string) =>
    applicantFormConfig?.[key]
      ? z
          .union([z.string(), z.null()]) // allow string or null
          .transform((val) => (val === "" ? null : val))
          .refine(
            (val) => {
              if (val === null) return false; // treat null as missing → trigger Required
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
            },
            {
              message: "Invalid",
            }
          )
          .refine((val) => val !== null, { message: "Required" })
      : z.string().nullable().optional();

  // Academic Table
  const academicRequired = !!applicantFormConfig?.academic_info;
  const academicObj = z
    .object({
      institutionId: num("academic_info"),
      degreeId: num("academic_info"),
      gpa: academicRequired
        ? z.coerce.number().min(1, "b/w 1 and 9").max(9, "b/w 1 and 9")
        : z.coerce.number().optional(),
      startDate: str("academic_info"),
      endDate: str("academic_info"),
      cityId: num("academic_info"),
      countryId: num("academic_info"),
    })
    .refine(
      (data) => {
        if (!data.startDate || !data.endDate) return true;
        return new Date(data.endDate) >= new Date(data.startDate);
      },
      {
        message: "Invalid Date Range.",
        path: ["endDate"],
      }
    );
  // Experience Table
  const experienceRequired = !!applicantFormConfig?.experience_info;
  const experienceObj = z
    .object({
      companyName: str("experience_info"),
      positionHeld: str("experience_info"),
      startDate: str("experience_info"),
      endDate: str("experience_info"),
      cityId: num("experience_info"),
      countryId: num("experience_info"),
    })
    .refine(
      (data) => {
        if (!data.startDate || !data.endDate) return true;
        return new Date(data.endDate) >= new Date(data.startDate);
      },
      {
        message: "Invalid Date Range.",
        path: ["endDate"],
      }
    );

  // Skills Table
  const skillsRequired = !!applicantFormConfig?.skills_info;
  const skillObj = z
    .object({
      isReq: z.boolean().optional(),
      skill: str("skills_info"),
      description: str("skills_info"),
      startDate: str("skills_info"),
      endDate: str("skills_info"),
      ratingScale: skillsRequired
        ? z.number().min(0).max(5)
        : z.number().optional(),
    })
    .refine(
      (data) => {
        if (!data.startDate || !data.endDate) return true;
        return new Date(data.endDate) >= new Date(data.startDate);
      },
      {
        message: "Invalid Date Range.",
        path: ["endDate"],
      }
    );
  return z
    .object({
      // Basic Information
      title: str("title"),
      firstName: str("firstName"),
      middleName: str("middleName"),
      lastName: str("lastName"),

      // Personal Information
      dateOfBirth: applicantFormConfig?.["dateOfBirth"]
        ? z
            .string()
            .nullable()
            .refine((val) => val !== null && val.trim() !== "", {
              message: "Required",
            })
            .refine((date) => {
              if (!date) return true;
              const today = new Date();
              const birthDate = new Date(date);
              return birthDate <= today;
            }, "Date of birth cannot be in the future")
        : z.string().nullable().optional(),
      nic_no: applicantFormConfig?.["nic_no"]
        ? localizationId == 1
          ? z
              .string()
              .regex(/^\d{5}-\d{7}-\d{1}$/, "Format: 12345-1234567-1")
              .nullable()
              .refine((val) => val !== null && val.trim() !== "", {
                message: "Required",
              })
          : z
              .string()
              .max(22, "Maximum 22 characters allowed")
              .nullable()
              .refine((val) => val !== null && val.trim() !== "", {
                message: "Required",
              })
        : z.string().optional(),

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
      phone_cell: applicantFormConfig?.["phone_cell"]
        ? z
            .union([z.string(), z.null()]) // allow string or null
            .transform((val) => (val === "" ? null : val))
            .refine(
              (val) => {
                if (val === null) return false; // treat null as missing → trigger Required
                return /^0[0-9]{9,14}$/.test(val);
              },
              {
                message:
                  "Must start with 0 and contain only digits (10–15 digits)",
              }
            )
            .refine((val) => val !== null, { message: "Required" })
        : z.string().nullable().optional(),
      phone_official: applicantFormConfig?.["phone_official"]
        ? z
            .union([z.string(), z.null()]) // allow string or null
            .transform((val) => (val === "" ? null : val))
            .refine(
              (val) => {
                if (val === null) return false; // treat null as missing → trigger Required
                return /^0[0-9]{9,14}$/.test(val);
              },
              {
                message:
                  "Must start with 0 and contain only digits (10–15 digits)",
              }
            )
            .refine((val) => val !== null, { message: "Required" })
        : z.string().nullable().optional(),
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
        ? z.array(academicObj).min(1, "One record is required.")
        : z.array(academicObj).optional(),

      // Professional Experience
      experiences: experienceRequired
        ? z.array(experienceObj).min(1, "One record is required.")
        : z.array(experienceObj).optional(),

      // Skills
      skills: skillsRequired
        ? z.array(skillObj).min(1, "One record is required.")
        : z.array(skillObj).optional(),

      // Add notification boolean
      isNotifiedForJobPosting: z.boolean().optional(),
    })
    .refine(
      (data) =>
        !data.expectedSalaryRangeFrom ||
        !data.expectedSalaryRangeTo ||
        Number(data.expectedSalaryRangeFrom) <=
          Number(data.expectedSalaryRangeTo),
      {
        path: ["expectedSalaryRangeTo"],
        message: "Expected salary range To must be greater than From",
      }
    )
    .superRefine((data, ctx) => {
      if (data.title === "Mr." && data.gender !== "Male") {
        ctx.addIssue({
          path: ["gender"],
          code: z.ZodIssueCode.custom,
          message: "Mr. cannot be Female.",
        });
      }
      if (
        (data.title === "Mrs." || data.title === "Ms.") &&
        data.gender !== "Female"
      ) {
        ctx.addIssue({
          path: ["gender"],
          code: z.ZodIssueCode.custom,
          message: `${data.title} cannot be Male.`,
        });
      }
      if (
        data.title === "Mrs." &&
        (data.maritalStatus === 266 || data.maritalStatus === 269)
      ) {
        ctx.addIssue({
          path: ["maritalStatus"],
          code: z.ZodIssueCode.custom,
          message: `Mrs. cannot be Single or Divorced.`,
        });
      }
      if (data.title === "Mr." && data.maritalStatus === 268) {
        ctx.addIssue({
          path: ["maritalStatus"],
          code: z.ZodIssueCode.custom,
          message: `Mr. cannot be Widow.`,
        });
      }

      // Academic validation - ONLY for optional case when user added rows
      if (data.academics && data.academics.length > 0 && !academicRequired) {
        data.academics.forEach((academic, index) => {
          // Check if this academic record has any data
          // Validate required fields
          if (!academic.institutionId) {
            ctx.addIssue({
              path: [`academics.${index}.institutionId`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }
          if (!academic.degreeId) {
            ctx.addIssue({
              path: [`academics.${index}.degreeId`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }
          if (!academic.gpa) {
            ctx.addIssue({
              path: [`academics.${index}.gpa`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }
          if (!academic.startDate) {
            ctx.addIssue({
              path: [`academics.${index}.startDate`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }
          if (!academic.endDate) {
            ctx.addIssue({
              path: [`academics.${index}.endDate`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }
          if (!academic.cityId) {
            ctx.addIssue({
              path: [`academics.${index}.cityId`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }
          if (!academic.countryId) {
            ctx.addIssue({
              path: [`academics.${index}.countryId`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }

          // Date range validation
          if (academic.startDate && academic.endDate) {
            if (new Date(academic.endDate) < new Date(academic.startDate)) {
              ctx.addIssue({
                path: [`academics.${index}.endDate`],
                code: z.ZodIssueCode.custom,
                message: "Invalid Date Range.",
              });
            }
          }
        });
      }

      // Same for experiences
      if (
        data.experiences &&
        data.experiences.length > 0 &&
        !experienceRequired
      ) {
        data.experiences.forEach((experience, index) => {
          // Validate required fields
          if (!experience.companyName) {
            ctx.addIssue({
              path: [`experiences.${index}.companyName`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }
          if (!experience.positionHeld) {
            ctx.addIssue({
              path: [`experiences.${index}.positionHeld`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }
          if (!experience.startDate) {
            ctx.addIssue({
              path: [`experiences.${index}.startDate`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }
          if (!experience.endDate) {
            ctx.addIssue({
              path: [`experiences.${index}.endDate`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }
          if (!experience.cityId) {
            ctx.addIssue({
              path: [`experiences.${index}.cityId`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }
          if (!experience.countryId) {
            ctx.addIssue({
              path: [`experiences.${index}.countryId`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }

          // Date range validation
          if (experience.startDate && experience.endDate) {
            if (new Date(experience.endDate) < new Date(experience.startDate)) {
              ctx.addIssue({
                path: [`experiences.${index}.endDate`],
                code: z.ZodIssueCode.custom,
                message: "Invalid Date Range.",
              });
            }
          }
        });
      }

      // Same for skills
      if (data.skills && data.skills.length > 0 && !skillsRequired) {
        data.skills.forEach((skill, index) => {
          // Validate required fields
          if (!skill.skill) {
            ctx.addIssue({
              path: [`skills.${index}.skill`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }
          if (!skill.description) {
            ctx.addIssue({
              path: [`skills.${index}.description`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }
          if (!skill.startDate) {
            ctx.addIssue({
              path: [`skills.${index}.startDate`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }
          if (!skill.endDate) {
            ctx.addIssue({
              path: [`skills.${index}.endDate`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }
          if (skill.ratingScale === undefined || skill.ratingScale === null) {
            ctx.addIssue({
              path: [`skills.${index}.ratingScale`],
              code: z.ZodIssueCode.custom,
              message: "Required",
            });
          }

          // Date range validation
          if (skill.startDate && skill.endDate) {
            if (new Date(skill.endDate) < new Date(skill.startDate)) {
              ctx.addIssue({
                path: [`skills.${index}.endDate`],
                code: z.ZodIssueCode.custom,
                message: "Invalid Date Range.",
              });
            }
          }
        });
      }
    });
}

// Helper to safely get error messages for dynamic fields
function getFieldError<T = any>(
  errors: Record<number, any> | undefined,
  index: number,
  key: keyof T
) {
  if (
    errors &&
    typeof errors === "object" &&
    errors[index] &&
    errors[index][key]
  ) {
    return (errors[index][key] as any).message;
  }
  return undefined;
}

const ApplicantFormPage = () => {
  const { customerConfig } = useCustomerConfig();
  const {
    company,
    themeConfig,
    applicantFormConfig,
    applicant_form_percent_config,
    subsidiary,
  } = customerConfig;
  const { primary_color, secondary_color } = themeConfig;

  const dispatch = useDispatch<AppDispatch>();

  const jobStates = useSelector((state: RootState) => state.jobs);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string>("");
  const jobId = localStorage.getItem("jobId");
  const localizationId =
    localStorage.getItem("localizationId") ||
    subsidiary[0]?.localizationId ||
    null;

  // Build schema dynamically
  const applicantFormSchema = buildApplicantFormSchema(
    applicantFormConfig,
    localizationId
  );

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
    formState: { errors, dirtyFields },
  } = methods;

  if (dirtyFields) {
    useHandleNavigation();
  }

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
    const academicsArr = Array.isArray(formValues.academics)
      ? formValues.academics
      : [];
    if (academicsArr.length > 0) {
      completion += Number(applicant_form_percent_config?.academic_info_perc);
    }
    // Experience Info
    const experiencesArr = Array.isArray(formValues.experiences)
      ? formValues.experiences
      : [];
    if (experiencesArr.length > 0) {
      completion += Number(
        applicant_form_percent_config?.professional_info_perc
      );
    }
    // skills Info
    const skillsArr = Array.isArray(formValues.skills) ? formValues.skills : [];
    if (skillsArr.length > 0) {
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
        data.profile_image = getUploadUrl(e?.data?.filename);
      });
    }

    const payload = {
      ...data,
      jobId: jobId !== "none" ? jobId : null,
      dateOfBirth: data.dateOfBirth
        ? formatDates(data.dateOfBirth, "dd-MMM-yyyy")
        : null,
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
      setValue("cityId", null);
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
            (s: any) => s.skill === e?.formName && s.isReq
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

  const handleAddAcademic = () => {
    appendAcademic({
      institutionId: null,
      degreeId: null,
      gpa: 0,
      startDate: "",
      endDate: "",
      cityId: null,
      countryId: null,
    });
    setTimeout(() => {
      const newIndex = academicFields.length;
      setValue(`academics.${newIndex}.institutionId`, null);
      setValue(`academics.${newIndex}.degreeId`, null);
      setValue(`academics.${newIndex}.gpa`, 0);
      setValue(`academics.${newIndex}.startDate`, "");
      setValue(`academics.${newIndex}.endDate`, "");
      setValue(`academics.${newIndex}.cityId`, null);
      setValue(`academics.${newIndex}.countryId`, null);
    }, 0);
  };

  // Add for Professional (experiences)
  const handleAddExperience = () => {
    appendExperience({
      companyName: "",
      positionHeld: "",
      startDate: "",
      endDate: "",
      cityId: null,
      countryId: null,
    });
    setTimeout(() => {
      const newIndex = experienceFields.length;
      setValue(`experiences.${newIndex}.companyName`, "");
      setValue(`experiences.${newIndex}.positionHeld`, "");
      setValue(`experiences.${newIndex}.startDate`, "");
      setValue(`experiences.${newIndex}.endDate`, "");
      setValue(`experiences.${newIndex}.cityId`, null);
      setValue(`experiences.${newIndex}.countryId`, null);
    }, 0);
  };

  // Add for Skills
  const handleAddSkill = () => {
    appendSkill({
      isReq: false,
      skill: "",
      description: "",
      startDate: "",
      endDate: "",
      ratingScale: 0,
    });
    setTimeout(() => {
      const newIndex = skillFields.length;
      setValue(`skills.${newIndex}.isReq`, false);
      setValue(`skills.${newIndex}.skill`, "");
      setValue(`skills.${newIndex}.description`, "");
      setValue(`skills.${newIndex}.startDate`, "");
      setValue(`skills.${newIndex}.endDate`, "");
      setValue(`skills.${newIndex}.ratingScale`, 0);
    }, 0);
  };

  if (submitSuccess && error === null) {
    return (
      <div
        style={{ background: secondary_color }}
        className="min-h-screen flex flex-col"
      >
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="mb-4 p-4  text-2xl sm:text-3xl font-bold  text-[#34B9A3] rounded-md">
              {localStorage.getItem("jobId") !== "none"
                ? "Your application has been submitted successfully! We will review and get back for the next step if you are shortlisted."
                : "Profile updated successfully!"}
            </div>
            <Link
              to="/tickets"
              className="w-full bg-[#222222] hover:bg-transparent text-sm hover:text-[#222222] border-2 border-[#222222] text-white py-2 px-4 rounded-full font-medium hover:bg-black transition-colors"
            >
              Explore Jobs
              <ArrowRight className="w-4 h-4 inline-block ml-1" />
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                      {/* Basic Information */}
                      <div className="py-4">
                        <h2 className="mb-2 text-xl font-semibold text-[#222222]">
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
                        <h2 className="mb-2 text-xl font-semibold text-[#222222]">
                          Personal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <Controller
                            control={control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <InputDate
                                id="dateOfBirth"
                                max={new Date(
                                  new Date().setFullYear(
                                    new Date().getFullYear() - 15
                                  )
                                ).toDateString()}
                                placeholder="Date of Birth"
                                value={field.value || null}
                                onChange={field.onChange}
                                error={errors?.dateOfBirth?.message}
                                popperClassName="z-[9999]"
                                portalId="root-portal"
                              />
                            )}
                          />
                          <Controller
                            name="nic_no"
                            control={control}
                            render={({ field, fieldState }) => (
                              <MaskedInputField
                                id="nic_no"
                                placeholder="ID Card No"
                                mask={
                                  localizationId == 1
                                    ? [
                                        /\d/,
                                        /\d/,
                                        /\d/,
                                        /\d/,
                                        /\d/,
                                        "-",
                                        /\d/,
                                        /\d/,
                                        /\d/,
                                        /\d/,
                                        /\d/,
                                        /\d/,
                                        /\d/,
                                        "-",
                                        /\d/,
                                      ]
                                    : false // 👈 disables masking, allows free typing
                                }
                                value={field.value || ""}
                                onChange={field.onChange}
                                error={fieldState.error?.message}
                              />
                            )}
                          />
                          <InputArea
                            id="passportNo"
                            placeholder="Passport No"
                            type="text"
                            max={15}
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
                        <h2 className="mb-2 text-xl font-semibold text-[#222222]">
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
                              id="phone_official"
                              placeholder="Phone (Offical)"
                              type="tel"
                              max={15}
                              error={errors.phone_official?.message}
                              registration={{
                                ...register("phone_official"),
                              }}
                            />
                          </div>
                          <div>
                            <InputArea
                              id="phone_cell"
                              placeholder="Cell No"
                              type="tel"
                              max={15}
                              error={errors.phone_cell?.message}
                              registration={{
                                ...register("phone_cell"),
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
                        <h2 className="mb-2 text-xl font-semibold text-[#222222]">
                          General Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                          <div>
                            <Controller
                              control={control}
                              name="applicantCanJoin"
                              render={({ field }) => (
                                <InputArea
                                  id="applicantCanJoin"
                                  amountFormat={true}
                                  max={3}
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder="Tentative  Days of Joining"
                                  type="number"
                                  error={errors.applicantCanJoin?.message}
                                />
                              )}
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
                                  max={10}
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
                                  max={10}
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
                                  max={10}
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
                          <h2 className="mb-2 text-xl font-semibold text-[#222222]">
                            Academic Detail
                            <span className="text-xs font-normal ml-2 text-red-600">
                              {errors.academics?.message || ""}
                            </span>
                          </h2>
                          <button
                            type="button"
                            onClick={handleAddAcademic}
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
                                    <th className="px-2 py-2 min-w-40 text-left text-xs font-semibold">
                                      Institution
                                    </th>
                                    <th className="px-2 py-2 min-w-36 text-left text-xs font-semibold">
                                      Qualification
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold">
                                      CGPA
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold">
                                      Start Date
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs font-semibold">
                                      End Date
                                    </th>
                                    <th className="px-2 py-2 text-left text-xs min-w-28 font-semibold">
                                      Country
                                    </th>
                                    <th className="px-2 py-2 text-left min-w-28 text-xs font-semibold">
                                      City
                                    </th>
                                    <th className="px-2 py-2 min-w-12 text-left text-xs font-semibold"></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {academicFields.map((field, index) => {
                                    const academicList = watch("academics");
                                    return (
                                      <tr
                                        key={field.id}
                                        className="border-b text-[#222222] text-center"
                                      >
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
                                              error={getFieldError(
                                                errors.academics,
                                                index,
                                                "institutionId"
                                              )}
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
                                                  ? jobStates.qualificationList.map(
                                                      (e) => {
                                                        let find =
                                                          academicList?.find(
                                                            (el) =>
                                                              el?.degreeId ===
                                                              e.value
                                                          );
                                                        if (find) {
                                                          return {
                                                            ...e,
                                                            disable: true,
                                                          };
                                                        }
                                                        return e;
                                                      }
                                                    )
                                                  : []
                                              }
                                              error={getFieldError(
                                                errors.academics,
                                                index,
                                                "degreeId"
                                              )}
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
                                            error={getFieldError(
                                              errors.academics,
                                              index,
                                              "gpa"
                                            )}
                                            registration={{
                                              ...register(
                                                `academics.${index}.gpa`
                                              ),
                                            }}
                                          />
                                        </td>
                                        <td className="p-1">
                                          <Controller
                                            control={control}
                                            name={`academics.${index}.startDate`}
                                            render={({ field }) => {
                                              const endDateValue = watch(
                                                `academics.${index}.endDate`
                                              );
                                              return (
                                                <InputDate
                                                  id="startDate"
                                                  placeholder="Start Date"
                                                  max={
                                                    endDateValue
                                                      ? endDateValue
                                                      : new Date()
                                                  }
                                                  value={
                                                    field.value || undefined
                                                  }
                                                  onChange={field.onChange}
                                                  error={getFieldError(
                                                    errors.academics,
                                                    index,
                                                    "startDate"
                                                  )}
                                                  popperClassName="z-[9999]"
                                                  portalId="root-portal"
                                                />
                                              );
                                            }}
                                          />
                                        </td>
                                        <td className="p-1">
                                          <Controller
                                            control={control}
                                            name={`academics.${index}.endDate`}
                                            render={({ field }) => {
                                              const startDateValue = watch(
                                                `academics.${index}.startDate`
                                              );
                                              return (
                                                <InputDate
                                                  id="endDate"
                                                  placeholder="End Date"
                                                  disable={!startDateValue}
                                                  value={
                                                    field.value || undefined
                                                  }
                                                  min={
                                                    startDateValue || undefined
                                                  }
                                                  onChange={field.onChange}
                                                  error={getFieldError(
                                                    errors.academics,
                                                    index,
                                                    "endDate"
                                                  )}
                                                  popperClassName="z-[9999]"
                                                  portalId="root-portal"
                                                />
                                              );
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
                                            error={getFieldError(
                                              errors.academics,
                                              index,
                                              "countryId"
                                            )}
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
                                            error={getFieldError(
                                              errors.academics,
                                              index,
                                              "cityId"
                                            )}
                                            registration={{
                                              ...register(
                                                `academics.${index}.cityId`
                                              ),
                                            }}
                                          />
                                        </td>
                                        <td>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              removeAcademic(index)
                                            }
                                            className="text-red-500 hover:text-red-600"
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Experience Section */}
                      <div className="py-4">
                        <div className="flex justify-between items-center mb-2">
                          <h2 className="mb-2 text-xl font-semibold text-[#222222]">
                            Professional Experience
                            <span className="text-xs font-normal ml-2 text-red-600">
                              {errors.experiences?.message || ""}
                            </span>
                          </h2>
                          <button
                            type="button"
                            onClick={handleAddExperience}
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
                                  <th className="px-2 py-2 text-left text-xs font-semibold">
                                    Employer
                                  </th>
                                  <th className="px-2 py-2 text-left text-xs font-semibold">
                                    Designation
                                  </th>
                                  <th className="px-2 py-2 text-left text-xs font-semibold">
                                    Start Date
                                  </th>
                                  <th className="px-2 py-2 text-left text-xs font-semibold">
                                    End Date
                                  </th>
                                  <th className="px-2 py-2 text-left min-w-28 text-xs font-semibold">
                                    Country
                                  </th>
                                  <th className="px-2 py-2 text-left min-w-28 text-xs font-semibold">
                                    City
                                  </th>
                                  <th className="px-2 py-2 min-w-12 text-left text-xs font-semibold"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {experienceFields.map((field, index) => (
                                  <tr
                                    key={field.id}
                                    className="border-b text-[#222222] text-center"
                                  >
                                    <td className="p-1">
                                      <InputArea
                                        id="companyName"
                                        placeholder="Employer"
                                        type="text"
                                        error={getFieldError(
                                          errors.experiences,
                                          index,
                                          "companyName"
                                        )}
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
                                        error={getFieldError(
                                          errors.experiences,
                                          index,
                                          "positionHeld"
                                        )}
                                        registration={{
                                          ...register(
                                            `experiences.${index}.positionHeld`
                                          ),
                                        }}
                                      />
                                    </td>
                                    <td className="p-1">
                                      <Controller
                                        control={control}
                                        name={`experiences.${index}.startDate`}
                                        render={({ field }) => {
                                          return (
                                            <InputDate
                                              id="startDate"
                                              placeholder="Start Date"
                                              max={new Date().toDateString()}
                                              value={field.value || undefined}
                                              onChange={field.onChange}
                                              error={getFieldError(
                                                errors.experiences,
                                                index,
                                                "startDate"
                                              )}
                                              popperClassName="z-[9999]"
                                              portalId="root-portal"
                                            />
                                          );
                                        }}
                                      />
                                    </td>
                                    <td className="p-1">
                                      <Controller
                                        control={control}
                                        name={`experiences.${index}.endDate`}
                                        render={({ field }) => {
                                          const startDateValue = watch(
                                            `experiences.${index}.startDate`
                                          );
                                          return (
                                            <InputDate
                                              id="endDate"
                                              placeholder="End Date"
                                              value={field.value || undefined}
                                              disable={!startDateValue}
                                              min={startDateValue || undefined}
                                              onChange={field.onChange}
                                              error={getFieldError(
                                                errors.experiences,
                                                index,
                                                "endDate"
                                              )}
                                              popperClassName="z-[9999]"
                                              portalId="root-portal"
                                            />
                                          );
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
                                        error={getFieldError(
                                          errors.experiences,
                                          index,
                                          "countryId"
                                        )}
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
                                        error={getFieldError(
                                          errors.experiences,
                                          index,
                                          "cityId"
                                        )}
                                        registration={{
                                          ...register(
                                            `experiences.${index}.cityId`
                                          ),
                                        }}
                                      />
                                    </td>
                                    <td>
                                      <button
                                        type="button"
                                        onClick={() => removeExperience(index)}
                                        className="text-red-500 hover:text-red-600"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Skills Section */}
                      <div className="py-4">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-xl font-semibold text-[#222222]">
                            Skills & Certifications
                            <span className="text-xs font-normal ml-2 text-red-600">
                              {errors.skills?.message || ""}
                            </span>
                          </h2>
                          <button
                            type="button"
                            onClick={handleAddSkill}
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
                                  <th className="px-2 py-2 text-left text-xs font-semibold">
                                    Name
                                  </th>
                                  <th className="px-2 py-2 text-left text-xs font-semibold">
                                    Details
                                  </th>
                                  <th className="px-2 py-2 text-left text-xs font-semibold">
                                    Start Date
                                  </th>
                                  <th className="px-2 py-2 text-left text-xs font-semibold">
                                    End Date
                                  </th>
                                  <th className="px-2 py-2 text-left text-xs font-semibold">
                                    Rating
                                  </th>
                                  <th className="px-2 py-2 min-w-12 text-left text-xs font-semibold"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {skillFields.map((field, index) => (
                                  <tr
                                    key={field.id}
                                    className="border-b text-[#222222] text-center"
                                  >
                                    <td className="p-1">
                                      <InputArea
                                        id="skill"
                                        disable={field?.isReq}
                                        placeholder="Name"
                                        type="text"
                                        error={getFieldError(
                                          errors.skills,
                                          index,
                                          "skill"
                                        )}
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
                                        error={getFieldError(
                                          errors.skills,
                                          index,
                                          "description"
                                        )}
                                        registration={{
                                          ...register(
                                            `skills.${index}.description`
                                          ),
                                        }}
                                      />
                                    </td>
                                    <td className="p-1">
                                      <Controller
                                        control={control}
                                        name={`skills.${index}.startDate`}
                                        render={({ field }) => (
                                          <InputDate
                                            id="startDate"
                                            placeholder="Start Date"
                                            max={new Date().toDateString()}
                                            value={field.value || undefined}
                                            onChange={field.onChange}
                                            error={getFieldError(
                                              errors.skills,
                                              index,
                                              "startDate"
                                            )}
                                            popperClassName="z-[9999]"
                                            portalId="root-portal"
                                          />
                                        )}
                                      />
                                    </td>
                                    <td className="p-1">
                                      <Controller
                                        control={control}
                                        name={`skills.${index}.endDate`}
                                        render={({ field }) => {
                                          const startDateValue = watch(
                                            `skills.${index}.startDate`
                                          );
                                          return (
                                            <InputDate
                                              id="endDate"
                                              placeholder="End Date"
                                              disable={!startDateValue}
                                              min={startDateValue || undefined}
                                              value={field.value || undefined}
                                              onChange={field.onChange}
                                              error={getFieldError(
                                                errors.skills,
                                                index,
                                                "endDate"
                                              )}
                                              popperClassName="z-[9999]"
                                              portalId="root-portal"
                                            />
                                          );
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
                                        error={getFieldError(
                                          errors.skills,
                                          index,
                                          "ratingScale"
                                        )}
                                      />
                                    </td>
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
                                        <Trash2 className="w-4 h-4" />
                                      </button>
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
                        <label className="flex items-center gap-2 my-8">
                          <input
                            type="checkbox"
                            {...register("isNotifiedForJobPosting")}
                            defaultChecked={false}
                          />
                          <span className="text-xs text-[#222222]">
                            Receive new job posting notification
                          </span>
                        </label>
                        <div className="flex flex-col gap-10 ">
                          <div className="">
                            <h2 className="mb-2 text-xl font-semibold text-[#222222]">
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
                              className="text-xs bg-[#222222] hover:bg-transparent hover:text-[#222222] border border-[#222222] text-white px-3 rounded-full cursor-pointer inline-flex items-center py-1 "
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
                            className="px-4 w-fit disabled:opacity-50 h-fit hover:bg-transparent text-sm hover:text-[#222222] border-2 border-[#222222] bg-[#222222] text-white py-2 rounded-full font-medium hover:bg-black transition-colors"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : "Update Profile"}
                          </button>
                        </div>
                        {error && (
                          <div className="text-red-700 text-sm rounded-md">
                            {error}
                          </div>
                        )}
                      </div>
                    </form>
                  </FormProvider>
                </div>

                {/* Progress Sidebar */}
                <div className="justify-self-center order-1 lg:order-2 lg:justify-self-end lg:col-span-1">
                  <div className="sticky top-8 flex flex-row gap-2 lg:gap-4 lg:flex-col">
                    <div className="bg-white rounded-xl w-fit  px-8 py-6 ">
                      {/* <p className="text-black text-sm text-center mb-4">
                        Profile Picture
                      </p> */}
                      <div className="text-center">
                        <div className="w-20 h-20 sm:w-32 mx-auto sm:h-32 rounded-full mb-2 flex items-center justify-center overflow-hidden">
                          {photo ? (
                            <img
                              src={photo}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <CircleUserRound className="w-20 h-20 sm:w-32 sm:h-32 stroke-[0.7]" />
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
                          className="text-xs bg-[#222222] text-white px-3 py-1 rounded-full cursor-pointer"
                        >
                          {/* <PlusCircle className="inline-block  mr-1" /> */}
                          {photo ? "Update Photo" : "Add Photo"}
                        </label>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl w-fit  px-8 py-6 ">
                      <p className="text-black text-sm font-semibold text-center mb-4">
                        Profile
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
                          className={`text-xs text-white rounded-full px-3 py-1 ${
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
