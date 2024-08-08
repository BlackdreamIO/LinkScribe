"use client"

import { CSSProperties, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSectionController } from '@/context/SectionControllerProviders';
import dynamic from 'next/dynamic';

import { Box, Text, VStack } from '@chakra-ui/react';
import { SectionContainerContextWrapper } from './SectionContainerContextWrapper';
import ErrorManager from '../../../components/ErrorHandler/ErrorManager';

import BarLoader from "react-spinners/BarLoader";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

const Section = dynamic(() => import('../Section/Section').then((mod) => mod.Section),
{ ssr : true, loading : () => <Skeleton className='w-full dark:bg-theme-bgFourth animate-none h-16 rounded-xl' /> });

const override: CSSProperties = {
    width : "100%",
    backgroundColor : "black",
};

export const SectionContainer = () => {

    const { isSignedIn, isLoaded } = useUser();
    const { contextSections, Sync } = useSectionController()!;

    const MemoizedContentDisplay = useMemo(() => {
        return contextSections.map((section, i) => (
            <ErrorManager key={section.id}>
                <Section
                    currentSection={section}
                    key={section.id}
                />
            </ErrorManager>
        ))
    }, [contextSections]);

    const RenderSections = () => {
        if(contextSections && contextSections.length > 0)
        {
            return isSignedIn && isLoaded ? <>{MemoizedContentDisplay}</> : <BarLoader color='white' cssOverride={override} />
        }
        else {
            return <Text>NO SECTION WERE FOUND</Text>
        }
    }

    return (
        <SectionContainerContextWrapper>
            <Box className='w-full h-[93vh]'>
                <Button variant={"default"} onClick={() => Sync()} className='w-48 py-2 border border-blue-300 m-2 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:text-white rounded-lg'>SYNC</Button>
                <VStack className='p-4 h-full overflow-y-scroll scrollbar-dark' gap={50}>
                    <RenderSections/>
                </VStack>
            </Box>
        </SectionContainerContextWrapper>
    )
}
