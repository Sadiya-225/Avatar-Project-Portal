import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { useParams } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";
import {
  Briefcase,
  MapPinIcon,
  Users,
  Copy as CopyIcon,
  Check as CheckIcon,
  Star,
  Award,
  Clock,
} from "lucide-react";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob } from "@/api/apiJobs";

const CollaboratePage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const clerk = useClerk();
  const [recruiterName, setRecruiterName] = useState("");
  const [copied, setCopied] = useState(false);

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) fnJob();
  }, [isLoaded]);

  useEffect(() => {
    const fetchRecruiterName = async () => {
      if (job?.recruiter_id) {
        try {
          const recruiter = await clerk.users.getUser(job.recruiter_id);
          setRecruiterName(`${recruiter.firstName} ${recruiter.lastName}`);
        } catch (error) {
          console.error("Error fetching recruiter details:", error);
        }
      }
    };

    fetchRecruiterName();
  }, [job?.recruiter_id, clerk]);

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  const isRecruiter = job?.recruiter_id === user?.id;
  const isHiredCandidate = job?.applications?.find(
    (ap) => ap.candidate_id === user?.id && ap.status === "hired"
  );

  if (!isRecruiter && !isHiredCandidate) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">
          You don't have access to this collaboration space.
        </p>
      </div>
    );
  }

  // Get hired candidates
  const hiredMembers = job?.applications?.filter((ap) => ap.status === "hired");

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-bold pb-3 text-4xl sm:text-6xl">
          {job?.title} - Collaboration Space
        </h1>
        <img
          src={job?.company?.logo_url}
          className="h-20 w-20 rounded-full object-cover bg-white"
          alt={job?.title}
        />
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <MapPinIcon /> {job?.location}
        </div>
        <div className="flex gap-2">
          <Users /> {hiredMembers.length} Team Members
        </div>
        <div className="flex gap-2">
          <Briefcase /> Recruiter: {job?.recruiter_name}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Project Overview</h2>
        <p className="sm:text-lg">{job?.description}</p>

        <h2 className="text-2xl sm:text-3xl font-bold">Requirements</h2>
        <MDEditor.Markdown
          source={job?.requirements}
          className="bg-transparent text-white sm:text-lg"
        />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Team Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hiredMembers.length === 0 ? (
            <div className="text-gray-400">None</div>
          ) : (
            hiredMembers.map((application) => (
              <div
                key={application.id}
                className="flex flex-col gap-4 p-6 bg-gradient-to-r from-black to-black rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xl text-primary">
                    {application.name}
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <Star className="w-5 h-5" />
                    <span className="text-sm">Hired</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Award className="w-5 h-5" />
                    <span className="text-base">
                      Skills: {application.skills}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-5 h-5" />
                    <span className="text-base">
                      Experience: {application.experience} Years
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold">Chat Space</h2>
        <div className="p-4 bg-gradient-to-r from-black to-black rounded-lg flex items-center w-fit ">
          <span className="font-mono text-lg text-white truncate block">
            {job?.chatspace || "N/A"}
          </span>
          <button
            onClick={() => {
              if (job?.chatspace) {
                navigator.clipboard.writeText(job.chatspace);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }
            }}
            className="ml-4 p-2 rounded-full bg-primary hover:bg-primary/80 text-white transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <CopyIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        <a
          href="https://react-firebase-chat-three-gamma.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4"
        >
          <button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 text-lg flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75v-1.5A2.25 2.25 0 0015 3h-6a2.25 2.25 0 00-2.25 2.25v1.5m10.5 0h1.5A2.25 2.25 0 0121 9v6a2.25 2.25 0 01-2.25 2.25h-1.5m-10.5 0h-1.5A2.25 2.25 0 013 15V9a2.25 2.25 0 012.25-2.25h1.5m10.5 0v10.5A2.25 2.25 0 0115 21h-6a2.25 2.25 0 01-2.25-2.25V6.75"
              />
            </svg>
            Go to Chat Platform
          </button>
        </a>
      </div>
    </div>
  );
};

export default CollaboratePage;
