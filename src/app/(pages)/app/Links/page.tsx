"use client"

import { CSSProperties, useEffect, useState } from 'react';
import { useSectionController } from '@/context/SectionControllerProviders';

import BarLoader from "react-spinners/BarLoader";

import { Box, Text } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';

import LinksNavbar from './components/LinksNavbar';
import { CandlestickChart } from 'lucide-react';
import { DBLoadComponent } from './components/DBLoadComponent';
import CheckDbExist from '@/global/dbExist';


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

    const { contextSections, GetSections } = useSectionController()!;
    
    const dbExist = CheckDbExist();

    useEffect(() => {
        console.log(contextSections);
    }, [contextSections])
    
    
    return (
      <Box className="w-full min-h-screen h-full max-h-auto dark:bg-[rgb(5,5,5)] bg-neutral-100">
        
        <LinksNavbar />

        <BarLoader
          color={"mediumspringgreen"}
          loading={isCreating}
          cssOverride={override}
          speedMultiplier={0.8}
        />

        <DBLoadComponent onCreate={async () => await GetSections(true)} />
        {
            contextSections.map((section, index) => (
                <Button key={index}>{section.id}</Button>
            ))
        }
      </Box>
    );
}
