'use client'

import { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useSectionController } from './SectionControllerProviders';
import { ConvertEmailString } from '@/global/convertEmailString';
import { LinkScheme } from '@/scheme/Link';
import { UploadImageToCloudinary } from '@/app/actions/cloudnary/uploadImage';
import { RefineEmail, SynchronizeToDexieDB, FileToBase64 } from '@/helpers';
import { useSendToastMessage } from '@/hook/useSendToastMessage';
import { DeleteCloudinaryImage } from '@/app/actions/cloudnary/deleteImage';
import { useSectionContainerContext } from './SectionContainerContext';
import { DexieGetCacheImage } from '@/database/dexie/helper/DexieCacheImages';
import { ImageCacheManager } from "@/database/managers/ImageCacheMnager";
import { useFetch } from '@/hook/useFetch';

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
    GetCacheImage : ({ id } : { id : string }) => Promise<Blob | undefined>;
    GetPreviewImage : ({ link, onSucess, onError } : { link : LinkScheme, onCallback? : (status : string) => void, onSucess? : (src : string) => void, onError? : () => void }) => void;
    IncreaseViewCount : ({ link } : { link : LinkScheme }) => void;

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

    const [isloading, setIsLoading] = useState(true);

    const { isSignedIn, isLoaded, user } = useUser();
    const { getToken } = useAuth();
    const { fetchGet, fetchPost } = useFetch();

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
                                created_at: new Date(),
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
            //throw new Error(error);
            ToastMessage({ message : "Failed To Perform Action", description : JSON.stringify(error), type : "Error" });
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
                    const linkIndex = targetSection.links.findIndex(link => link.id === currentLink.id);
    
                    if (linkIndex !== -1) {
                        // Check if the current link and updated link are the same to avoid unnecessary updates
                        if (currentLink.id === updatedLink.id &&
                            currentLink.title === updatedLink.title &&
                            currentLink.url === updatedLink.url &&
                            currentLink.visitCount === updatedLink.visitCount &&
                            currentLink.created_at === updatedLink.created_at &&
                            currentLink.ref === updatedLink.ref &&
                            currentLink.image === updatedLink.image) {
                            return; // No update required
                        }
    
                        // Create a new links array with the updated link to maintain immutability
                        const updatedLinks = targetSection.links.map((link, index) => 
                            index === linkIndex ? { ...link, ...updatedLink } : link
                        );
    
                        // Create a new sections array with the updated links array
                        const newUpdatedSections = contextSections.map(section => 
                            section.id === sectionID ? { ...section, links: updatedLinks } : section
                        );
    
                        setContextSections(newUpdatedSections);
    
                        // Synchronize with DexieDB
                        await SynchronizeToDexieDB({ 
                            sections: newUpdatedSections, 
                            email: ConvertEmailString(user.primaryEmailAddress.emailAddress) 
                        });
                    }
                }
                else {
                    throw new Error('Section not found');
                }
            }
        }
        catch (error : any) {
            RestoreContextSections();
            //throw new Error(error);
            ToastMessage({ message : "Failed To Perform Action", description : JSON.stringify(error), type : "Error" });
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
            ToastMessage({ message : "Failed To Perform Action", description : JSON.stringify(error), type : "Error" });
        }
    }

    const AddPreviewImage = async ({ file, url, useFileMethod, autoSyncAfterUpload, link, onSucess, onError, onCallback } : IAddPreviewImage) => {
        
        const token = await getToken({ template : "linkscribe-supabase" });
                    
        if(user && isSignedIn && user.primaryEmailAddress && token)
        {
            try{
                if(file !== undefined)
                {
                    const formData = new FormData();
                    formData.append("previewImage", file);
                    formData.append("email", RefineEmail(user?.primaryEmailAddress?.emailAddress ?? ''));
                    formData.append("id", link.id);
    
                    onCallback?.({ loading : true });
                    /*
                    const response = await fetch("http://localhost:5000/media", {
                        method : "POST",
                        headers : { 'Authorization': `Bearer ${token}`},
                        body : formData
                    });
    
                    const data = await response.json();

                    console.log(data);
                    */

                    ImageCacheManager.InitializeCacheManager({ email : RefineEmail(user?.primaryEmailAddress?.emailAddress ?? '') });
                    await ImageCacheManager.uploadToCache({
                        image : file,
                        cacheEncoderDecoder : "blob",
                        compressMode : "FTC",
                        metaData : {
                            id : link.id,
                            ref : RefineEmail(user?.primaryEmailAddress?.emailAddress ?? ''),
                            url : 'response?.data?.url'
                        },
                        onCallback(callbackStatus) {
                            //setImageProcessingStatus(callbackStatus);
                        },
                        onError : (error) => {
                            ToastMessage({ message : JSON.stringify(error.message), type : "Error", duration : 5000 });
                        }
                    });
                    
                    onCallback?.({ loading : false });

                    autoSyncAfterUpload && Sync();
                    ToastMessage({ message : "Link Preview Image Added Successfully", type : "Success" });
                    onSucess?.();
                }
                else if(!useFileMethod && url && url.length > 5)
                {
                    onCallback?.({ loading : true });

                    const imageBlob = await fetch(url).then(res => res.blob());

                    const convertedFile = new File([imageBlob], `${link.id}.webp`, {
                        type: imageBlob.type,
                    });

                    console.log(convertedFile)

                    const formData = new FormData();
                    formData.append("previewImage", convertedFile);
                    formData.append("email", RefineEmail(user?.primaryEmailAddress?.emailAddress ?? ''));
                    formData.append("id", link.id);

                    const response = await fetch("http://localhost:5000/media", {
                        method : "POST",
                        headers : { 'Authorization': `Bearer ${token}`},
                        body : formData
                    });

                    const data = await response.json();

                    console.log(data);

                    ImageCacheManager.InitializeCacheManager({ email : RefineEmail(user?.primaryEmailAddress?.emailAddress ?? '') });
                    await ImageCacheManager.uploadToCache({
                        image : imageBlob,
                        cacheEncoderDecoder : "blob",
                        compressMode : "BTC",
                        metaData : {
                            id : link.id,
                            ref : RefineEmail(user?.primaryEmailAddress?.emailAddress ?? ''),
                            url : 'response?.data?.url'
                        },
                        onCallback(callbackStatus) {
                            //setImageProcessingStatus(callbackStatus);
                        },
                        onError : (error) => {
                            ToastMessage({ message : JSON.stringify(error.message), type : "Error", duration : 5000 });
                        }
                    });
                    
                    onCallback?.({ loading : false });

                    autoSyncAfterUpload && Sync();
                    ToastMessage({ message : "Link Preview Image Added Successfully", type : "Success" });
                    onSucess?.();
                }
                else {
                    ToastMessage({ message : "Please Provide A File Or URL", type : "Warning" });
                    onSucess?.();
                }
            }
            catch (error : any) {
                console.log(error);
                ToastMessage({ message : "Internal 500 Error", description : String(error), type : "Error" });
                onError?.();
            }
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

    const GetPreviewImage = async ({ link, onSucess, onError, onCallback } : { link : LinkScheme, onCallback? : (status : string) => void, onSucess? : (src : string) => void, onError? : () => void }) => {
        if(user && user.primaryEmailAddress) {
            const cacheImage = await DexieGetCacheImage({
                id : link.id,
                email : RefineEmail(user?.primaryEmailAddress?.emailAddress ?? ''),
                revalidation : {
                    image_url : link.url,
                    revalidate : false
                },
                onError(error) {
                    ToastMessage({ message : "Please Free Up Storage Space On Your Device", description : error.message ?? '', type : "Error" })
                    console.error(error);
                },
            });

            if(cacheImage) {
                const imageURL = URL.createObjectURL(cacheImage);
                onSucess?.(imageURL);
                return imageURL;
            }
            else {
                const path = `${RefineEmail(user?.primaryEmailAddress?.emailAddress ?? '')}/links/${link.id}.webp`;

                const res = await fetch(`http://localhost:5000/media/?path=${path}`, {
                    method : "GET",
                    cache : "no-store",
                    next : { revalidate : 0 }
                })
                const json = await res.json();

                if(json?.data?.url) {
                    const blob = await fetch(json?.data?.url).then(res => res.blob());

                    ImageCacheManager.InitializeCacheManager({ email : RefineEmail(user?.primaryEmailAddress?.emailAddress ?? '') });
                    await ImageCacheManager.uploadToCache({
                        image : blob,
                        cacheEncoderDecoder : "blob",
                        compressMode : "BTC",
                        metaData : {
                            id : link.id,
                            ref : RefineEmail(user?.primaryEmailAddress?.emailAddress ?? ''),
                            url : json?.data?.url
                        },
                        onCallback : onCallback,
                        onError : (error) => {
                            ToastMessage({ message : JSON.stringify(error.message), type : "Error", duration : 5000 });
                        }
                    });
                }
                else {
                    ToastMessage({ message : "Preview Image Not Found", type : "Warning" });
                }
            }
        }
    }

    const GetCacheImage = async ({ id } : { id : string }) => {
        if(user && user.primaryEmailAddress) {
            const cacheImage = await DexieGetCacheImage({ id : id, email : user.primaryEmailAddress.emailAddress });
            return cacheImage;
        }
    }

    const IncreaseViewCount = ({ link } : { link : LinkScheme }) => {
        UpdateLink({
            currentLink : link,
            sectionID : link.ref,
            updatedLink : {
                ...link,
                visitCount : link.visitCount + 1
            }
        })
    }

    const contextValue: LinkContextType = {
       CreateLink,
       UpdateLink,
       DeleteLink,

       AddPreviewImage,
       DeletePreviewImage,
       GetCacheImage,
       GetPreviewImage,
       IncreaseViewCount,

       isloading,
       setIsLoading
    };

    return (
        <LinkController.Provider value={contextValue}>
            {children}
        </LinkController.Provider>
    )
}