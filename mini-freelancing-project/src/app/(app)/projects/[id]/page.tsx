"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

// Define a TypeScript interface for the project and bids
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

    useEffect(() => {
        const fetchProject = async () => {
            if (id) {
                try {
                    const response = await axios.get(`/api/project/${id}`);
                    if (response.status === 200) {
                        // Dummy data for demonstration purposes
                        const dummyBids = [
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

                        // Set the project with dummy bids if there are none
                        const projectData = response.data?.project;
                        if (projectData) {
                            projectData.bids = projectData?.bids?.length > 0 ? projectData?.bids : dummyBids;
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

    if (!project) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 mb-20">
            <Card className="w-full max-w-4xl mt-10 divide-y divide">
                <CardHeader className=''>
                    <CardTitle className="text-2xl font-bold">{project.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{project.details}</p>
                    <p className="text-lg font-semibold mt-2">Amount: ${project.amount}</p>
                    <div className='w-full text-right'>
                        <Button
                            onClick={handleDelete}
                            className="mt-4 border border-red-600 bg-transparent text-red-600 hover:bg-red-50 inline-block "
                        >
                            Delete Project
                        </Button>
                    </div>
                </CardHeader>
            </Card>
            <Card className="w-full max-w-4xl mt-10 divide-y divide">
                <CardContent>
                    <h2 className="text-xl font-semibold mt-4 mb-4">Bids</h2>
                    {project.bids && project.bids.length > 0 ? (
                        project.bids.map((bid, index) => (
                            <div key={index} className="border p-4 my-2 rounded-md shadow-sm space-y-2">
                                <p className="font-bold">{bid.username}</p>
                                <p className="text-sm">Bid Detail: {bid.comment}</p>
                                <p className="text-xs text-gray-500">{new Date(bid.date).toLocaleDateString()}</p>
                                <div className='w-full text-right'>
                                    <Button className="bg-teal-600 text-white hover:bg-teal-700">
                                        Discuss
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No bids available for this project.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
