"use client"

import { CSSProperties, useEffect, useState } from "react";
import { DBTaskStatus, useDBController } from "@/context/DBContextProvider";
import { useUser } from "@clerk/nextjs";

import ReactConfetti from 'react-confetti';

import { Box, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { useDB } from "@/hook/useDB";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    width : '100%'
};

export const DBLoadComponent = () => {

    const [statusText, setStatusText] = useState("GET STARTED BY CREATING NEW DB");
    const [isCreating, setIsCreating] = useState(false);
    const [hideElement, setHideElement] = useState(false);

    const [windowSize, setWindowSize] = useState({ x : 0, y : 0 });

    const { isSignedIn, isLoaded } = useUser();
    //const { CreateUserDatabase, status, databaseExist } = useDBController();
    const { databaseExist, CreateUserDatabase } = useDB();

    useEffect(() => {
        if (isCreating) {
            const updateStatus = async () => {
                const sleep = (ms : number) => new Promise(resolve => setTimeout(resolve, ms));
                
                await sleep(1000);
                setStatusText("GET STARTED BY CREATING NEW DB");

                await sleep(2000);
                setStatusText("Configuring");
                
                await sleep(600);
                setStatusText("Setting Up DB (12%)");
                
                await sleep(1000);
                setStatusText("Setting Up DB (29%)");
                
                await sleep(600);
                setStatusText("Setting Up DB (60%)");

                await sleep(800);
                setStatusText("Setting Up DB (99%)");

                await sleep(3000);
                setStatusText("COMPLETED");

                await sleep(10);
                setStatusText("");
                await CreateUserDatabase();
            };
        
            updateStatus();
        }
    }, [isCreating]);

    useEffect(()=>{
        setWindowSize({
            x : window.innerWidth,
            y : window.innerHeight
        })
    }, []);

    if(isSignedIn && isLoaded) {
        if(!databaseExist) 
        {
            return (
                <Box className={`w-full h-[90%] p-8 ${hideElement ? "hidden" : "flex"} flex-col items-center justify-center space-y-8`}>
                    <Text className='dark:text-neutral-700 text-6xl text-center'>
                        {
                            statusText
                        }
                    </Text>
                    <Button onClick={() => setIsCreating(true)} style={{ display : isCreating ? 'none' : 'flex' }} className='w-96 h-12 dark:bg-theme-bgSecondary dark:hover:bg-theme-bgFifth border-2 dark:border-neutral-800 dark:text-white font-bold rounded-xl'>
                        START
                    </Button>
                </Box>
            )
        }
        else {
            return (
                <ReactConfetti
                    width={windowSize.x}
                    height={windowSize.y}
                    recycle={false}
                />
            )
        }
    }
    else {
        return <></>
    }
}
