import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useCompanyConfig from "../hooks/useCompanyConfig";

const DisclaimerPage = () => {
  const { companyConfig } = useCompanyConfig();
  const { themeConfig } = companyConfig;
  const { secondary_color } = themeConfig;

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);
  return (
    <div style={{ background: secondary_color }}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Disclaimer</h1>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">1. Accuracy of Information</h2>
          <p className="text-sm">
            All information (resumes, job posts, company details) is submitted by users. We are not liable for any false, misleading, or outdated information provided by job seekers or employers.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">2. No Guarantee of Employment</h2>
          <p className="text-sm">
            Submission of personal data or applications does not guarantee employment or an interview. Final hiring decisions are based on internal evaluations and organizational requirements.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">3. External Links</h2>
          <p className="text-sm">
            Our site may link to external websites. We are not responsible for their content, security practices, or privacy policies of those third-party sites.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">4. Limitation of Liability</h2>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>Loss of employment opportunity.</li>
            <li>Misuse of information by third parties.</li>
            <li>Technical outages or data breaches, despite industry-standard protections.</li>
          </ul>
          <p className="text-sm">
            We are not liable for the above circumstances.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">5. Policy Updates</h2>
          <p className="text-sm">
            We reserve the right to update this Privacy Policy & Disclaimer at any time. Changes will be notified via the portal or official communication.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default DisclaimerPage; 