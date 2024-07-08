'use client'

import { useUser } from '@clerk/nextjs';
import { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, useEffect } from 'react';
import useLocalStorage from '@/hook/useLocalStorage';
import { useSectionController } from './SectionControllerProviders';
import { createLink } from '@/app/actions/linkAPI';
import { ConvertEmailString } from '@/global/convertEmailString';
import { LinkScheme } from '@/scheme/Link';
import { SectionScheme } from '@/scheme/Section';

export const dynamic = 'force-dynamic';

interface LinkContextData {
    CreateLink : ({ sectionID, linkData } : { sectionID : string, linkData : LinkScheme }) => Promise<void>;
    UpdateLink : () => Promise<void>;
    DeleteLink : () => Promise<void>;
}

export interface LinkContextType extends LinkContextData {
    
}

type LinkProviderProps = {
    children : ReactNode;
}

const LinkController = createContext<LinkContextType | undefined>(undefined);

export const useLinkController = () => useContext(LinkController);

export const LinkControllerProvider = ({children} : LinkProviderProps) => {

    const { isSignedIn, isLoaded, user } = useUser();

    const { SaveContextSections, RestoreContextSections, contextSections, setContextSections } = useSectionController()!;
   
    const CreateLink = async ({ sectionID, linkData } : { sectionID : string, linkData : LinkScheme }) => {
        try {
            if(isSignedIn && isLoaded && user.primaryEmailAddress)
            {
                const targetSection = contextSections.find((section) => section.id === sectionID);

                if(targetSection) {
                    const updatedSection = {
                        ...targetSection,
                        links: [
                            ...(Array.isArray(targetSection.links) ? targetSection.links : []), // Ensure links is an array
                            {
                                id : linkData.id,
                                title: linkData.title,
                                url: linkData.url,
                                visitCount: linkData.visitCount,
                                created_at: new Date()
                            }
                        ]
                    };
                    setContextSections((prevSections) => 
                        prevSections.map((section) => 
                            section.id === sectionID ? updatedSection : section
                        )
                    );
                }
                
                const response = await createLink(ConvertEmailString(user.primaryEmailAddress.emailAddress), sectionID, JSON.stringify(linkData));
                SaveContextSections();
                console.log(response);
                
                return response;
            }
        }
        catch (error : any) {
            RestoreContextSections();
            throw new Error(error);
        }
    }

    const UpdateLink = async () => {
        
    }

    const DeleteLink = async () => {
        
    }

    const contextValue: LinkContextType = {
       CreateLink,
       UpdateLink,
       DeleteLink
    };

    return (
        <LinkController.Provider value={contextValue}>
            {children}
        </LinkController.Provider>
    )
}