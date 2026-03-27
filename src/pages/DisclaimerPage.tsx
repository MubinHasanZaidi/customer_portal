import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useCustomerConfig from "../hooks/useCustomerConfig";

const DisclaimerPage = () => {
  const { customerConfig } = useCustomerConfig();
  const { customer } = customerConfig;
  const { secondary_color } = customer;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div style={{ background: secondary_color }}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Disclaimer</h1>
        <p className="text-sm my-3">
          This Customer Complaint Portal is provided to facilitate the
          submission and tracking of complaints. While we strive for timely
          resolution, response times are not guaranteed. Users must provide
          accurate and complete information; the organization is not responsible
          for delays caused by incorrect details or technical issues. By using
          this portal, you agree to its terms and acknowledge that services may
          be modified or interrupted without prior notice.
        </p>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            1. Accuracy of Information
          </h2>
          <p className="text-sm">
            All information (Support tickets, queries and complaint, Customer
            support details) is submitted by users. We are not liable for any
            false, misleading, or outdated information provided by job seekers
            or employers.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">3. External Links</h2>
          <p className="text-sm">
            Our site may link to external websites. We are not responsible for
            their content, security practices, or privacy policies of those
            third-party sites.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            4. Limitation of Liability
          </h2>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>Misuse of information by third parties.</li>
            <li>
              Technical outages or data breaches, despite industry-standard
              protections.
            </li>
          </ul>
          <p className="text-sm">
            We are not liable for the above circumstances.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">5. Policy Updates</h2>
          <p className="text-sm">
            We reserve the right to update this Privacy Policy & Disclaimer at
            any time. Changes will be notified via the portal or official
            communication.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default DisclaimerPage;
