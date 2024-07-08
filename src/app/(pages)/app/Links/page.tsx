"use client"

import { useSectionController } from '@/context/SectionControllerProviders';
import CheckDbExist from '@/global/dbExist';

import BarLoader from "react-spinners/BarLoader";

import { Box} from '@chakra-ui/react';

import LinksNavbar from './components/Navbar/LinksNavbar';
import { DBLoadComponent } from './components/DBLoadComponent';
import { SectionContainer } from './components/SectionContainer/SectionContainer';
import { SectionCreator } from './components/Section/SectionCreator';

export default function LinkPage() 
{
    const { contextSections, GetSections } = useSectionController()!;
    
    const dbExist = CheckDbExist();
    
    return (
      <Box onContextMenu={(e) => e.preventDefault()} className="w-full h-screen overflow-scroll no-scrollbar dark:bg-black bg-neutral-100">
        
        <LinksNavbar />
        <DBLoadComponent onCreate={async () => await GetSections(true)} />

        {
            dbExist && contextSections.length > 0 && (
                <SectionContainer/>
            )
        }
        <SectionCreator />

      </Box>
    );
}
