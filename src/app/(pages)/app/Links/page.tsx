"use client"

import { useSectionController } from '@/context/SectionControllerProviders';
import CheckDbExist from '@/global/dbExist';

import BarLoader from "react-spinners/BarLoader";

import { Box, Divider, Text, Stack, VStack } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';

import LinksNavbar from './components/LinksNavbar';
import { DBLoadComponent } from './components/DBLoadComponent';
import { SectionContainer } from './components/SectionContainer/SectionContainer';

export default function LinkPage() 
{
    //const { contextSections, GetSections } = useSectionController()!;
    
    //const dbExist = CheckDbExist();
    
    return (
      <Box className="w-full h-screen overflow-scroll no-scrollbar dark:bg-[rgb(5,5,5)] bg-neutral-100">
        
        <LinksNavbar />
        {/* <DBLoadComponent onCreate={async () => await GetSections(true)} /> */}
        {/* {
            contextSections.map((section, index) => (
                <Button key={index}>{section.id}</Button>
            ))
        } */}

        <SectionContainer/>

      </Box>
    );
}
