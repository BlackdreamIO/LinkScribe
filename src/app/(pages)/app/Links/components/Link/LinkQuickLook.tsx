"use client"

import { useEffect, useState } from "react";
import { LinkScheme } from "@/scheme/Link";
import Image from "next/image";

import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Box, HStack, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

import { Settings } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ConditionalRender } from "@/components/ui/conditionalRender";

import blankImage from "../../../../../../../public/images/blankImage.webp";
import { Label } from "@/components/ui/label";

import { useLinkController } from "@/context/LinkControllerProviders";
import { GetCloudinaryImage } from "@/app/actions/cloudnary/getImage";
import { UploadImageToCloudinary } from "@/app/actions/cloudnary/uploadImage";
import { useUser } from "@clerk/nextjs";
import { RefineEmail } from "@/helpers/NormalizeEmail";
import { WhatTheFuck } from "@/app/actions/cloudnary/whatthefuck";
import { useCloudinary } from "@/hook/useCloudinary";

type LinkQuickLookProps = {
    link : LinkScheme;
    open : boolean;
    onClose : (value : boolean) => void;
}

const ButtonStyle = "w-56 dark:bg-theme-bgFifth dark:hover:bg-theme-bgThird border-[1px] dark:border-neutral-800 rounded-lg !ring-0 !outline-none focus-visible:border-4 focus-visible:!border-theme-borderNavigation";

export const LinkQuickLook = (props : LinkQuickLookProps) => {
    
    const { link, open, onClose } = props;

    const [openSettings, setOpenSettings] = useState(false);
    const [linkPreviewImage, setLinkPreviewImage] = useState(link.image);

    const [uploadedFile, setUploadedFile] = useState<File | undefined>(undefined);
    
    const { user, isSignedIn } = useUser();
    const { UpdateLink } = useLinkController();
    //const { GetImageURL, UploadImageToCloudinary } = useCloudinary();

    useEffect(() => {
        if(uploadedFile !== undefined) {
            setLinkPreviewImage(URL.createObjectURL(uploadedFile));
            setOpenSettings(false);
        }

    }, [uploadedFile]);
    
    function FileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            // Check if window is defined (browser environment)
            if (typeof window !== 'undefined')
            { 
                const reader = new FileReader();
                reader.readAsDataURL(file);
    
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = (error) => reject(error);
            }
            else {
                reject(new Error('FileReader is not supported in this environment'));
            }
        });
    }

    const handleClick = async() => {
        if(user && isSignedIn && user.primaryEmailAddress) {
            if(uploadedFile !== undefined) {

                const convertedBase64 = await FileToBase64(uploadedFile);

                const formData = new FormData();
                formData.append('base64', convertedBase64);
                formData.append('fileName', link.id);
                formData.append('folder', RefineEmail(user.primaryEmailAddress.emailAddress));

                try {
                    // const { publicID, imageURL, error } = await UploadImageToCloudinary(formData);
    
                    const { publicID, imageURL, error } = await UploadImageToCloudinary({
                        file : convertedBase64,
                        filename : link.id,
                        folder : RefineEmail(user.primaryEmailAddress.emailAddress)
                    });

                    if(error) {
                        console.error(error);
                        return;
                    }

                    UpdateLink({
                        currentLink : link,
                        sectionID : link.ref,
                        linkData : {
                            ...link,
                            image : imageURL,
                        }
                    })  
                }
                catch (error) {
                    console.log(error);
                }
            }
            else {
                // code to enter the site
                console.log("uploadedFile not found");
            }
        }
    }
    

    return (
        <Dialog open={open} onOpenChange={onClose} modal={true}>
            <DialogContent className="dark:bg-theme-bgSecondary rounded-xl max-h-[90%] space-y-4 overflow-y-scroll no-scrollbar" onContextMenu={(e) => e.preventDefault()}>
                <HStack justifyContent={"space-between"}>
                    <DialogTitle className="text-2xl text-center">{link.title}</DialogTitle>
                    <Button onClick={() => setOpenSettings(!openSettings)} variant={"ghost"} className="dark:text-neutral-500 dark:hover:text-white p-0 w-auto h-auto !ring-0 !outline-none focus-visible:border-4 focus-visible:!border-theme-borderNavigation">
                        <Settings />
                    </Button>
                </HStack>
                <ConditionalRender render={!openSettings}>
                    <Box className="w-full flex flex-row items-center justify-center space-y-4">
                        <Image
                            src={linkPreviewImage.length > 2 ? linkPreviewImage : blankImage.src}
                            alt="image not found"
                            width={1920}
                            height={1080}
                            unoptimized
                            quality={100}
                            className={`
                                ${linkPreviewImage.length > 2 ? "w-full" : "w-6/12"} rounded-md 
                                ${linkPreviewImage.length > 2 ? "border-4 dark:border-theme-primaryAccent shadow-lg shadow-theme-primaryAccent" : ""}
                            `}
                        />
                    </Box>
                </ConditionalRender>

                <ConditionalRender render={openSettings}>
                    <Box className="w-full flex flex-row items-center justify-center space-y-4">
                        <Box className="flex items-center justify-center w-full">
                            <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-theme-primaryAccent/10 dark:bg-theme-bgSecondary hover:bg-gray-100 dark:border-theme-primaryAccent/50 dark:hover:border-gray-500">
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
                                    onChange={e => setUploadedFile(e.target.files![0])}
                                />
                            </Label>
                        </Box> 
                    </Box>
                </ConditionalRender>

                <DialogFooter className="w-full flex flex-row items-center justify-end gap-4">
                    <Button onClick={() => handleClick()} variant={"ghost"} className={ButtonStyle}>
                        {uploadedFile !== undefined ? "Save" : "Visit"}
                    </Button>
                    <Button variant={"ghost"} className={ButtonStyle}> Close </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
