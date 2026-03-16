import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import useCustomerConfig from "../hooks/useCustomerConfig";

const HowItWorkPage = () => {
  const { customerConfig } = useCustomerConfig();
  const { themeConfig } = customerConfig;
  const { secondary_color } = themeConfig;
  useEffect(() => {
    window.scrollTo(0, 0)
   }, []);
  return (
    <div style={{ background: secondary_color }}>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          How Recruitment Portal Works
        </h1>
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Search and filter</h2>
          <p className="text-sm">
            Within the portal's robust search functionality, applicants can
            efficiently discover relevant opportunities by filtering jobs based
            on keywords (targeting specific skills, titles, or technologies),
            location (including city, state, country, postal code, radius
            searches, and remote/hybrid/onsite options) enabling a highly
            tailored job search experience.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">
            Create and manage profiles
          </h2>
          <p className="text-sm">
            Applicants can create and maintain comprehensive personal profiles
            within the portal, serving as a central hub for their job search.
            This includes the ability to securely upload their resume/CV (in
            common formats like PDF or DOCX), optionally add a professional
            profile picture (for personal branding), input detailed information
            (such as contact details, work history, education, skills,
            certifications, and salary expectations), and efficiently manage
            their entire application history – enabling them to track the
            real-time status of each submission (e.g., 'Applied,' 'Under
            Review,' 'Interview Scheduled,' 'Not Selected'), view past
            applications, monitor communication history, and automatically
            populate application forms with their saved profile data for faster
            submissions.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Apply for jobs</h2>
          <p className="text-sm">
            Applicants can seamlessly initiate and submit job applications
            directly within the portal, typically using either a streamlined
            'Apply Now' option or a more comprehensive application process
            requiring additional details, questions, or assessments. Crucially,
            once submitted, applicants gain real-time visibility into their
            application progress through a dedicated candidate dashboard. This
            allows them to track the current status (e.g., 'Application
            Received,' 'In Review/Screening,' 'Shortlisted for Interview,'
            'Offer Letter Issue,' 'CV Rejected,' 'Offer Letter Rejected'), and
            view next steps – significantly reducing uncertainty and providing
            transparency throughout the hiring journey.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Receive notifications</h2>
          <p className="text-sm">
            Modern job portals proactively enhance the candidate experience
            through automated, multi-channel notification systems. Applicants
            can opt-in to receive personalized alerts via email, SMS, or in-app
            messages about newly posted jobs matching their saved searches or
            profile criteria, critical updates to their active applications
            (like status changes, interview invitations, or request for
            documents), upcoming interview reminders, application deadline
            warnings, employer messages, recommended job opportunities, and
            industry/company news. Crucially, users maintain granular control
            over notification preferences (frequency, channel, and content
            types), ensuring timely, relevant communication while preventing
            overload and maintaining engagement throughout the job search
            journey.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorkPage;
