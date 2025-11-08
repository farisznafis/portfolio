'use client'
import Image from "next/image";
import Lanyard from "./components/Lanyard/Lanyard";
import DecryptedText from "./components/DecryptedText/DecryptedText";
import LiquidEther from "./components/LiquidEther/LiquidEther";
import TextPressure from "./components/TextPressure/TextPressure";

import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Home() {
	const session = useSession();
    const supabase = useSupabaseClient();
    
    return (
        <div className="min-h-screen overflow-x-hidden bg-[#06000F]">
            {/* 1c2f3b */}
            <nav className="h-40 w-screen bottom-0 z-50 fixed">
                <div className="mx-16 h-full flex items-center px-8 justify-center">
                    {/* <div className="text-3xl px-4 py-2 rounded-full text-white font-jakarta bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-30">
                        farisznafis
                    </div> */}
                    {/* Navigation Links */}
                    <div className="px-5 py-5 border-white/20 rounded-full bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-30 border"> 
                        <ul className="flex space-x-4 text-white font-outfit text-[20px] items-center h-full">
                            <li className="hover:underline cursor-pointer w-24 text-center">Home</li>
                            <li className="hover:underline cursor-pointer w-24 text-center">Projects</li>
                            <li className="hover:underline cursor-pointer w-24 text-center">Contact</li>
                        </ul>
                    </div>
                    <div>
                        <div className="text-white">
                            {session ? (
                                <button
                                    onClick={() => supabase.auth.signOut()}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                                > Logout </button>
                            ) : (
                                <a
                                    href="/login"
                                    className="text-white hover:underline"
                                > Login </a>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            
            <div className="w-screen h-screen mx-auto pb-40 border top-0">
                {/* text */}
                <div className="scale-75 z-10 relative flex justify-center items-center h-full">
                    <TextPressure
                        text="Hello!"
                        flex={true}
                        alpha={false}
                        stroke={false}
                        width={true}
                        weight={true}
                        italic={true}
                        textColor="#ffffff"
                        strokeColor="#ff0000"
                        minFontSize={36}
                    />
                </div>
                {/* background */}
                {/* <div className="top-0" style={{ width: '100vw', height: '100vh', position: 'absolute' }}>
                    <LiquidEther
                        colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
                        mouseForce={52}
                        cursorSize={100}
                        isViscous={true}
                        viscous={30}
                        iterationsViscous={32}
                        iterationsPoisson={32}
                        resolution={0.5}
                        isBounce={false}
                        // autoDemo={true}
                        autoSpeed={0.8}
                        autoIntensity={2.2}
                        // takeoverDuration={0.25}
                        // autoResumeDelay={3000}
                        // autoRampDuration={0.6}
                    />
                    </div> */}
            </div>
            <div className="container border mx-auto">
                <div className="grid grid-cols-12">
                    <div className="col-span-6 items-center flex flex-row">
                        {/* <div className="flex flex-col p-8 text-5xl text-white border m-12 gap-2">
                            <span>
                                <DecryptedText
                                    text="Ahoy, matey!"
                                    speed={100}
                                    maxIterations={20}
                                    characters="ABCD1234!?"
                                    className="revealed"
                                    parentClassName="all-letters"
                                    encryptedClassName="encrypted"
                                    animateOn="both"
                                    sequential={true}
                                />
                            </span>
                            <span>
                                <DecryptedText
                                    text="Set yer eyes on this"
                                    speed={100}
                                    maxIterations={20}
                                    characters="ABCD1234!?"
                                    className="revealed"
                                    parentClassName="all-letters"
                                    encryptedClassName="encrypted"
                                    animateOn="both"
                                    sequential={true}
                                />
                            </span>
                        </div> */}
                    </div>
                    <div className="col-span-6 shadow-inner-bold bg-[#1C587A] rounded-4xl m-8 overflow-hidden">
                        <Lanyard position={[0, 0, 20]} gravity={[0, -100, 0]}/>
                    </div>
                </div>
            </div>
            <div className="container border mx-auto">
                <div className="grid grid-cols-12">
                    <div className="col-span-6 items-center flex flex-row">
                        <div className="flex flex-col p-8 text-5xl text-white border m-12 gap-2">
                            
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
	);
}
