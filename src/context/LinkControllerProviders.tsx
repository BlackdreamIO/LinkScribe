'use client'

import { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSectionController } from './SectionControllerProviders';
import { ConvertEmailString } from '@/global/convertEmailString';
import { LinkScheme } from '@/scheme/Link';
import { SynchronizeToDexieDB } from '@/helpers';

export const dynamic = 'force-dynamic';

interface LinkContextData {
    CreateLink : ({ sectionID, linkData } : { sectionID : string, linkData : LinkScheme }) => Promise<void>;
    UpdateLink : ({ sectionID, updatedLink } : { sectionID : string, currentLink : LinkScheme, updatedLink : LinkScheme }) => void;
    DeleteLink : ({ sectionID, linkId } : { sectionID : string, linkId : string }) => Promise<void>;

    isloading : boolean;
    setIsLoading : Dispatch<SetStateAction<boolean>>
}

export interface LinkContextType extends LinkContextData {};

type LinkProviderProps = {
    children : ReactNode;
}

const LinkController = createContext<LinkContextType | undefined>(undefined);

export const useLinkController = () => useContext(LinkController)!;

export const LinkControllerProvider = ({children} : LinkProviderProps) => {

    const { isSignedIn, isLoaded, user } = useUser();
    const [isloading, setIsLoading] = useState(true);

    const { SaveContextSections, RestoreContextSections, contextSections, setContextSections } = useSectionController()!;
   
    const CreateLink = async ({ sectionID, linkData } : { sectionID : string, linkData : LinkScheme }) => {
        try {
            setIsLoading(true);
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
                                created_at: new Date().toString(),
                                ref : linkData.ref,
                                image : linkData.image
                            }
                        ]
                    };
                    setContextSections((prevSections) => 
                        prevSections.map((section) => 
                            section.id === sectionID ? updatedSection : section
                        )
                    );
                }
                SaveContextSections();
                setIsLoading(false);
            }
            setIsLoading(false);
        }
        catch (error : any) {
            RestoreContextSections();
            setIsLoading(false);
            throw new Error(error);
        }
    }

    const UpdateLink = async ({ sectionID, currentLink, updatedLink } : { sectionID : string, currentLink : LinkScheme, updatedLink : LinkScheme }) => {
        try 
        {
            if(isSignedIn && isLoaded && user.primaryEmailAddress)
            {
                const targetSection = contextSections.find((section) => section.id === sectionID);

                if (targetSection) {
                    // Find the index of the link to update
                    const linkIndex = targetSection.links.findIndex((link) => link.id === currentLink.id);
                
                    if (linkIndex !== -1) {
                        // Update the link at the found index
                        const updatedLinks = [...targetSection.links];
                        updatedLinks[linkIndex] = {
                            ...updatedLinks[linkIndex],
                            title: updatedLink.title,
                            url: updatedLink.url,
                            visitCount: updatedLink.visitCount,
                            created_at: updatedLink.created_at,
                            ref : updatedLink.ref,
                            image : updatedLink.image
                        };
                        
                        if(currentLink == updatedLink) {
                            return;
                        }

                        const newUpdatedSection = contextSections.map((section) => {
                            if(section.id === sectionID) {
                                return {
                                    ...section,
                                    links: updatedLinks
                                }
                            }
                            else {
                                return section;
                            }
                        })

                        setContextSections(newUpdatedSection);
                        await SynchronizeToDexieDB({ sections : newUpdatedSection, email : ConvertEmailString(user.primaryEmailAddress.emailAddress) });
                    }
                }
                else {
                }
            }
        }
        catch (error : any) {
            RestoreContextSections();
            throw new Error(error);
        }
    }

    const DeleteLink = async ({ sectionID, linkId } : { sectionID : string, linkId : string }) => {
        try {
            if(isSignedIn && isLoaded && user.primaryEmailAddress) {
                const targetSection = contextSections.find((section) => section.id === sectionID);

                if(targetSection) {
                    const linkIndex = targetSection.links.findIndex((link) => link.id === linkId);

                    if(linkIndex != -1) {
                        const updatedLinks = targetSection.links.filter((currentLink) => currentLink.id !== linkId);
                        targetSection.links = updatedLinks;
                        
                        setContextSections((prevSections) =>
                            prevSections.map((section) =>
                                section.id === sectionID ? { ...section, links: updatedLinks } : section
                            )
                        );
                    }
                }


                const currentEmail = ConvertEmailString(user.primaryEmailAddress.emailAddress);
                await SynchronizeToDexieDB({ sections : contextSections, email : currentEmail });
            }
        }
        catch (error : any) {
            RestoreContextSections();
            throw new Error(error);
        }
    }

    const contextValue: LinkContextType = {
       CreateLink,
       UpdateLink,
       DeleteLink,

       isloading,
       setIsLoading
    };

    return (
        <LinkController.Provider value={contextValue}>
            {children}
        </LinkController.Provider>
    )
}