
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '../lib/supabase';

const PoliceDashboard = () => {
  const { isPolice } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!isPolice) {
      navigate('/');
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You don't have permission to access this page",
      });
    }
  }, [isPolice, navigate]);

  const updateComplaintStatus = async (complaintId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', complaintId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Complaint status updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update complaint status",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-[#1a365d]">Police Dashboard</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <h2 className="text-xl font-semibold">Pending Review</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Complaint ID</TableHead>
                <TableHead>Vehicle Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* We'll populate this with real data from Supabase */}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PoliceDashboard;
