"use client"

import { CSSProperties, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
//import { useSectionController } from '@/context/SectionControllerProviders';
import { useDBController } from '@/context/DBContextProvider';
import { useThemeContext } from '@/context/ThemeContextProvider';
import dynamic from 'next/dynamic';

import { AbsoluteCenter, Box, Heading, Text, VStack } from '@chakra-ui/react';
import { SectionContainerContextWrapper } from './SectionContainerContextWrapper';
import ErrorManager from '../../../components/ErrorHandler/ErrorManager';

import BarLoader from "react-spinners/BarLoader";
import { Skeleton } from '@/components/ui/skeleton';
import { DBLoadComponent } from '../DBLoadComponent';
import { SectionContextProvider } from '@/context/SectionContextProvider';
import { useLowDiskError } from '@/hook/useLowDiskError';
import { ConditionalRender } from '@/components/ui/conditionalRender';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';

const Section = dynamic(() => import('../Section/Section').then((mod) => mod.Section),
{ ssr : true, loading : () => <Skeleton className='w-full dark:bg-theme-bgFourth animate-none h-16 rounded-xl' /> });

const override: CSSProperties = {
    width : "100%",
    backgroundColor : "black",
};

export const SectionContainer = () => {

    const { isSignedIn, isLoaded } = useUser();
    //const { contextSections, setContextSections } = useSectionController();
    const { databaseExist, isLoading } = useDBController();
    const { appBackgroundColor } = useThemeContext();

    const lowDiskError = useLowDiskError();

    const sections = useAppSelector((state : RootState) => state.sectionSlice.sections);

    const sortedSections = useMemo(() => {
        return [...sections].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }, [sections]);
      

    const MemoizedContentDisplay = useMemo(() => {
        return sections.map((section) => (
            <SectionContextProvider key={section.id}>
                <ErrorManager>
                    <Section section={section} key={section.id} />
                </ErrorManager>
            </SectionContextProvider>
        ));
    }, [sections]);
    
    const RenderSections = () => {
        if(sections && sections.length > 0)
        {
            return isSignedIn && isLoaded ? <>{MemoizedContentDisplay}</> : <BarLoader color='white' cssOverride={override} />
        }
        else {
            return <Text>NO SECTION WERE FOUND</Text>
        }
    }

    return (
        <SectionContainerContextWrapper>
            <Box className='w-full h-[93vh] relative' background={appBackgroundColor}>
                <VStack className={`p-4 h-full overflow-y-scroll scrollbar-dark ${lowDiskError ? "!hidden opacity-50" : ""} `} gap={50}>
                    {
                        !databaseExist ? <DBLoadComponent/> : <RenderSections/>
                    }
                </VStack>
                <ConditionalRender render={lowDiskError}>
                    <AbsoluteCenter className='space-y-2'>
                        <Heading className="text-center text-2xl font-extrabold text-red-500">
                            Free Up Space On Your Device
                        </Heading>
                        <Text className='text-center text-neutral-300'>
                            "Your device is running low on memory. Please free up space to continue using the app. The client database failed to sync,
                            and any actions made now will be cleared after the next restore."
                        </Text>
                    </AbsoluteCenter>
                </ConditionalRender>
            </Box>
        </SectionContainerContextWrapper>
    )
}
