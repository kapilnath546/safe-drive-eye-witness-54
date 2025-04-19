import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, MapPin, Upload } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  vehicleNumber: z.string()
    .regex(/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/, "Invalid vehicle number format (e.g., KA01AB1234)"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  datetime: z.date(),
  media: z.any().optional(),
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
      datetime: new Date(),
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

        const { error: uploadError, data } = await supabase.storage
          .from('incident-media')
          .upload(filePath, media);

        if (uploadError) throw uploadError;
        mediaUrl = data.path;
      }

      const { error } = await supabase
        .from('incidents')
        .insert({
          vehicle_number: values.vehicleNumber,
          location: values.address,
          incident_date: values.datetime.toISOString(),
          media_url: mediaUrl,
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-[#1a365d] mb-6">
          Report a Rash Driving Incident
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="vehicleNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Registration Number</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="Enter vehicle number (e.g., KA01AB1234)"
                      className="uppercase"
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
                  <FormLabel>Incident Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Textarea 
                        {...field}
                        placeholder="Enter the location of the incident"
                        className="pl-10 min-h-[100px]"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="datetime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Incident Date & Time</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP HH:mm")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Upload Media</FormLabel>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
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
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Click to upload image/video (max 50MB)
                  </span>
                  {media && (
                    <span className="text-sm text-green-600">
                      Selected: {media.name}
                    </span>
                  )}
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#0ea5e9] hover:bg-sky-600">
              Submit Report
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Report;
