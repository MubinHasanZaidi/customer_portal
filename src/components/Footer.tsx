import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col sm:flex-row 2xl:max-w-[85vw] gap-4 mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4">
        <div className="flex-1 space-y-2">
          <h5 className="text-lg sm:text-xl font-semibold text-[#0093DD]">How it works?</h5>
          <p className="text-xs mt-2 text-[#222222]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="flex-1">
          <h5 className="text-lg sm:text-xl font-semibold text-[#0093DD]">Contact us</h5>
          <p className="text-xs mt-2 text-[#222222]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
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
                to="#"
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
