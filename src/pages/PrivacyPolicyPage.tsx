import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useCompanyConfig from "../hooks/useCompanyConfig";

const PrivacyPolicyPage = () => {
  const { companyConfig } = useCompanyConfig();
  const { themeConfig , company } = companyConfig;
  const { secondary_color } = themeConfig;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div style={{ background: secondary_color }}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Privacy Policy & Disclaimer
        </h1>
        <p className="text-xs text-center mb-2">Effective Date: 07th July, 2025</p>
        <p className="text-xs text-center mb-6">Last Updated: 07th July, 2025</p>
        <section className="mb-6">
          <p className="text-sm">
            At the HRMS Career portal, your privacy is important to us. We are committed to handling your data responsibly by Pakistan’s data protection laws, including the SECP's guidelines for digital platforms.
          </p>
          <p className="text-sm mt-2">
            This Privacy Policy and Disclaimer document outlines how {company?.name || ""} ("we," "us," or "our") collects, uses, discloses, and protects personal data submitted through our HRMS (Human Resource Management System) Recruitment Portal ("Portal").
          </p>
          <p className="text-sm mt-2">
            By accessing or using this Portal, you consent to the practices described in this policy.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">1. Information We Collect</h2>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>Identity Information: Full name, CNIC, contact number, photograph.</li>
            <li>Professional Details: Resume/CV, academic qualifications, work experience.</li>
            <li>Technical Data: IP address, browser type, location, device information, usage analytics.</li>
            <li>Usage Data: Portal System activity, job searches, messages, and communication logs.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">2. Purpose of Data Collection</h2>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>To process job applications and evaluate candidate profiles.</li>
            <li>To verify candidate eligibility and background checks.</li>
            <li>Internal analytics and improve portal functionality.</li>
            <li>Regulatory reporting as required under SECP.</li>
            <li>To comply with applicable legal and regulatory requirements.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">3. Data Security</h2>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>We employ standard encryption, firewall protection, and secure servers in line with SECP’s cybersecurity framework to protect user data from breaches or unauthorized access.</li>
            <li>We implement appropriate administrative, technical, and physical safeguards to:</li>
            <ul className="list-disc pl-10 text-sm mb-2">
              <li>Protect data from unauthorized access, alteration, disclosure, or destruction.</li>
              <li>Secure transmission via encryption and access control.</li>
              <li>Limit data access to authorized personnel only.</li>
            </ul>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">6. Data Retention</h2>
          <p className="text-sm mb-2">
            We retain personal data only as long as necessary for recruitment purposes or as required under:
          </p>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>Section 14 of SECP’s Electronic Media Guidelines</li>
          </ul>
          <p className="text-sm mb-2">
            If you wish to have your data deleted or modified, please contact {company?.email || ""}.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">7. Your Rights</h2>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>Access, update, or delete your personal data.</li>
            <li>Withdraw consent at any time (subject to service limitations).</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">8. Use of Cookies</h2>
          <p className="text-sm mb-2">
            This portal may use cookies to enhance the user experience. Users may choose to set their web browser to refuse cookies or alert when cookies are being sent.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
