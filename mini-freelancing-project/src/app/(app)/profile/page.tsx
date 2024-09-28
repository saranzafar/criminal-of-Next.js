"use client"

// components/UserProfile.tsx
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


const UserProfile = () => {
    const { data: session } = useSession();
    const [accountType, setAccountType] = useState(session?.user?.accountType || "Client");
    const { toast } = useToast();
    const router = useRouter();

    const toggleAccountType = async () => {
        try {
            const response = await axios.post("/api/profile");

            if (response.status === 200) {
                const data = response.data;
                setAccountType(data.accountType);
                toast({
                    title: "Success",
                    description: "Account Switched",
                    variant: "default",
                });
                router.replace("/dashboard")
            } else {
                toast({
                    title: "Error",
                    description: "Failed to switch account.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error toggling account type:", error);
            toast({
                title: "Error",
                description: "Error while switch account.",
                variant: "destructive",
            });
        }
    };


    if (!session) {
        return (
            <Card className="w-full max-w-md p-4">
                <CardHeader>
                    <CardTitle>Not Signed In</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => signIn()}>Sign In</Button>
                </CardContent>
            </Card>
        );
    }

    const { user } = session;
    return (
        <Card className="w-full max-w-md p-4 mx-auto mt-10  mb-80">
            <CardHeader>
                <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                        {user.image ? (
                            <AvatarImage src={user.image} alt={user.name || "User"} />
                        ) : (
                            <AvatarFallback>{user.username?.[0]}</AvatarFallback>
                        )}
                    </Avatar>
                    <div>
                        <CardTitle>{user.username}</CardTitle>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-sm text-muted-foreground">Account Type: {accountType}</p>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="">
                <Button onClick={toggleAccountType} className="mt-4 mr-4 bg-teal-600 hover:bg-teal-700">
                    Switch to {accountType === "Client" ? "Freelancer" : "Client"}
                </Button>
                <Button variant="secondary" onClick={() => signOut()} className="mt-2">
                    Sign Out
                </Button>
            </CardContent>
        </Card>
    );
};

export default UserProfile;
