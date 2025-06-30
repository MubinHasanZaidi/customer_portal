import { Link } from "react-router-dom";
import dy_logo from "../assets/dy_logo.png";
import useCompanyConfig from "../hooks/useCompanyConfig";
import { EditIcon } from "lucide-react";

const Footer = () => {
  const { companyConfig } = useCompanyConfig();
  const { themeConfig } = companyConfig;
  const { primary_color } = themeConfig;
  return (
    <footer>
      <div className="grid grid-cols-1 md:grid-cols-5 2xl:max-w-[85vw] gap-4 mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
        <div className="col-span-2 space-y-2">
          <h5
            style={{ color: primary_color }}
            className={`text-lg sm:text-xl font-semibold `}
          >
            How it works?
            <Link
              to={"https://dynasoftcloud.com/contact-us.php"}
              target="_blank"
            >
              <EditIcon className="w-4 h-4 inline-block ml-2" />
            </Link>
          </h5>
          <p className="text-xs mt-2 text-[#222222]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="col-span-2 flex-1">
          <h5
            style={{ color: primary_color }}
            className={`text-lg sm:text-xl font-semibold`}
          >
            Contact us
            <Link
              to={"https://dynasoftcloud.com/contact-us.php"}
              target="_blank"
            >
              <EditIcon className="w-4 h-4 inline-block ml-2" />
            </Link>
          </h5>
          <div className="grid grid-cols-3 sm:grid-cols-5 sm:gap-x-1 mt-2">
            <p className="text-xs text-[#222222] font-bold">Dubai : </p>
            <Link className="text-xs text-[#222222]" to={"tel:+971 527 566 567"}>+971 527 566 567</Link>
            <Link className="text-xs text-[#222222] col-span-1 sm:col-span-3" to={"mailto:biz@dynasoft.ae"}>biz@dynasoft.ae</Link>
            <p className="text-xs text-[#222222] font-bold">Lahore : </p>
            <Link className="text-xs text-[#222222]" to={"tel:+92 42 3640 0400"}>+92 42 3640 0400</Link>
            <Link className="text-xs text-[#222222] col-span-1 sm:col-span-3" to={"mailto:info@dynasoftcloud.com"}>info@dynasoftcloud.com</Link>
            <p className="text-xs text-[#222222] font-bold">Karachi : </p>
            <Link className="text-xs text-[#222222]" to={"tel:+92 21 3432 1067"}>+92 21 3432 1067</Link>
            <Link className="text-xs text-[#222222] col-span-1 sm:col-span-3" to={"mailto:info@dynasoftcloud.com"}>info@dynasoftcloud.com</Link>
          </div>
        </div>
        <div className="col-span-1">
          <img className="mx-auto mt-4" src={dy_logo} />
        </div>
      </div>
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
                to="#"
                className="text-xs text-[#263238] hover:text-gray-700"
              >
                Privacy Policy
              </Link>
              <Link
                to="#"
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
