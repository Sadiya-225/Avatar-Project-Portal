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
  LogOut,
} from "lucide-react";
import { signOut, onAuthStateChanged } from "firebase/auth";

import useFetch from "@/hooks/use-fetch";
import { getSingleJob } from "@/api/apiJobs";
import { TeamChat } from "@/components/team-chat";
import { ChatAuth } from "@/components/chat-auth";
import { auth } from "@/firebase-config";

const CollaboratePage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();
  const clerk = useClerk();
  const [recruiterName, setRecruiterName] = useState("");
  const [copied, setCopied] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isInChat, setIsInChat] = useState(false);

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
      if (job?.recruiter_id && clerk?.users) {
        try {
          const recruiter = await clerk.users.getUser(job.recruiter_id);
          setRecruiterName(`${recruiter.firstName} ${recruiter.lastName}`);
        } catch (error) {
          console.error("Error fetching recruiter details:", error);
        }
      }
    };

    fetchRecruiterName();
  }, [job?.recruiter_id, clerk?.users]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Firebase auth state changed:", user?.email);
      setFirebaseUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!isLoaded || loadingJob) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  const isRecruiter = job?.recruiter_id === user?.id;
  const isHiredCandidate = job?.applications?.find(
    (ap) => ap.candidate_id === user?.id && ap.status === "hired",
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold">Team Chat Space</h2>
          {firebaseUser && (
            <button
              onClick={async () => {
                try {
                  await signOut(auth);
                  setFirebaseUser(null);
                  setIsInChat(false);
                } catch (error) {
                  console.error("Error signing out:", error);
                }
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-primary/20 to-primary/10 hover:from-primary/30 hover:to-primary/20 text-white border border-primary/30 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>

        <div className="p-4 bg-gradient-to-r from-black to-black rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">Chat Room Code:</span>
            <span className="font-mono text-lg text-white truncate block">
              {job?.chatspace || "N/A"}
            </span>
          </div>
          <button
            onClick={() => {
              if (job?.chatspace) {
                navigator.clipboard.writeText(job.chatspace);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }
            }}
            className="p-2 rounded-full bg-primary hover:bg-primary/80 text-white transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <CopyIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {authLoading ? (
          <div className="p-6 bg-gradient-to-r from-black to-black rounded-xl border border-primary/20">
            <p className="text-white/80">Loading chat...</p>
          </div>
        ) : !firebaseUser ? (
          <ChatAuth setIsInChat={setIsInChat} />
        ) : !isInChat ? (
          <div className="p-6 bg-gradient-to-r from-black to-black rounded-xl border border-primary/20">
            <p className="text-white/80 mb-4">
              Enter the chat room to start communicating with your team.
            </p>
            <button
              onClick={() => setIsInChat(true)}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 w-full sm:w-auto"
            >
              Enter Chat Room
            </button>
          </div>
        ) : (
          <div className="h-96 overflow-hidden rounded-xl">
            <TeamChat room={job?.chatspace || "general"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaboratePage;
