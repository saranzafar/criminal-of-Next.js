"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { z, ZodSchema } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage, } from "@/components/ui/form";

// Define TypeScript interfaces for the project and bids
interface Bid {
    username: string;
    userId: string;
    comment: string;
    date: string;
}

interface Project {
    _id: string;
    title: string;
    details: string;
    amount: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    bids: Bid[];
}

const Page = () => {
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const { toast } = useToast();
    const [accountType, setAccountType] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            if (id) {
                try {
                    const response = await axios.get(`/api/project/${id}`);
                    if (response.status === 200) {
                        // Dummy data for demonstration purposes
                        const dummyBids: Bid[] = [
                            {
                                username: "User1",
                                userId: "66f98c8fb278f6f1e6c5ddce",
                                comment: "This is my first bid.",
                                date: new Date().toISOString(),
                            },
                            {
                                username: "User2",
                                userId: "66f98c8fb278f6f1e6c5ddcf",
                                comment: "This is my second bid.",
                                date: new Date().toISOString(),
                            },
                        ];

                        const projectData = response.data?.project;
                        if (projectData) {
                            projectData.bids = projectData?.bids?.length > 0 ? projectData.bids : dummyBids;
                            setProject(projectData);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching project data:", error);
                    toast({
                        title: "Error",
                        description: "Failed to fetch project data.",
                        variant: "destructive",
                    });
                }
            }
        };

        fetchProject();
    }, [id, toast]);

    const handleDelete = async () => {
        if (!project) return;
        try {
            const response = await axios.delete(`/api/project/${project._id}`);
            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: "Project deleted successfully.",
                    variant: "default",
                });
                window.location.href = '/projects';
            }
        } catch (error) {
            console.error("Error deleting project:", error);
            toast({
                title: "Error",
                description: "Failed to delete project.",
                variant: "destructive",
            });
        }
    };

    const fetchUserType = async () => {
        try {
            const response = await axios.get("/api/profile");
            if (response.status === 200) {
                setAccountType(response.data.userType);
            }
        } catch (error) {
            console.error("Error fetching user type:", error);
            toast({
                title: "Error",
                description: "Failed to fetch user type.",
                variant: "default",
            });
        }
    };
    useEffect(() => {
        fetchUserType();
    }, []);

    if (!project) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        );
    }

    // Zod validation schema
    const bidSchema: ZodSchema = z.object({
        comment: z.string().min(1, "Bid comment is required."),
        username: z.string(),
        userId: z.string(),
    });

    const BidForm = () => {
        const { toast } = useToast();
        const { id } = useParams(); // Get project ID from URL
        const form = useForm({
            resolver: zodResolver(bidSchema),
            defaultValues: {
                comment: '',
            },
        });

        const onSubmit = async (data: { comment: string }) => {
            try {
                const response = await axios.post(`/api/bids`, {
                    projectId: id,
                    comment: data.comment,
                });

                if (response.status === 200) {
                    toast({
                        title: "Success",
                        description: "Bid submitted successfully.",
                        variant: "default",
                    });
                    form.reset();
                } else {
                    throw new Error("Failed to submit bid.");
                }
            } catch (error) {
                console.error("Error submitting bid:", error);
                toast({
                    title: "Error",
                    description: "Failed to submit bid.",
                    variant: "destructive",
                });
            }
        };
        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-fulle space-y-6">
                    <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder="Describe your bid here"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Keep your bid concise and to the point.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit Bid</Button>
                </form>
            </Form>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 mb-20">
            <Card className="w-full max-w-4xl mt-10 divide-y divide">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">{project.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{project.details}</p>
                    <p className="text-lg font-semibold mt-2">Amount: ${project.amount}</p>
                    {accountType === "client" && (
                        <div className="w-full text-right">
                            <Button
                                onClick={handleDelete}
                                className="mt-4 border border-red-600 bg-transparent text-red-600 hover:bg-red-50"
                            >
                                Delete Project
                            </Button>
                        </div>
                    )}
                </CardHeader>
            </Card>
            <Card className="w-full max-w-4xl mt-10 divide-y divide">
                {accountType === "client" ? (
                    <CardContent>
                        <h2 className="text-xl font-semibold mt-4 mb-4">Bids</h2>
                        {project.bids && project.bids.length > 0 ? (
                            project.bids.map((bid, index) => (
                                <div key={index} className="border p-4 my-2 rounded-md shadow-sm space-y-2">
                                    <p className="font-bold">{bid.username}</p>
                                    <p className="text-sm">Bid Detail: {bid.comment}</p>
                                    <p className="text-xs text-gray-500">{new Date(bid.date).toLocaleDateString()}</p>
                                    <div className="w-full text-right">
                                        <Button className="bg-teal-600 text-white hover:bg-teal-700">Discuss</Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No bids available for this project.</p>
                        )}
                    </CardContent>
                ) : (
                    <CardContent className=''>
                        <BidForm />
                    </CardContent>
                )}
            </Card>
        </div>
    );
};

export default Page;
