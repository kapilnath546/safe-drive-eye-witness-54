
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, AlertTriangle } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  vehicleNumber: z.string()
    .regex(/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/, "Invalid vehicle number format (e.g., TN22BB0001)"),
  address: z.string().min(10, "Location details must be at least 10 characters"),
  additionalInfo: z.string().optional(),
});

const Report = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [media, setMedia] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleNumber: "",
      address: "",
      additionalInfo: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "File size should be less than 50MB",
        });
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'video/mp4', 'video/webm'];
      if (!validTypes.includes(file.type)) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid file type. Please upload JPG, PNG, MP4, or WEBM",
        });
        return;
      }
      
      setMedia(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login to report an incident",
      });
      navigate('/login');
      return;
    }

    try {
      let mediaUrl = '';
      
      if (media) {
        const fileExt = media.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const uploadResult = await supabase.storage
          .from('incident-media')
          .upload(filePath, media);

        if (uploadResult.error) {
          throw uploadResult.error;
        }
        
        // Fixed line - now safely accessing data property after error check
        mediaUrl = uploadResult.data?.path || '';
      }

      const { error } = await supabase
        .from('incidents')
        .insert({
          vehicle_number: values.vehicleNumber,
          location: values.address,
          media_url: mediaUrl,
          additional_info: values.additionalInfo,
          status: 'pending',
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Incident reported successfully",
      });
      navigate('/my-complaints');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to report incident",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f4fdf4] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Complaint Quick Form</h1>
        
        {/* Instructions Box */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-8 border border-gray-200">
          <div className="mb-4">
            <div className="bg-gray-100 p-4 rounded-md inline-block mb-4">
              <h3 className="text-xl font-bold mb-2">TN 22 BB 0001</h3>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold text-red-600 flex items-center gap-2">
              📋 How to File a Report:
            </h3>
            <ol className="list-decimal ml-5 space-y-2">
              <li>Enter the vehicle number of the offender (e.g., TN 22 BB 0001)</li>
              <li>Add the locality where the incident happened</li>
              <li>Upload photo/video evidence if available</li>
              <li>(Optional) Add a short message describing the incident</li>
            </ol>
            <div className="mt-4 text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Misuse of the platform may lead to account suspension or legal action.</span>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white rounded-lg p-6 shadow-md">
            <FormField
              control={form.control}
              name="vehicleNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Vehicle Number Plate</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Enter vehicle number (e.g., TN22BB0001)"
                      className="h-12 text-lg uppercase"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Locality</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder="Enter the location of the incident"
                      className="min-h-[80px] text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel className="text-lg font-semibold">Upload Photo/Video</FormLabel>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.mp4,.webm"
                  onChange={handleFileChange}
                  className="hidden"
                  id="media-upload"
                />
                <label
                  htmlFor="media-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <UploadCloud className="h-10 w-10 text-gray-400" />
                  <span className="text-gray-500">(Drop and share)</span>
                  {media && (
                    <span className="text-sm text-green-600">
                      Selected: {media.name}
                    </span>
                  )}
                </label>
              </div>
            </div>

            <FormField
              control={form.control}
              name="additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Additional Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field}
                      placeholder="Add any additional details about the incident"
                      className="min-h-[100px] text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg"
            >
              Submit Complaint
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Report;
