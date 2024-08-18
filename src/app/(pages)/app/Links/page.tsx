"use client"

import dynamic from 'next/dynamic';

import { Box} from '@chakra-ui/react';

const LinksNavbar = dynamic(() => import('./components/Navbar/LinksNavbar'));
const SectionContainer = dynamic(() => import('./components/SectionContainer/SectionContainer').then((mod) => mod.SectionContainer));
const SectionCreator = dynamic(() => import('./components/Section/SectionCreator').then((mod) => mod.SectionCreator));

export default function LinkPage() 
{
    return (
        <Box onContextMenu={(e) => e.preventDefault()} className="w-full h-screen overflow-scroll no-scrollbar dark:bg-black bg-neutral-100">
          <LinksNavbar />
          <SectionContainer/>
          <SectionCreator />
        </Box>
    );
}
