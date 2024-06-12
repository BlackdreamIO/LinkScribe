"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Text, Box, Divider } from "@chakra-ui/react"
import { Skeleton } from "@/components/ui/skeleton";


export const AccountAdvance = () => {
    
    const [openDialog, setOpenDialog] = useState(false);

    const [currentConfirmationText, setCurrentConfirmationText] = useState("");
    const [canDelete, setCanDelete] = useState(false);

    const { user, isSignedIn } = useUser();
    const router = useRouter();

    useEffect(() => {
        if(currentConfirmationText.toLocaleLowerCase() == "delete") {
            setCanDelete(true);
        }
        else {
            setCanDelete(false);
        }
    }, [currentConfirmationText])
    
    
    const handleDeleteAccount = async () => {
      
        if(!user || !canDelete) {
            return;
        }
        try 
        {
            await user.delete();
            router.push("/");
        } 
        catch (error) 
        {

        }
    }
      

    return (
        <Box className="w-full space-y-8">
            <Box>
                <Text className="font-bold flex flex-col items-start gap-6">
                    Danger Zone
                </Text>
                <Divider className="!bg-red-500 h-[1px] my-2"/>
            </Box>
            {
                isSignedIn ? (
                    <>
                        <Button onClick={() => setOpenDialog(true)} variant={"destructive"} className="w-full">DELETE THIS ACCOUNT</Button>
                        <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
                            <DialogContent className="dark:bg-theme-bgFourth">
                                <Text className="text-xl">Please Enter <span className="!text-yellow-400"> "Delete" </span> In Order To Delete This Account</Text>
                                <Input 
                                    className={`w-full border-2 ${canDelete ? "!border-green-400" : "!border-yellow-600"}`}
                                    onChange={(e) => setCurrentConfirmationText(e.target.value)} 
                                />
                                <DialogFooter className="flex flex-row items-center justify-end gap-4">
                                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                                    <Button onClick={() => handleDeleteAccount()}>Submit</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                )
                :
                (
                    <Skeleton className="w-full h-10 animate-none" />
                )
            }
        </Box>
    )
}
