import { Link } from "react-router-dom";
import dy_logo from "../assets/dy_logo.png";
import useCompanyConfig from "../hooks/useCompanyConfig";
import {
  EditIcon,
  UserPlus,
  LogIn,
  Briefcase,
  Upload,
  CheckCircle,
} from "lucide-react";

const Footer = () => {
  const { companyConfig } = useCompanyConfig();
  const { themeConfig, subsidiary } = companyConfig;
  const { primary_color } = themeConfig;
  console.log("companyConfigcompanyConfig", subsidiary);
  return (
    <footer className="bg-white">
      <div className="grid grid-cols-1 md:grid-cols-5 2xl:max-w-[85vw] gap-4 mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 ">
        <div className="col-span-2 space-y-2">
          <h5
            style={{ color: primary_color }}
            className={`text-lg sm:text-xl hover:underline font-semibold `}
          >
            <Link
              to={"/how-it-work"}
              // target="_blank"
            >
              How it works?
            </Link>
          </h5>
          <ul className="mt-4 space-y-2">
            <li className="flex items-center gap-3">
              <UserPlus className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs text-[#222222]">
                <span style={{ color: primary_color, fontWeight: 600 }}>
                  Register{" "}
                </span>{" "}
                yourself by clicking on Login button
              </span>
            </li>
            <li className="flex items-center gap-3">
              <LogIn className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-xs text-[#222222]">
                Once registered{" "}
                <span style={{ color: primary_color, fontWeight: 600 }}>
                  Login
                </span>{" "}
                with user id
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-yellow-600 flex-shrink-0" />
              <span className="text-xs text-[#222222]">
                Select the{" "}
                <span style={{ color: primary_color, fontWeight: 600 }}>
                  Job{" "}
                </span>{" "}
                in which you are interested
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Upload className="w-4 h-4 text-purple-600 flex-shrink-0" />
              <span className="text-xs text-[#222222]">
                Enter your{" "}
                <span style={{ color: primary_color, fontWeight: 600 }}>
                  {" "}
                  profile
                </span>{" "}
                and{" "}
                <span style={{ color: primary_color, fontWeight: 600 }}>
                  upload
                </span>{" "}
                the CV
              </span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span className="text-xs text-[#222222]">
                Once{" "}
                <span style={{ color: primary_color, fontWeight: 600 }}>
                  submitted
                </span>
                , Job request is{" "}
                <span style={{ color: primary_color, fontWeight: 600 }}>
                  applied
                </span>
                .
              </span>
            </li>
          </ul>
        </div>
        <div className="col-span-2 flex-1">
          <h5
            style={{ color: primary_color }}
            className={`text-lg sm:text-xl font-semibold hover:underline`}
          >
            <Link
              to={"https://dynasoftcloud.com/contact-us.php"}
              target="_blank"
            >
              Contact us
            </Link>
          </h5>
          <div className="mt-2 space-y-3">
            {subsidiary?.length > 0 &&
              subsidiary.map((e: any) => {
                return (
                  <div>
                    <p className="text-xs text-[#222222] font-bold mb-1">
                      {e?.name || ""}
                    </p>
                    {e?.phone && e?.email && (
                      <div className="flex flex-wrap items-center gap-1 text-xs text-[#222222]">
                        <Link
                          to={`tel:${e?.phone}`}
                          className="hover:underline"
                        >
                          {e?.phone || ""}
                        </Link>
                        <span className="mx-1">|</span>
                        <Link
                          to={`mailto:${e?.email}`}
                          className="hover:underline"
                        >
                          {e?.email || ""}
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="col-span-1">
          <img className="sm:mx-auto mt-4" src={dy_logo} />
        </div>
      </div>
      <hr />
      <div className="bg-white mt-auto">
        <div className="2xl:max-w-[85vw] mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-xs text-[#263238]">
                Copyright &copy; {new Date().getFullYear()} Dynasoft Cloud. All
                rights reserved.
              </p>
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              <Link
                to="https://dynasoftcloud.com/about-us.php"
                target="_blank"
                className="text-xs text-[#263238] hover:text-gray-700"
              >
                About Dynasoft Cloud
              </Link>
              <Link
                to="/privacy-policy"
                className="text-xs text-[#263238] hover:text-gray-700"
              >
                Privacy Policy
              </Link>
              <Link
                to="/disclaimer"
                className="text-xs text-[#263238] hover:text-gray-700"
              >
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
