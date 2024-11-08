"use client"

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useLinkController } from "@/context/LinkControllerProviders";
import { useSendToastMessage } from "@/hook/useSendToastMessage";
import { useCopyImageToClipboard } from "@/hook/useCopyImageToClipboard";

import { LinkScheme } from "@/scheme/Link";
import Image from "next/image";

import { GetCloudinaryImage } from "@/app/actions/cloudnary/getImage";
import { RefineEmail } from "@/helpers";
import { DexieGetCacheImage } from "@/database/dexie/helper/DexieCacheImages";
import { ImageCacheManager } from "@/database/managers/ImageCacheMnager";
import { ConvertBlobToUrl } from "@/helpers/ConvertBlobToUrl";
import { IsValidImageUrl } from "@/helpers/IsValidImageUrl";

import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Box, Center, HStack, Text, VStack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

import { Settings } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ConditionalRender } from "@/components/ui/conditionalRender";

import ErrorManager from "../../../components/ErrorHandler/ErrorManager";
import blankImage from "../../../../../../../public/images/blankImage.webp";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "../Section/DynamicImport";
import { UploadLinkPreviewImage } from "@/app/actions/database/media/links/uploadLinkPreviewImage";


type LinkQuickLookProps = {
    link : LinkScheme;
    open : boolean;
    onClose : (value : boolean) => void;
}

const ButtonStyle = "w-56 dark:bg-theme-bgFifth dark:hover:bg-theme-bgThird border-[1px] dark:border-neutral-800 rounded-lg !ring-0 !outline-none focus-visible:border-4 focus-visible:!border-theme-borderNavigation";

export const LinkQuickLook = (props : LinkQuickLookProps) => {
    
    const { link, open, onClose } = props;

    const [showImageProcessingStatus, setShowImageProcessingStatus] = useState<boolean>(false);
    const [imageProcessingStatus, setImageProcessingStatus] = useState("Processing");

    const [openSettings, setOpenSettings] = useState(false);
    const [linkPreviewImage, setLinkPreviewImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [uploadedFile, setUploadedFile] = useState<File | undefined>(undefined);
    const [uploadedImageURL, setUploadedImageURL] = useState<string>("");
    const [isImageUrlValid, setIsImageUrlValid] = useState<boolean>(false);
    
    const { user } = useUser();
    const { getToken } = useAuth();
    const { UpdateLink, AddPreviewImage, DeletePreviewImage, GetPreviewImage } = useLinkController();
    const { ToastMessage } = useSendToastMessage();
    const [ copyImageToClipboard ] = useCopyImageToClipboard();

    useEffect(() => {
        if(uploadedFile !== undefined) {
            setLinkPreviewImage(URL.createObjectURL(uploadedFile));
            setOpenSettings(false);
        }
    }, [uploadedFile]);

    useEffect(() => {
        if(open) {
            GetLinkPreviewImageByID();
        }
    }, [open])
    
    const GetLinkPreviewImageByID = async () => {

        if(!user) return;

        GetPreviewImage({
            link : link,
            onSucess : (src) => {
                setLinkPreviewImage(src);
            },
            onCallback(status) {
                setShowImageProcessingStatus(true);
                setImageProcessingStatus(status);
            },
        })

        setShowImageProcessingStatus(false);

        /*
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

        console.log(cacheImage)

        if(cacheImage) {
            const imageURL = URL.createObjectURL(cacheImage);
            setLinkPreviewImage(imageURL);
            return;
        }
        */

        /*
        const path = `${RefineEmail(user?.primaryEmailAddress?.emailAddress ?? '')}/links/${link.id}.webp`;

        const res = await fetch(`http://localhost:5000/media/?path=${path}`, {
            method : "GET",
            cache : "no-store",
            next : { revalidate : 0 }
        })

        const json = await res.json();
        console.log(json?.data?.url);

        const blob = await fetch(json?.data?.url).then(res => res.blob());

        console.log(blob)

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
            setLinkPreviewImage(imageURL);
            return;
        }
        else {
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
                onCallback(callbackStatus) {
                    setImageProcessingStatus(callbackStatus);
                },
                onError : (error) => {
                    ToastMessage({ message : JSON.stringify(error.message), type : "Error", duration : 5000 });
                }
            });
        }
        */
    }

    const handleDelete = async () => {
        //DeletePreviewImage({link : link})
    }

    const handleSave = async () => {
        //setIsLoading(true);

        AddPreviewImage({
            file : uploadedFile,
            url : uploadedImageURL,
            useFileMethod : false,
            autoSyncAfterUpload : false,
            link : link,
            onSucess() {
                ToastMessage({ message : "Link Preview Image Added Successfully", type : "Success" });
            },
            onError() {
                
            }
        })
    }

    const checkValidImageUrl = async () => {
        const isValid = await IsValidImageUrl(uploadedImageURL);
        setIsImageUrlValid(isValid);
    }

    useEffect(() => {
        checkValidImageUrl();
    }, [uploadedImageURL])
    

    return (
        <Dialog open={open} onOpenChange={() => onClose(false)} modal={true}>
            <DialogContent className="select-none dark:bg-theme-bgSecondary rounded-xl max-h-[90%] space-y-4 overflow-y-scroll no-scrollbar" onContextMenu={(e) => e.preventDefault()}>
                <ErrorManager>
                <HStack justifyContent={"space-between"}>
                    <DialogTitle className="text-2xl text-center">{link.title}</DialogTitle>
                    <Button onClick={() => setOpenSettings(!openSettings)} variant={"ghost"} className="dark:text-neutral-500 dark:hover:text-white p-0 w-auto h-auto !ring-0 !outline-none focus-visible:border-4 focus-visible:!border-theme-borderNavigation">
                        <Settings />
                    </Button>
                </HStack>
                <ConditionalRender render={!openSettings}>
                    <Box className="w-full flex flex-col items-center justify-center space-y-4">
                        <ConditionalRender render={showImageProcessingStatus}>
                            <Center className="w-full p-4 bg-neutral-300 rounded-xl h-96">
                                <Text className="text-2xl text-black font-semibold">{imageProcessingStatus}</Text>
                            </Center>
                        </ConditionalRender>
                        <ConditionalRender render={!showImageProcessingStatus}>
                            <ContextMenu>
                                <ContextMenuTrigger className="w-full flex flex-col items-center justify-center">
                                    <ErrorManager>
                                        <Image
                                            src={linkPreviewImage.length > 2 ? linkPreviewImage : blankImage.src}
                                            alt="image not found"
                                            width={1920}
                                            height={1080}
                                            unoptimized
                                            quality={100}
                                            loading="lazy"
                                            className={`
                                                ${linkPreviewImage.length > 2 ? "w-full" : "w-6/12"} rounded-md 
                                                ${linkPreviewImage.length > 2 ? `border-4 ${isLoading ? 'dark:border-neutral-500' : 'dark:border-theme-primaryAccent shadow-lg shadow-theme-primaryAccent'}` : ""}
                                            `}
                                        />
                                    </ErrorManager>
                                </ContextMenuTrigger>
                                <ContextMenuContent className="dark:bg-black/30 backdrop-filter backdrop-blur-md py-2 rounded-xl">
                                    <ErrorManager>
                                        <ConditionalRender render={linkPreviewImage?.length > 1}>
                                            <ContextMenuItem onClick={() => {
                                                window.open(linkPreviewImage, "_blank")
                                            }} className="w-full dark:hover:bg-neutral-500/30 px-4 py-2">
                                                Open In New Tab
                                            </ContextMenuItem>
                                            <ContextMenuItem
                                                onClick={() => copyImageToClipboard(linkPreviewImage)}
                                                className="w-full dark:hover:bg-neutral-500/30 px-4 py-2"
                                            >
                                                Copy
                                            </ContextMenuItem>
                                        </ConditionalRender>
                                    </ErrorManager>
                                </ContextMenuContent>
                            </ContextMenu>
                        </ConditionalRender>
                    </Box>
                </ConditionalRender>

                <ConditionalRender render={openSettings}>
                    <Box className="w-full flex flex-col items-center justify-center space-y-4">
                        <ConditionalRender render={uploadedImageURL.length < 5}>
                            <Box className="flex items-center justify-center w-full">
                                <Label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-theme-primaryAccent/10 dark:bg-theme-bgSecondary hover:bg-gray-100 dark:border-theme-primaryAccent/50 dark:hover:border-gray-500`}>
                                    <Box className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload </span> 
                                            or drag and drop
                                        </p>
                                        <Text className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</Text>
                                    </Box>
                                    <Input
                                        id="dropzone-file"
                                        type="file"
                                        className="hidden" 
                                        accept="image/*"
                                        multiple={false}
                                        onChange={e => {
                                            setUploadedFile(e.target.files![0]);
                                        }}
                                    />
                                </Label>
                            </Box>
                        </ConditionalRender>

                        <Input
                            className={`w-full h-12 border !ring-0 !outline-none 
                                ${uploadedImageURL.length > 5 ? isImageUrlValid ? "border-theme-primaryAccent" : "border-red-500" : ""} rounded-lg`}
                            placeholder="Or past the url here"
                            onChange={(e) => setUploadedImageURL(e.target.value)} 
                        />

                        <VStack className="w-full space-y-4 p-4 rounded-lg border bg-theme-primaryAccent/5">
                            <Box className="w-full flex flex-row items-center justify-between">
                                <Text> Optimize Image For Less Bandwith </Text>
                                <Switch defaultChecked />
                            </Box>
                            <Box className="w-full flex flex-row items-center justify-between">
                                <Text> Cache Image For Faster Load {"(Reccomended)"} </Text>
                                <Switch defaultChecked />
                            </Box>
                        </VStack>
                        <Text className="text-neutral-500">Warning Uploading New Image Will Replace And Delete The Current Image</Text>
                    </Box>
                </ConditionalRender>

                <DialogFooter className="w-full flex flex-row items-center justify-end gap-4">
                    <Button disabled={isLoading || uploadedImageURL.length > 5 && !isImageUrlValid} onClick={() => handleSave()} variant={"ghost"} className={ButtonStyle}>
                        {isLoading ? "Processing..."  : uploadedFile !== undefined || uploadedImageURL.length > 5 || openSettings ? "Save" : "Visit"}
                    </Button>
                    <Button variant={"ghost"} className={ButtonStyle} onClick={() => handleDelete()}> Close </Button>
                </DialogFooter>
                </ErrorManager>
            </DialogContent>
        </Dialog>
    )
}
