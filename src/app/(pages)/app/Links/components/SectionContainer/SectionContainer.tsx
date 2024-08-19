"use client"

import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSectionController } from '@/context/SectionControllerProviders';
import { useDBController } from '@/context/DBContextProvider';
import dynamic from 'next/dynamic';

import { Box, Text, VStack } from '@chakra-ui/react';
import { SectionContainerContextWrapper } from './SectionContainerContextWrapper';
import ErrorManager from '../../../components/ErrorHandler/ErrorManager';

import BarLoader from "react-spinners/BarLoader";
import { Skeleton } from '@/components/ui/skeleton';
import { DBLoadComponent } from '../DBLoadComponent';
import { SectionContextProvider } from '@/context/SectionContextProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Section = dynamic(() => import('../Section/Section').then((mod) => mod.Section),
{ ssr : true, loading : () => <Skeleton className='w-full dark:bg-theme-bgFourth animate-none h-16 rounded-xl' /> });

const override: CSSProperties = {
    width : "100%",
    backgroundColor : "black",
};

export const SectionContainer = () => {

    const { isSignedIn, isLoaded } = useUser();
    const { contextSections } = useSectionController();
    const { databaseExist, isLoading } = useDBController();
    
    const [targetWebsiteURL, setTargetWebsiteURL] = useState("");

    const [imageURL, setImageURL] = useState("");

    const GetImage = async () => {
        const response = await fetch(`${window.location.origin}/api/takescreenshot`, {
            method : "POST",
            mode : "no-cors",
            body : JSON.stringify({
                url : targetWebsiteURL
            })
        });

        // Assuming the server responds with the screenshot in Base64
        const { screenshotBase64 } = await response.json();

        
		const byteCharacters = atob(screenshotBase64);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);

          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);

        setImageURL(imageUrl);

    }
    

    const MemoizedContentDisplay = useMemo(() => {
        return contextSections.map((section, i) => (
            <SectionContextProvider key={i}>
                <ErrorManager key={section.id}>
                    <Section
                        currentSection={section}
                        key={section.id}
                    />
                </ErrorManager>
            </SectionContextProvider>
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

                <Input onChange={(e) => setTargetWebsiteURL(e.target.value)} />
                <Button onClick={GetImage}>TAKE SCREENSHOT</Button>
            
                {
                    imageURL.length > 0 && (
                        <img src={imageURL} alt="not found" />
                    )
                }

                <VStack className='p-4 h-full overflow-y-scroll scrollbar-dark' gap={50}>
                    {
                        !databaseExist ? <DBLoadComponent/> : <RenderSections/>
                    }
                </VStack>
            </Box>
        </SectionContainerContextWrapper>
    )
}
