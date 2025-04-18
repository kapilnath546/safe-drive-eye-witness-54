
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileText, CheckCircle, Clock } from "lucide-react";

const MyComplaints = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const myComplaints = [
    {
      id: '1',
      vehicleNumber: 'KA01AB1234',
      date: '2024-04-18',
      status: 'Pending Analysis',
      location: 'Bangalore'
    },
    {
      id: '2',
      vehicleNumber: 'MH02CD5678',
      date: '2024-04-17',
      status: 'Resolved',
      location: 'Mumbai',
      policeAction: 'Fine Issued'
    }
  ];

  const handleViewDetails = (id: string) => {
    // TODO: Implement view details functionality
    toast({
      title: "Info",
      description: `Viewing details for complaint ${id}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a365d]">My Complaints</h1>
          <Button 
            onClick={() => navigate('/report')}
            className="bg-[#0ea5e9] hover:bg-sky-600"
          >
            Report New Incident
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Complaint ID</TableHead>
                <TableHead>Vehicle Number</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Police Action</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>{complaint.id}</TableCell>
                  <TableCell>{complaint.vehicleNumber}</TableCell>
                  <TableCell>{complaint.date}</TableCell>
                  <TableCell>{complaint.location}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                      complaint.status === 'Resolved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {complaint.status === 'Resolved' 
                        ? <CheckCircle className="h-4 w-4" />
                        : <Clock className="h-4 w-4" />
                      }
                      {complaint.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {complaint.policeAction || '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(complaint.id)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default MyComplaints;
