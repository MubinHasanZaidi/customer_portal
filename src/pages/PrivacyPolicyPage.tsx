import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useCompanyConfig from "../hooks/useCompanyConfig";

const PrivacyPolicyPage = () => {
  const { companyConfig } = useCompanyConfig();
  const { themeConfig } = companyConfig;
  const { secondary_color } = themeConfig;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div style={{ background: secondary_color }}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Applicant Portal Privacy Policy
        </h1>
        <p className="text-xs text-center mb-2">Last Updated: [Date]</p>
        <p className="text-xs text-center mb-6">
          Portal Name: [Client's Recruitment Portal Name]
        </p>
        <p className="text-xs text-center mb-6">
          Data Controller: [Client Company Name] ("Company," "we," "us")
          <br />
          Platform Provider: Dynasoft Cloud (Data Processor)
        </p>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">1. Scope & Purpose</h2>
          <p className="text-sm">
            This policy explains how we collect, use, disclose, and protect
            personal data submitted by job seekers ("Applicants," "you") through
            this Applicant Portal. Our primary purpose is to facilitate
            recruitment for the Company and authorized employers.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">2. Data We Collect</h2>
          <h3 className="font-semibold text-sm mb-1">a) Provided by You:</h3>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>Identification: Name, address, email, phone number, photo</li>
            <li>
              Professional Details: Resume/CV, cover letter, work history,
              education, skills, certifications, references
            </li>
            <li>
              Application Data: Job preferences, salary expectations, work
              authorization status, answers to screening questions
            </li>
            <li>Account Credentials: Username, password</li>
            <li>
              Voluntary Disclosures: Diversity information (e.g., gender,
              ethnicity, disability status – where legally permitted and
              explicitly consented)
            </li>
          </ul>
          <h3 className="font-semibold text-sm mb-1">
            b) Collected Automatically:
          </h3>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>
              Usage Data: IP address, device type, browser, pages visited,
              timestamps
            </li>
            <li>
              Cookies/Tracking Technologies: Session cookies (essential),
              analytics cookies (optional – requires consent). See our [Cookie
              Policy].
            </li>
          </ul>
          <h3 className="font-semibold text-sm mb-1">c) From Third Parties:</h3>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>References (if provided)</li>
            <li>LinkedIn/other profiles (if you apply via integration)</li>
            <li>Background check providers (only after conditional offer)</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            3. How We Use Your Data
          </h2>
          <table className="w-full text-sm mb-2 border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Purpose</th>
                <th className="border px-2 py-1">Legal Basis (GDPR)</th>
                <th className="border px-2 py-1">CCPA Category</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-2 py-1">
                  Process applications & assess qualifications
                </td>
                <td className="border px-2 py-1">
                  Legitimate Interest / Contractual
                </td>
                <td className="border px-2 py-1">Business Purpose</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">
                  Communicate about application status
                </td>
                <td className="border px-2 py-1">Legitimate Interest</td>
                <td className="border px-2 py-1">Business Purpose</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">
                  Portal functionality & security
                </td>
                <td className="border px-2 py-1">Legitimate Interest</td>
                <td className="border px-2 py-1">Business Purpose</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">
                  Talent pool inclusion (with consent)
                </td>
                <td className="border px-2 py-1">Consent</td>
                <td className="border px-2 py-1">Business Purpose</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">
                  Analytics & portal improvement
                </td>
                <td className="border px-2 py-1">
                  Consent / Legitimate Interest
                </td>
                <td className="border px-2 py-1">Business Purpose</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">
                  Compliance with legal obligations
                </td>
                <td className="border px-2 py-1">Legal Obligation</td>
                <td className="border px-2 py-1">Compliance</td>
              </tr>
              <tr>
                <td className="border px-2 py-1">
                  Background checks (post-offer)
                </td>
                <td className="border px-2 py-1">Consent / Legal Obligation</td>
                <td className="border px-2 py-1">Business Purpose</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            4. Data Sharing & Disclosure
          </h2>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>
              Authorized Hiring Teams: Employees/agents of the Company involved
              in recruitment.
            </li>
            <li>
              Dynasoft Cloud: As our platform provider, acting under strict Data
              Processing Agreement (DPA) with access limited to technical
              support.
            </li>
            <li>
              Service Providers: Background check vendors, cloud storage,
              analytics tools (all bound by DPAs).
            </li>
            <li>
              Legal Requirements: If required by law, court order, or government
              request.
            </li>
            <li>
              Corporate Transactions: In case of merger, acquisition, or asset
              sale.
            </li>
            <li>
              Aggregated/Anonymous Data: For reporting or research (not
              personally identifiable).
            </li>
            <li className="font-semibold">
              We DO NOT sell applicant data or share it for third-party
              marketing.
            </li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            5. International Data Transfers
          </h2>
          <p className="text-sm">
            Data may be transferred globally to [List Countries, e.g., "our US
            headquarters"] or Dynasoft Cloud's servers [Specify Locations].
            Transfers comply with safeguards:
          </p>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>
              EU/UK → US: Data Privacy Framework certification (Dynasoft &
              Client)
            </li>
            <li>
              Other transfers: Standard Contractual Clauses (SCCs) or Binding
              Corporate Rules (BCRs)
            </li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">6. Data Retention</h2>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>
              Active Applications: Retained during recruitment process + [e.g.,
              6 months] post-decision.
            </li>
            <li>Talent Pool: Up to [e.g., 2 years] if consent given.</li>
            <li>
              Rejected Applicants: Deleted after [e.g., 1 year] unless retention
              is legally required.
            </li>
            <li>Automated Data: Deleted after [e.g., 12 months].</li>
            <li>
              Retention periods comply with local labor laws. You may request
              early deletion (see Section 8).
            </li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">7. Data Security</h2>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>Encryption (in transit & at rest)</li>
            <li>Access controls & audit logs</li>
            <li>Regular security assessments</li>
            <li>Secure development practices (Dynasoft Cloud)</li>
            <li>Employee training</li>
            <li>
              No system is 100% secure. Promptly report suspected breaches to:
              [Security Contact Email]
            </li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            8. Your Rights (CCPA/CPRA & GDPR)
          </h2>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>Access: To know what data we hold.</li>
            <li>Correction: Update inaccurate/incomplete data.</li>
            <li>Deletion: Erase your data (subject to legal limits).</li>
            <li>Portability: Receive your data in machine-readable format.</li>
            <li>
              Opt-Out: Of "sales" or "sharing" (CCPA) / Withdraw consent (GDPR).
            </li>
            <li>Object/Restrict Processing: Under GDPR legitimate interest.</li>
            <li>
              Submit Requests To: [Privacy Request Email/Link to Portal Form]
            </li>
            <li>
              Verification: We will confirm your identity before fulfilling
              requests.
            </li>
            <li>Response Time: Within 30-45 days (as required by law).</li>
            <li>
              Non-Discrimination: We won't penalize applicants for exercising
              rights.
            </li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">
            9. Changes to This Policy
          </h2>
          <p className="text-sm">
            Updates will be posted here with a new "Last Updated" date. Material
            changes will be notified via email or portal notice.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">10. Contact Us</h2>
          <p className="text-sm">
            For privacy questions or to exercise rights:
          </p>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>Data Protection Officer (DPO): [Name/Title] at [DPO Email]</li>
            <li>Address: [Client Company Legal Address]</li>
          </ul>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
