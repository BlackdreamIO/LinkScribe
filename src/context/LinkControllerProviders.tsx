'use client'

import { createContext, useContext, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSectionController } from './SectionControllerProviders';
import { ConvertEmailString } from '@/global/convertEmailString';
import { LinkScheme } from '@/scheme/Link';
import { SynchronizeToDexieDB } from '@/helpers';

export const dynamic = 'force-dynamic';

interface LinkContextData {
    CreateLink : ({ sectionID, linkData } : { sectionID : string, linkData : LinkScheme }) => Promise<void>;
    UpdateLink : ({ sectionID, linkData } : { sectionID : string, currentLink : LinkScheme, linkData : LinkScheme }) => Promise<void>;
    DeleteLink : ({ sectionID, linkId } : { sectionID : string, linkId : string }) => Promise<void>;
}

export interface LinkContextType extends LinkContextData {};

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
                                created_at: new Date().toString(),
                                ref : linkData.ref
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
            }
        }
        catch (error : any) {
            RestoreContextSections();
            throw new Error(error);
        }
    }

    const UpdateLink = async ({ sectionID, currentLink, linkData } : { sectionID : string, currentLink : LinkScheme, linkData : LinkScheme }) => {
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
                            title: linkData.title,
                            url: linkData.url,
                            visitCount: linkData.visitCount,
                            created_at: linkData.created_at
                        };
                        
                        if(currentLink.title == linkData.title && currentLink.url == linkData.url) {
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

                        // Update the contextSections state
                        // setContextSections((prevSections) =>
                        //     prevSections.map((section) =>
                        //         section.id === sectionID ? { ...section, links: updatedLinks } : section
                        //     )
                        // );

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
                //await deleteLink(currentEmail, sectionID, linkId, window.location.origin);
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
       DeleteLink
    };

    return (
        <LinkController.Provider value={contextValue}>
            {children}
        </LinkController.Provider>
    )
}