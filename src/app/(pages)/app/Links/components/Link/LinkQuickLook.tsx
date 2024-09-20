"use client"

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useLinkController } from "@/context/LinkControllerProviders";
import { useSendToastMessage } from "@/hook/useSendToastMessage";

import { LinkScheme } from "@/scheme/Link";
import Image from "next/image";

import { GetCloudinaryImage } from "@/app/actions/cloudnary/getImage";

import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

import { Settings } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ConditionalRender } from "@/components/ui/conditionalRender";

import blankImage from "../../../../../../../public/images/blankImage.webp";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch"
import ErrorManager from "../../../components/ErrorHandler/ErrorManager";
import { CompressImageFromUrl } from "@/helpers/CompressImageAutoFromUrl";
import { DexieDB } from "@/database/dexie/DexieDB";
import { RefineEmail } from "@/helpers";
import { ICacheImage } from "@/scheme/CacheImage";
import { DexieGetCacheImage } from "@/database/dexie/helper/DexieCacheImages";


type LinkQuickLookProps = {
    link : LinkScheme;
    open : boolean;
    onClose : (value : boolean) => void;
}

const ButtonStyle = "w-56 dark:bg-theme-bgFifth dark:hover:bg-theme-bgThird border-[1px] dark:border-neutral-800 rounded-lg !ring-0 !outline-none focus-visible:border-4 focus-visible:!border-theme-borderNavigation";

export const LinkQuickLook = (props : LinkQuickLookProps) => {
    
    const { link, open, onClose } = props;

    const [openSettings, setOpenSettings] = useState(false);
    const [linkPreviewImage, setLinkPreviewImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [uploadedFile, setUploadedFile] = useState<File | undefined>(undefined);
    const [uploadedImageURL, setUploadedImageURL] = useState<string>("");
    const [isImageUrlValid, setIsImageUrlValid] = useState<boolean>(false);
    
    const { user, isSignedIn } = useUser();
    const { UpdateLink, AddPreviewImage, DeletePreviewImage } = useLinkController();
    const { ToastMessage } = useSendToastMessage();

    useEffect(() => {
        if(uploadedFile !== undefined) {
            setLinkPreviewImage(URL.createObjectURL(uploadedFile));
            setOpenSettings(false);
        }
    }, [uploadedFile]);

    useEffect(() => {
        if(!open) {
            if(linkPreviewImage !== link.image) {
                //console.log(linkPreviewImage)
            }
        }
        if(open) {
            GetLinkPreviewImageByID();
        }
    }, [open])
    
    const GetLinkPreviewImageByID = async () => {

        if(!link || !user) return;

        if(1+1 == 4 && link.image !== "" && link.image.includes("https")) return setLinkPreviewImage(link.image);

        else {

            const cacheImage = await DexieGetCacheImage({ id : link.id, email : RefineEmail(user?.primaryEmailAddress?.emailAddress ?? '') });

            if(cacheImage) {
                const imageURL = URL.createObjectURL(cacheImage);
                setLinkPreviewImage(imageURL);
                return;
            }

            else
            {
                console.log("Requesting Cloudinary Image...");
                const { imageURL, hasError } = await GetCloudinaryImage({ publicID : link.image });

                if(hasError) return;
                console.log("Sucessfully Fetched Image...");

                console.log("Running Compression...");
                const compressedOutput = await CompressImageFromUrl(imageURL);
                console.log("Compression Done...");

                const cacheImage : ICacheImage = {
                    id : link.id,
                    blob : compressedOutput,
                    ref : RefineEmail(user?.primaryEmailAddress?.emailAddress ?? ''),
                    url : imageURL
                }

                await DexieDB.cacheImages.add(cacheImage);

                setLinkPreviewImage(imageURL);
            }
        }
    }

    const handleDelete = async () => {
        //DeletePreviewImage({link : link})
    }

    const handleSave = () => {
        AddPreviewImage({
            file : uploadedFile,
            url : uploadedImageURL,
            useFileMethod : uploadedImageURL.length < 5,
            autoSyncAfterUpload : true,
            link : link,
            onSucess: () => onClose(true),
            onCallback: ({ loading }) => setIsLoading(loading),
            onError: () => onClose(false),
        })
    }

    async function checkImage(url : string)
    {
        try {
            const res = await fetch(url);
            const buff = await res.blob();
            
            const isImage = buff.type.startsWith('image/');
            setIsImageUrlValid(isImage);
        }
        catch (error) {
            setIsImageUrlValid(false);
        }
    }

    useEffect(() => {
        checkImage(uploadedImageURL);
    }, [uploadedImageURL])
    

    return (
        <Dialog open={open} onOpenChange={() => onClose(false)} modal={true}>
            <DialogContent className="dark:bg-theme-bgSecondary rounded-xl max-h-[90%] space-y-4 overflow-y-scroll no-scrollbar" onContextMenu={(e) => e.preventDefault()}>
                <ErrorManager>
                <HStack justifyContent={"space-between"}>
                    <DialogTitle className="text-2xl text-center">{link.title}</DialogTitle>
                    <Button onClick={() => setOpenSettings(!openSettings)} variant={"ghost"} className="dark:text-neutral-500 dark:hover:text-white p-0 w-auto h-auto !ring-0 !outline-none focus-visible:border-4 focus-visible:!border-theme-borderNavigation">
                        <Settings />
                    </Button>
                </HStack>
                <ConditionalRender render={!openSettings}>
                    <Box className="w-full flex flex-col items-center justify-center space-y-4">
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
                                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
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
