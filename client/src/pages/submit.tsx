import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form, 
  FormControl, 
  FormDescription,
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { FormFileInput } from "@/components/ui/file-input";
import { Card, CardContent } from "@/components/ui/card";
import { productSubmissionSchema, ProductSubmission, availableTags } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Github, ExternalLink } from "lucide-react";

const Submit = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [imageBase64, setImageBase64] = useState<string>("");
  
  const form = useForm<ProductSubmission>({
    resolver: zodResolver(productSubmissionSchema),
    defaultValues: {
      name: "",
      description: "",
      githubLink: "",
      demoLink: "",
      image: "",
      tags: [],
      submittedBy: "Anonymous", // Default value
      termsAccepted: false,
    },
  });
  
  const submitMutation = useMutation({
    mutationFn: async (data: ProductSubmission) => {
      const response = await apiRequest("POST", "/api/products", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Submission successful",
        description: "Your project has been submitted for review. Thank you!",
      });
      navigate("/");
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: ProductSubmission) => {
    // Add the base64 image to the form data
    const submissionData = {
      ...data,
      image: imageBase64,
    };
    submitMutation.mutate(submissionData);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Submit Your Project</h1>
          <p className="text-gray-600">Share your innovative web application with the community</p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
            <Card>
              <CardContent className="p-6 space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="My Amazing Project" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your project, its features and what problem it solves..." 
                          rows={4} 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Brief description for your project. Maximum 500 characters.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Image *</FormLabel>
                      <FormControl>
                        <FormFileInput
                          name="image"
                          onValueChange={(base64) => {
                            setImageBase64(base64);
                            field.onChange(base64);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="githubLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub Repository Link *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                              placeholder="https://github.com/username/repo" 
                              {...field} 
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="demoLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demo App Link *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input 
                              placeholder="https://myapp.vercel.app" 
                              {...field} 
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="submittedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your name (optional)" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={() => (
                    <FormItem>
                      <FormLabel>Tags *</FormLabel>
                      <FormDescription>
                        Select categories that best describe your project
                      </FormDescription>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                        {availableTags.map((tag) => (
                          <FormField
                            key={tag}
                            control={form.control}
                            name="tags"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={tag}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(tag)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, tag])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== tag
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="termsAccepted"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-4 border-t border-gray-200">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the terms and conditions
                        </FormLabel>
                        <FormDescription>
                          By submitting, you confirm that you have the rights to share this project and agree to our{" "}
                          <a href="#" className="text-primary hover:text-primary-dark">
                            Terms of Service
                          </a>.
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="mr-3"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending ? "Submitting..." : "Submit for Review"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Submit;
