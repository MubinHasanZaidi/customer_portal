import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useCompanyConfig from "../hooks/useCompanyConfig";

const DisclaimerPage = () => {
  const { companyConfig } = useCompanyConfig();
  const { themeConfig } = companyConfig;
  const { secondary_color } = themeConfig;
  return (
    <div style={{ background: secondary_color }}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Disclaimer</h1>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">1. Third-Party Content</h2>
          <p className="text-sm">
            Job listings, position descriptions, required qualifications, salary ranges, benefits information, application deadlines, company profiles, and any other employment-related details displayed on this Applicant Portal ("Portal") are provided solely by employers, recruiters, or their authorized agents ("Posting Entities"). Neither [Client Company Name] ("Company"), the operator of this Portal, nor Dynasoft Cloud, the platform provider, creates, controls, or independently verifies this content.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">2. No Guarantees of Accuracy or Completeness</h2>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>The accuracy, truthfulness, completeness, timeliness, or reliability of any job posting or employer information.</li>
            <li>That a listed position is genuinely available, has not been filled, or that the description reflects the actual role or current requirements.</li>
            <li>That salary, benefits, location (including remote work status), or other details provided by the Posting Entity are correct or current.</li>
            <li>That qualifications listed are exhaustive or the sole criteria for hiring.</li>
          </ul>
          <p className="text-sm">
            While the Company endeavors to provide a platform for legitimate opportunities, it does not guarantee, warrant, or represent the above.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">3. Applicant Verification Responsibility</h2>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>It is your sole responsibility to independently verify any critical information about a job opportunity or employer directly with the Posting Entity before applying or making decisions based on information found on this Portal.</li>
            <li>You should not rely solely on the information presented within the Portal as the definitive description of the role, its requirements, compensation, or the employer's practices.</li>
            <li>Job postings may expire, be withdrawn, filled, or modified by the Posting Entity without notice on the Portal.</li>
          </ul>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">4. Automated Feeds & Third-Party Sources</h2>
          <p className="text-sm">
            Some job listings may be aggregated or sourced automatically from third-party platforms or feeds. The Company and Dynasoft Cloud disclaim all responsibility for the accuracy, presentation, or availability of such aggregated content and for any errors or omissions introduced during aggregation or display.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">5. No Guarantee of Application Receipt</h2>
          <p className="text-sm">
            Submission of an application through this Portal does not guarantee that it has been received, reviewed, or will be considered by the intended Posting Entity. Technical issues, employer system configurations, or other factors beyond the Company's or Dynasoft Cloud's control may prevent delivery.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">6. Assumption of Risk</h2>
          <p className="text-sm">
            You understand and accept that any reliance you place on information obtained through this Portal is strictly at your own risk. Neither the Company nor Dynasoft Cloud shall be held liable for any loss, damage, or disappointment arising from inaccuracies, omissions, unavailability of positions, or actions taken based on information within the Portal.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">7. Application Process</h2>
          <p className="text-sm">
            Submitting an application through this Portal does not guarantee employment, interview consideration, or any response from the employer.
            <br />
            The Company and Dynasoft Cloud Pvt. Ltd. are not responsible for the application review process, hiring decisions, communication delays, or any disputes arising between applicants and employers.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">8. User Responsibility</h2>
          <p className="text-sm">
            Users are solely responsible for the content they submit (e.g., resumes, profiles, applications). Ensure all information is accurate, lawful, and does not violate third-party rights.
            <br />
            Users must protect their login credentials and report suspected unauthorized activity immediately.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">9. System Availability & Security</h2>
          <p className="text-sm">
            Dynasoft Cloud Pvt. Ltd. and the Company endeavor to maintain Portal accessibility but do not guarantee uninterrupted or error-free operation. Service may be suspended temporarily for maintenance.
            <br />
            While reasonable security measures are implemented, absolute security cannot be guaranteed against unauthorized access or data breaches. Use of the Portal is at the user's own risk.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">10. Limitation of Liability</h2>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li>Use of or inability to use the Portal.</li>
            <li>Reliance on any Portal content or job information.</li>
            <li>Unauthorized access to or alteration of user data.</li>
            <li>Actions or omissions of employers, applicants, or third parties.</li>
          </ul>
          <p className="text-sm">
            To the fullest extent permitted by law, neither [Client Company Name], Dynasoft Cloud, nor their affiliates, directors, employees, or agents shall be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the above.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">11. Intellectual Property</h2>
          <p className="text-sm">
            All trademarks, logos, Portal design, software, and proprietary content are owned by or licensed to the Company and/or Dynasoft Cloud Pvt. Ltd. Users are granted a limited, revocable license to access the Portal for its intended purpose only.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">12. Privacy</h2>
          <p className="text-sm">
            User data is governed by our separate [Link to Privacy Policy]. By using this Portal, you consent to the collection and use of your information as described therein.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">13. Changes to Terms</h2>
          <p className="text-sm">
            The Company reserves the right to modify this Disclaimer and other Portal terms at any time. Continued use after changes constitutes acceptance.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default DisclaimerPage; 