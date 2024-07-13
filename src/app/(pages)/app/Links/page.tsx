"use client"

import dynamic from 'next/dynamic';
import { useSectionController } from '@/context/SectionControllerProviders';

import { Box} from '@chakra-ui/react';
import { ConditionalRender } from '@/components/ui/conditionalRender';
import { useDBController } from '@/context/DBContextProvider';

const LinksNavbar = dynamic(() => import('./components/Navbar/LinksNavbar'));
const SectionContainer = dynamic(() => import('./components/SectionContainer/SectionContainer').then((mod) => mod.SectionContainer));
const SectionCreator = dynamic(() => import('./components/Section/SectionCreator').then((mod) => mod.SectionCreator));
const DBLoadComponent = dynamic(() => import('./components/DBLoadComponent').then((mod) => mod.DBLoadComponent));

export default function LinkPage() 
{
    const { contextSections, GetSections } = useSectionController()!;
    const { databaseExist } = useDBController()!;
    
    return (
      <Box onContextMenu={(e) => e.preventDefault()} className="w-full h-screen overflow-scroll no-scrollbar dark:bg-black bg-neutral-100">
        
        <LinksNavbar />
        <DBLoadComponent onCreate={async () => await GetSections(true)} />

        <ConditionalRender render={databaseExist}>
            <SectionContainer contextSections={contextSections} />
        </ConditionalRender>

        <SectionCreator />
      </Box>
    );
}
