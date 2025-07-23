import { Link } from "react-router-dom";
import dy_logo from "../assets/dy_logo.svg";
import np_logo from "../assets/NP.svg";
import useCompanyConfig from "../hooks/useCompanyConfig";
import logos from "../assets/Logos.svg";
import {
  EditIcon,
  UserPlus,
  LogIn,
  Briefcase,
  Upload,
  CheckCircle,
  ArrowUpRightFromSquare,
  ArrowRight,
  Phone,
  MailCheck,
  Mail,
} from "lucide-react";

const Footer = () => {
  const { companyConfig } = useCompanyConfig();
  const { themeConfig, subsidiary, company } = companyConfig;
  const { primary_color, secondary_color } = themeConfig;

  return (
    <footer className="bg-[#111111]">
      <div className="grid grid-cols-1 md:grid-cols-5 2xl:max-w-[85vw] gap-4 mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-6 ">
        <div className="col-span-2 space-y-2">
          <h5 className={`text-lg text-white hover:underline font-normal `}>
            <Link to={"/how-it-work"}>
              How it works?{" "}
              <ArrowRight className="w-5 h-5 text-white inline-block -rotate-45 " />
            </Link>
          </h5>
          <ul style={{ fontWeight: 400 }} className="mt-4 space-y-2 text-gray-400">
            <li className="flex items-center gap-3">
              {/* <UserPlus className="w-4 h-4 text-blue-600 flex-shrink-0" /> */}
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm ">
                <span style={{ fontWeight: 600 }}>Register </span> yourself by
                clicking on Login button
              </span>
            </li>
            <li className="flex items-center gap-3">
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm ">
                Once registered <span style={{ fontWeight: 600 }}>Login</span>{" "}
                with user id
              </span>
            </li>
            <li className="flex items-center gap-3">
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm ">
                Select the <span style={{ fontWeight: 600 }}>Job </span> in
                which you are interested
              </span>
            </li>
            <li className="flex items-center gap-3">
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm ">
                Enter your <span style={{ fontWeight: 600 }}> profile</span> and{" "}
                <span style={{ fontWeight: 600 }}>upload</span> the CV
              </span>
            </li>
            <li className="flex items-center gap-3">
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm ">
                Once <span style={{ fontWeight: 600 }}>submitted</span>, Job
                request is <span style={{ fontWeight: 600 }}>applied</span>.
              </span>
            </li>
          </ul>
        </div>
        <div className="col-span-2 flex-1">
          <h5 className={`text-lg text-white hover:underline font-normal `}>
            <Link to={company?.web || ""} target={company?.web && "_blank"}>
              Contact us{" "}
              <ArrowRight className="w-5 h-5  text-white inline-block -rotate-45 " />
            </Link>
          </h5>
          <div className="mt-2 space-y-3 text-gray-400">
            {subsidiary?.length > 0 &&
              subsidiary.map((e: any) => {
                return (
                  <div>
                    <p
                      style={{ fontWeight: 600 }}
                      className="text-sm  font-normal mb-1"
                    >
                      {e?.name || ""}
                    </p>
                    {e?.phone && e?.email && (
                      <div className="flex flex-wrap items-center gap-1 text-sm">
                        <Link
                          to={`tel:${e?.phone}`}
                          className="hover:underline"
                        >
                          <Phone className="inline-block w-3 h-3 mr-1" />{" "}
                          {e?.phone || ""}
                        </Link>
                        <span className="mx-1">|</span>
                        <Link
                          to={`mailto:${e?.email}`}
                          className="hover:underline"
                        >
                          <Mail className="inline-block w-3 h-3 mr-1" />{" "}
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
          <Link to="https://dynasoftcloud.com" target="_blank">
            <img className="mx-auto h-12  mt-4" src={dy_logo} />
          </Link>
          <Link to="https://dynasoftcloud.com" target="_blank">
            <img className="mx-auto h-20 mt-4" src={np_logo} />
          </Link>
        </div>
      </div>
      <div
        style={{ fontWeight: 400, color: secondary_color }}
        className="bg-[#000000] mt-auto border-t-[0.2px] border-gray-400"
      >
        <div className="2xl:max-w-[85vw] mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-1 text-gray-400 md:mb-0">
              <p className="text-xs ">
                Copyright &copy; {new Date().getFullYear()} Dynasoft Cloud. All
                rights reserved.
              </p>
            </div>
            <div className="flex text-gray-400 space-x-2 sm:space-x-4">
              <Link
                to="https://dynasoftcloud.com/about-us.php"
                target="_blank"
                className="text-xs"
              >
                About Dynasoft Cloud
              </Link>
              <Link to="/privacy-policy" className="text-xs">
                Privacy Policy
              </Link>
              <Link to="/disclaimer" className="text-xs">
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
