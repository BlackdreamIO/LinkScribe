'use client'

import { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSectionController } from './SectionControllerProviders';
import { ConvertEmailString } from '@/global/convertEmailString';
import { LinkScheme } from '@/scheme/Link';
import { UploadImageToCloudinary } from '@/app/actions/cloudnary/uploadImage';
import { RefineEmail, SynchronizeToDexieDB, FileToBase64 } from '@/helpers';
import { useSendToastMessage } from '@/hook/useSendToastMessage';
import { DeleteCloudinaryImage } from '@/app/actions/cloudnary/deleteImage';

export const dynamic = 'force-dynamic';

interface IAddPreviewImage {
    file : File | undefined;
    url? : string;
    useFileMethod? : boolean;
    autoSyncAfterUpload? : boolean;
    link : LinkScheme;
    onSucess? : () => void;
    onError? : () => void;
    onCallback? : ({loading} : { loading : boolean }) => void;
}

interface LinkContextData {
    CreateLink : ({ sectionID, linkData } : { sectionID : string, linkData : LinkScheme }) => Promise<void>;
    UpdateLink : ({ sectionID, updatedLink } : { sectionID : string, currentLink : LinkScheme, updatedLink : LinkScheme }) => void;
    DeleteLink : ({ sectionID, linkId } : { sectionID : string, linkId : string }) => void;

    AddPreviewImage : ({ file, url, useFileMethod, link, autoSyncAfterUpload, onSucess, onError, onCallback } : IAddPreviewImage) => void;
    DeletePreviewImage : ({ link } : { link : LinkScheme, onSucess? : () => void, onError? : () => void }) => void;

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

    const { SaveContextSections, RestoreContextSections, contextSections, setContextSections, Sync } = useSectionController();
    const { ToastMessage } = useSendToastMessage();
   
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

    const AddPreviewImage = async ({ file, url, useFileMethod, autoSyncAfterUpload, link, onSucess, onError, onCallback } : IAddPreviewImage) => {
        if(user && isSignedIn && user.primaryEmailAddress)
        {
                if(file !== undefined)
                {
                    onCallback?.({ loading : true });
                    const convertedBase64 = await FileToBase64(file);
                    const { imageURL, error } = await UploadImageToCloudinary({
                        file : convertedBase64,
                        filename : link.id,
                        folder : RefineEmail(user.primaryEmailAddress.emailAddress),
                    });
                    onCallback?.({ loading : false });

                    if(error) {
                        console.error(error);
                        onError?.();
                        return;
                    }

                    UpdateLink({
                        currentLink : link,
                        sectionID : link.ref,
                        updatedLink : {
                            ...link,
                            image : imageURL,
                        }
                    })

                    autoSyncAfterUpload && Sync();
                    ToastMessage({ message : "Link Preview Image Added Successfully", type : "Success" });
                    onSucess?.();
                }
                else if(!useFileMethod && url && url.length > 5)
                {
                    onCallback?.({ loading : true });

                    // Convert the fetched image to blob
                    const imageBlob = await fetch(url).then(res => res.blob());
                    const convertedBase64 = await FileToBase64(imageBlob);

                    const { imageURL, error } = await UploadImageToCloudinary({
                        file : convertedBase64,
                        filename : link.id,
                        folder : RefineEmail(user.primaryEmailAddress.emailAddress)
                    });

                    onCallback?.({ loading : false });

                    if(error) {
                        console.error(error);
                        onError?.();
                        return;
                    }

                    UpdateLink({
                        currentLink : link,
                        sectionID : link.ref,
                        updatedLink : {
                            ...link,
                            image : imageURL,
                        }
                    })

                    autoSyncAfterUpload && Sync();
                    ToastMessage({ message : "Link Preview Image Added Successfully", type : "Success" });
                    onSucess?.();
                }
                else {
                    ToastMessage({ message : "Please Provide A File Or URL", type : "Warning" });
                    onSucess?.();
                }
            //}
            // catch (error : any) {
            //     console.log(error);
            //     ToastMessage({ message : "Internal 500 Error", description : String(error), type : "Error" });
            //     onError?.();
            // }
        }
    }

    const DeletePreviewImage = async ({ link, onSucess, onError } : { link : LinkScheme, onSucess? : () => void, onError? : () => void }) => {
        if(user && isSignedIn && user.primaryEmailAddress) {
            if(link.image !== "") {
                const { sucess, error } = await DeleteCloudinaryImage({ publicID : `${RefineEmail(user.primaryEmailAddress.emailAddress)}/${link.id}` });

                if(sucess) {
                    UpdateLink({
                        currentLink : link,
                        sectionID : link.ref,
                        updatedLink : {
                            ...link,
                            image : "",
                        }
                    })
                    onSucess?.();
                }
                else {
                    onError?.();
                }
                sucess ? ToastMessage({ message : "Link Preview Image Deleted Successfully", type : "Success" }) :
                        ToastMessage({ message : "Something went wrong", description : error, type : "Error" });
            }   
        }
    }

    const contextValue: LinkContextType = {
       CreateLink,
       UpdateLink,
       DeleteLink,

       AddPreviewImage,
       DeletePreviewImage,

       isloading,
       setIsLoading
    };

    return (
        <LinkController.Provider value={contextValue}>
            {children}
        </LinkController.Provider>
    )
}