"use client"

import { useClerk, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

import { AtSign, ImageIcon, Trash } from "lucide-react";
import { Flex, Text, VStack } from "@chakra-ui/react";
import { Button, buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ToastAction } from "@/components/ui/toast";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";

const ProfileButtonStyle = `w-full h-14 rounded-xl border
        dark:bg-theme-bgFourth dark:hover:bg-theme-bgThird
        dark:text-neutral-500 dark:hover:text-theme-textSecondary 
        dark:focus-visible:bg-theme-bgThird dark:focus-visible:text-theme-textSecondary 
        focus-visible:!outline-blue-500 !ring-0
        flex items-center justify-start gap-2 pointer-events-auto
    `;

const ProfileButtonLoadingStyle = `w-full h-14 rounded-xl
    dark:bg-theme-bgFourth dark:hover:bg-theme-bgThird
    dark:text-neutral-500 dark:hover:text-theme-textSecondary 
    dark:focus-visible:bg-theme-bgThird dark:focus-visible:text-theme-textSecondary 
    focus-visible:!outline-blue-500 !ring-0
    flex items-center justify-start gap-2
    border-2 border-theme-borderSecondary pointer-events-none
`;


export const AccountUpdates = () => {

    const [currentAddEmail, setCurrentAddEmail] = useState<string>("");

    const [updateState, setUpdateState] = useState<"ProfilePicture" | "AddEmail" | "RemoveEmail">("ProfilePicture");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const { isSignedIn, user } = useUser();
    const { toast } = useToast();

    const handleProfileUpdate = async (e : ChangeEvent<HTMLInputElement>) => {
        if(e.target && e.target.files && e.target.files[0]) 
        {
            const fileType = e.target.files[0].type;
            if (fileType === "image/png" || fileType === "image/jpeg" || fileType === "image/jpg" || fileType === "image/jfif" || fileType === "image/webp") 
            {
                if(user) 
                {
                    try 
                    {
                        setUpdateState("ProfilePicture");
                        setIsLoading(true);
                        await user.setProfileImage({file : e.target.files[0]})
                            .then((response) => {
                                toast({
                                    title: "Updated Profile Picture",
                                    description: "AUTHENTICATION ERROR",
                                    action : <ToastAction altText="Try again">Try Again</ToastAction>,
                                    className : "fixed bottom-5 right-2 w-6/12 rounded-xl"
                                });
                                setIsLoading(false);
                            })
                            .catch((error) => {
                                toast({
                                    title: "Failed to update primary email address: check console for more !",
                                    description: "AUTHENTICATION ERROR",
                                    variant : "destructive",
                                    action : <ToastAction altText="Try again">Try Again</ToastAction>,
                                    className : "fixed bottom-5 right-2 w-6/12 rounded-xl"
                                });
                                setIsLoading(false);
                            })
                    } 
                    catch (error) {
                        toast({
                            title: "Failed to update profile picture: check console for more !",
                            description: "USER ERROR",
                            variant : "destructive",
                            action : <ToastAction altText="Try again">Try Again</ToastAction>,
                            className : "fixed bottom-5 right-2 w-6/12 rounded-xl"
                        });
                        setIsLoading(false);
                    }
                }    
            } 
            else 
            {
                console.log("Invalid file type");
                toast({
                    title : "Invalid file type",
                    description : "supported formats : [png,jpeg,jpg,jfif,webp]",
                    className : "fixed bottom-5 right-2 w-6/12 dark:bg-theme-bgFourth border-2 !border-yellow-500 rounded-xl",
                    duration : 5000,
                    action : <ToastAction altText="Ok">Ok</ToastAction>,
                })
            }
        }
    }

    const handleAddEmail = async () => {
        function isValidEmail(email : string) 
        {
            if(email != '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(email);
            }
            return false;
        }
        try 
        {
            if(isValidEmail(currentAddEmail)) 
            {
                console.log(currentAddEmail);
                
                await user?.createEmailAddress({ email : currentAddEmail})
                    .then((response) => {
                        toast({
                            title: `Created New Email : ${currentAddEmail}`,
                            description: "AUTHENTICATION STATUS",
                            action : <ToastAction altText="ok">Ok</ToastAction>,
                            className : "fixed bottom-5 right-2 w-6/12 rounded-xl border-2 border-theme-borderSecondary"
                        });
                    })
                    .catch((error) => {
                        toast({
                            title: "Failed To Create New Email",
                            description: "AUTHENTICATION ERROR",
                            action : <ToastAction altText="Try again">Try Again</ToastAction>,
                            className : "fixed bottom-5 right-2 w-6/12 rounded-xl"
                        });
                        console.log("Failed To Create New Email : ", error)
                    })
                //router.refresh();
            }   
        } 
        catch (error) {
            toast({
                title: "Failed To Create New Email",
                description: "AUTHENTICATION ERROR",
                variant : "destructive",
                action : <ToastAction altText="Try again">Try Again</ToastAction>,
                className : "fixed bottom-5 right-2 w-6/12 rounded-xl"
            });
        }
    }

    return (
        <VStack justifyContent={"start"} alignItems={"start"} className="w-full">
            <Button disabled className={ProfileButtonStyle}>Update Profile</Button>
            <Button className={`${updateState == "ProfilePicture" && isLoading ? ProfileButtonLoadingStyle : ProfileButtonStyle} relative`}> 
                <ImageIcon /> 
                {updateState == "ProfilePicture" && isLoading ? "Loading..." : "Change Profile Picture"}
                <input 
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/jfif"
                    className="absolute w-full h-12 opacity-0" 
                    onChange={(e : ChangeEvent<HTMLInputElement>) => handleProfileUpdate(e)}
                />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger className={`${ProfileButtonStyle} px-4`}>
                    <AtSign /> Add Email
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="start" className="w-96 dark:bg-theme-bgSecondary !bg-opacity-5 backdrop-filter !backdrop-blur-md py-2 border-2 dark:border-neutral-700 p-4 space-y-4">
                    <Input 
                        type="email"
                        required
                        className="w-full dark:bg-theme-bgSecondary "
                        value={currentAddEmail}
                        onChange={(e) => setCurrentAddEmail(e.target.value)}
                    />
                    <Flex flexDir={"row"} alignItems={"center"} justifyContent={"end"} className="space-x-4">
                        <DropdownMenuItem 
                            className={`${ProfileButtonStyle} h-auto rounded-lg`}
                            >
                                Cancell
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onClick={() => handleAddEmail()}
                            className={`${ProfileButtonStyle} h-auto rounded-lg`}>
                                Add
                        </DropdownMenuItem>
                    </Flex>
                    <Text className="dark:text-yellow-300 font-mono">Sometime After Adding New Email The Router Might Not Reload ItSelf So In Thos Case You Have To Do Manual Reload</Text>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button className={ProfileButtonStyle}> <Trash /> Remove Email</Button>
        </VStack>
    )
}
