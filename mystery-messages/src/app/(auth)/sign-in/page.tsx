'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"



const Page = () => {
    const { toast } = useToast()
    const router = useRouter()

    //form with zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn("credentials", {
            redirect: false,
            idenifier: data.identifier,
            password: data.password,
        })
        console.log("Result: ", result);
        if (result?.error) {
            if (result.error == "CredentialsSignin") {
                toast({
                    title: "Login Failed",
                    description: "Incorrect username or password",
                    variant: "destructive"
                })
            }
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive"
            })
        }
        if (result?.url) {
            router.replace("/dashboard")
        }

    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        <p className="mb-4">Sign in to start anonymous advanture</p>
                    </h1>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="identifier"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email or Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email or username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password"  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" >
                            SignIn
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4 text-sm">
                    <div>
                        Don't have Account?{" "}
                        <Link href={"/sign-up"} className="text-blue-600 hover:text-blue-800">Create Account</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page