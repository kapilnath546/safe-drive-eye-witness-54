
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Camera, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#1a365d] text-white py-6 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-sky-400" />
            <h1 className="text-2xl font-bold">Rash Driving Detector</h1>
          </div>
          <nav className="space-x-4">
            <Link to="/login" className="text-white hover:text-sky-300 transition-colors">
              Login
            </Link>
            <Link to="/register" className="text-white hover:text-sky-300 transition-colors">
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold text-[#1a365d]">
            Help Make Our Roads Safer
          </h2>
          <p className="text-xl text-gray-700">
            Report rash driving incidents easily and contribute to community safety. 
            Upload evidence, and let our AI help identify dangerous driving behaviors.
          </p>
          <div className="flex space-x-4">
            <Link to="/report">
              <Button className="bg-[#0ea5e9] hover:bg-sky-600 transition-colors">
                <Camera className="mr-2 h-5 w-5" /> Report Incident
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" className="border-[#1a365d] text-[#1a365d] hover:bg-gray-100">
                <FileText className="mr-2 h-5 w-5" /> How It Works
              </Button>
            </Link>
          </div>
        </div>
        <div className="hidden md:block">
          <img 
            src="/placeholder.svg" 
            alt="Road safety illustration" 
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </main>

      <footer className="bg-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          © {new Date().getFullYear()} Rash Driving Detector. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
