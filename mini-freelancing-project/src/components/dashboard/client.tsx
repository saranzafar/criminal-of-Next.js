"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { projectSchema } from "@/schemas/projectSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Textarea } from "@/components/ui/textarea";

function Client() {
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof projectSchema>>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: "",
            details: "",
            amount: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof projectSchema>) => {
        setIsUploading(true);
        try {
            console.log("DATE: ", data);

            const response = await axios.post("/api/project", data);
            console.log("Project response: ", response.data);

            toast({
                title: "Success",
                description: "Project uploaded successfully!",
                variant: "default",
            });

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error",
                description:
                    axiosError.response?.data.message ??
                    "Failed to upload project",
                variant: "destructive",
            });
        }
        setIsUploading(false);
    };

    return (
        <div className="min-h-screen flex items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto w-full p-10 rounded-lg border border-gray-200">
                <div className="mb-4">
                    <h2 className="text-3xl font-bold text-gray-800">Upload Project</h2>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter project title"
                                            className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="details" // Changed to match backend
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Details</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter project details"
                                            className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Amount</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="string"
                                            placeholder="Enter Your Budget"
                                            className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 rounded-md"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="w-full text-right">
                            <Button
                                type="submit"
                                className="w-[8rem] bg-teal-600 text-white py-2 px-4 rounded-md shadow-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-400 focus:outline-none transition"
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5 inline-block mr-2" />
                                        Upload
                                    </>
                                ) : (
                                    "Upload Project"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export { Client };
