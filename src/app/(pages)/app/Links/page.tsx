"use client"

import { CSSProperties, useEffect, useState } from 'react';
import { useSectionController } from '@/context/SectionControllerProviders';
import { checkDbExist } from './functions/dbExist';

import BarLoader from "react-spinners/BarLoader";

import { Box, Text } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';

import LinksNavbar from './components/LinksNavbar';
import { CandlestickChart } from 'lucide-react';


const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
    width : '100%'
};

export default function LinkPage() 
{
    const [isCreating, setIsCreating] = useState(false);
    const [statusText, setStatusText] = useState("GET STARTED BY CREATING NEW DB");

    const { contextSections } = useSectionController()!;
    
    //const dbExist = checkDbExist();
    
    useEffect(() => {
        if (isCreating) {
          const updateStatus = async () => {
            const sleep = (ms : number) => new Promise(resolve => setTimeout(resolve, ms));
            const getRandomDelay = () => Math.floor(Math.random() * (3000 - 600 + 1)) + 600;
            
            await sleep(1000);
            setStatusText("GET STARTED BY CREATING NEW DB");

            await sleep(2000);
            setStatusText("Configuring");
            
            await sleep(getRandomDelay());
            setStatusText("Setting Up DB (12%)");
            
            await sleep(getRandomDelay());
            setStatusText("Setting Up DB (29%)");
            
            await sleep(getRandomDelay());
            setStatusText("Setting Up DB (60%)");
            
            await sleep(1200);
            setStatusText("Setting Up DB (99%)");
            
            await sleep(3000);
            setStatusText("COMPLETED");

            await sleep(10);
            setStatusText(".");
            setIsCreating(false);
          };
    
          updateStatus();
        }
      }, [isCreating]);
    

    return (
        <Box className='w-full min-h-screen h-full max-h-auto dark:bg-[rgb(5,5,5)] bg-neutral-100'>
            <LinksNavbar/>

            <BarLoader
                color={"mediumspringgreen"}
                loading={isCreating}
                cssOverride={override}
                speedMultiplier={0.8}
            />

            {/* <Box className='w-full p-8 flex flex-col items-center justify-center'>
                <Text className='dark:text-neutral-700 text-6xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>LINK PAGE</Text>
                <Button disabled={!dbExist}>CREATE DB</Button>
            </Box> */}

            <Box className={`w-full h-[90%] p-8 ${statusText == '.' ? "hidden" : "flex"} flex-col items-center justify-center space-y-8`}>
                <Text className='dark:text-neutral-700 text-6xl text-center'>
                    {
                        statusText
                    }
                </Text>
                <Button onClick={() => setIsCreating(true)} style={{ display : isCreating ? 'none' : 'flex' }} className='w-96 h-12 dark:bg-theme-bgSecondary dark:hover:bg-theme-bgFifth border-2 dark:border-neutral-800 dark:text-white font-bold rounded-xl'>
                    START
                </Button>
            </Box>

        </Box>
    )
}
