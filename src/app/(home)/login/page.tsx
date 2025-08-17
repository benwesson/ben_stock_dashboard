"use client"
import { useRouter } from "next/navigation";
import React from "react";
import { useSession, signIn } from "next-auth/react";

export default function LoginPage() {
    const router = useRouter()
    const {data, status} = useSession()
    if(status === "loading"){
        return(<div>Loading...</div>)
    }
    if(status === "authenticated"){
        router.push("/")
    }
    console.log(data,status)
    return (
        
        <div >
            <div >
                <h1>Ben's Blog</h1>
                <h2 >To write a post or leave a comment, please sign in.</h2>
                <button  onClick={()=>signIn("google" )}>Sign in with Google</button>
                <div >Sign in with Github</div>
                <div >Sign in with Facebook</div>
            </div>
        </div>
    )
}