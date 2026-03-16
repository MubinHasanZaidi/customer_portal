import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <h1 className="text-9xl font-bold text-blue-500">404</h1>
        <h2 className="text-3xl font-semibold text-[#000000] mt-4">
          Page Not Found
        </h2>
        <p className="text-[#00000] mt-2 text-center max-w-md">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to={"/customer_portal/1"} className="bg-blue-500 rounded-full mt-2 text-sm text-white p-2 ">Go To Dynasoft career page</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
