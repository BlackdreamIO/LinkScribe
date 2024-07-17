"use client"

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useSectionController } from '@/context/SectionControllerProviders';

import { Box, Text} from '@chakra-ui/react';
import { ConditionalRender } from '@/components/ui/conditionalRender';
import { useDBController } from '@/context/DBContextProvider';
import { useUser } from '@clerk/nextjs';

import EmptyStreetSvg from "../../../../../public/svgs/brainstroming.svg";

const LinksNavbar = dynamic(() => import('./components/Navbar/LinksNavbar'));
const SectionContainer = dynamic(() => import('./components/SectionContainer/SectionContainer').then((mod) => mod.SectionContainer));
const SectionCreator = dynamic(() => import('./components/Section/SectionCreator').then((mod) => mod.SectionCreator));
const DBLoadComponent = dynamic(() => import('./components/DBLoadComponent').then((mod) => mod.DBLoadComponent));


export default function LinkPage() 
{
    const { contextSections, GetSections } = useSectionController()!;
    const { databaseExist } = useDBController()!;

    const { isSignedIn, isLoaded } = useUser();
    
    return (
      <Box onContextMenu={(e) => e.preventDefault()} className="w-full h-screen overflow-scroll no-scrollbar dark:bg-black bg-neutral-100">
        
        <LinksNavbar />
        {
            isSignedIn ? (
                <DBLoadComponent onCreate={async () => await GetSections(true)} />
            )
            :
            isLoaded ? (
                <Box className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-[93vh] flex flex-col items-center justify-center z-0 pointer-events-none'>
                    <Text className='dark:text-neutral-700 text-6xl text-center pointer-events-none max-md:text-4xl max-sm:text-base'>
                        NOT SIGNED IN
                    </Text>
                    <Image
                        src={EmptyStreetSvg}
                        alt='svg not found'
                        width={100}
                        height={100}
                        className='pointer-events-none w-8/12'
                    />
                </Box>
            )
            :
            (
                <Text className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 dark:text-neutral-700 text-6xl text-center'>
                    CHECKING 
                    <Image
                        src={EmptyStreetSvg}
                        alt='svg not found'
                        width={100}
                        height={100}
                    />
                </Text>
            )
        }

        <ConditionalRender render={databaseExist}>
            <SectionContainer contextSections={contextSections} />
        </ConditionalRender>

        <SectionCreator />
      </Box>
    );
}
