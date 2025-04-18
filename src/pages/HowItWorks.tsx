
import React from 'react';
import {
  CheckCircle,
  Clock,
  Brain,
  Bell,
  ShieldCheck,
  CheckSquare,
  FileText
} from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: CheckCircle,
      title: "Acknowledgment & Complaint ID",
      description: "Upon successful upload, receive immediate confirmation and a unique Complaint ID via email/SMS.",
    },
    {
      icon: Brain,
      title: "Automated AI/ML Analysis",
      description: "Our system analyzes your submission within 5 minutes, tracking vehicles and computing metrics.",
    },
    {
      icon: Bell,
      title: "Initial Outcome & Notification",
      description: "Receive notifications about the analysis results, whether it's 'No Issue' or 'Rash Driving Detected'.",
    },
    {
      icon: ShieldCheck,
      title: "Police Review & Action",
      description: "Local enforcement reviews evidence and takes appropriate action - issuing fines or requesting more information.",
    },
    {
      icon: CheckSquare,
      title: "Case Closure",
      description: "Once resolved, receive a final summary email with the outcome details.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#1a365d]">
            How Rash Driving Detector Works
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Understanding the complaint lifecycle and what happens after you submit a report
          </p>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-md flex items-start space-x-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex-shrink-0">
                <step.icon className="h-8 w-8 text-[#0ea5e9]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1a365d] mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-6 w-6 text-[#0ea5e9]" />
            <h3 className="text-lg font-semibold text-[#1a365d]">
              Real-time Updates
            </h3>
          </div>
          <p className="text-gray-600">
            Track your complaint status in real-time through your dashboard. Get notified at every stage - from initial submission to final resolution.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
