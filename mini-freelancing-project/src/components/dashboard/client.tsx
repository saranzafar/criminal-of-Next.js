"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

// Define the API response type (optional)
interface ApiResponse {
    success: boolean;
    message: string;
}

function Client() {
    const [projectInfo, setProjectInfo] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Handle the input change
    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        setProjectInfo(e.target.value);
    };

    // Handle form submission
    // const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    //     e.preventDefault();
    //     setIsSubmitting(true);
    //     setError(null);

    //     try {
    //         const response = await fetch("https://xyz.api/submit-project", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ projectInfo }),
    //         });

    //         if (!response.ok) {
    //             throw new Error("Failed to submit project");
    //         }

    //         const data: ApiResponse = await response.json();
    //         alert("Project posted successfully!");
    //     } catch (error) {
    //         setError("Error submitting project. Please try again.");
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    return (
        <div className=" mx-auto mt-10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-teal-600 mb-4">Post a Project</h2>
            <form className="space-y-4">
                <div>
                    <textarea
                        id="projectInfo"
                        value={projectInfo}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                        placeholder="Describe your project in detail..."
                        rows={4}
                        required
                    />
                </div>
                <div className="text-right">
                    <button
                        type="submit"
                        className={`w-[10rem] px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 transition duration-300 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Post Project"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export { Client };
