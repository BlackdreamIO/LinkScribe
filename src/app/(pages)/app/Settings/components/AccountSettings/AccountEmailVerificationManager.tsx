"use client"

import {useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@clerk/nextjs";
import { EmailAddressResource } from "@clerk/types";
import { ToastAction } from "@/components/ui/toast";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

import { Info } from "lucide-react";
import { Box, Text, VStack } from "@chakra-ui/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import ErrorManager from "../../../components/ErrorHandler/ErrorManager";


const ButtonStyle = `w-full h-14 rounded-xl border
        dark:bg-theme-bgFourth dark:hover:bg-theme-bgThird
        dark:text-neutral-500 dark:hover:text-theme-textSecondary 
        dark:focus-visible:bg-theme-bgThird dark:focus-visible:text-theme-textSecondary 
        focus-visible:!outline-blue-500 !ring-0
        flex items-center justify-start gap-2 pointer-events-auto
    `;

const InputOTPSlotStyle = `dark:text-theme-textSecondary text-2xl w-20 h-20 !ring-theme-textSecondary !outline-none`;

export const AccountEmailVerificationManager = () => {

    const [currentUnVerifiedEmail, setCurrentUnVerifiedEmail] = useState<EmailAddressResource>();
    const [openVerificationCodeDialog, setOpenVerificationCodeDialog] = useState(false);
    const [isVerificationLoading, setIsVerificationLoading] = useState(false);

    const { toast } = useToast();

    const { isSignedIn, user } = useUser();

    const handleVerifyEmail = async (currentEmail : EmailAddressResource, eIndex : number) => {
        try 
        {
            if(currentEmail.verification.status !== "verified") 
            {
                setOpenVerificationCodeDialog(true);
                await currentEmail.prepareVerification({ strategy : "email_code" })
                .then((response) => {
                    if(response) {
                        setCurrentUnVerifiedEmail(currentEmail)
                        toast({
                            title: "Verification Code Has Been Send ",
                            description: "VEIRFICATION",
                            action : <ToastAction altText="Ok">Ok</ToastAction>,
                            className : "fixed bottom-5 right-2 w-6/12 rounded-xl border-2 border-theme-borderSecondary"
                        });
                    }
                    
                })
                .catch((error) => {
                    toast({
                        title: "Failed To Send Verification Code",
                        description: String(error),
                        action : <ToastAction altText="Ok">Ok</ToastAction>,
                        className : "fixed bottom-5 right-2 w-6/12 rounded-xl border-2 border-yellow-400"
                    })
                })
            }
        } 
        catch (error) 
        {
            toast({
                title: "Failed To Attempt Verify Email",
                description: "AUTHENTICATION ERROR",
                variant : "destructive",
                action : <ToastAction altText="Ok">Ok</ToastAction>,
                className : "fixed bottom-5 right-2 w-6/12 rounded-xl"
            })
        }
    }


    const handleSubmitVerificationCode = async (code : number) => {
        try 
        {
            setIsVerificationLoading(true);
            await currentUnVerifiedEmail?.attemptVerification({code : String(code)})
            .then((response) => {
                toast({
                    title: "Verification Completed",
                    action : <ToastAction altText="Ok">Ok</ToastAction>,
                    className : "fixed bottom-5 right-2 w-6/12 rounded-xl border-2 border-theme-borderSecondary",
                    duration : 5000
                });
                setIsVerificationLoading(false);
            })
            .catch((error) => {
                const errorMessage = error?.errors?.[0]?.longMessage || 
                    error?.message || "Unknown error : could be [Internal Server Error] apolozize for that we will soon fix this problem please stay by";
                toast({
                    title: "Verification Failed",
                    description: typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage),
                    action: <ToastAction altText="Ok">Ok</ToastAction>,
                    className: "fixed bottom-5 right-2 w-6/12 rounded-xl border-2 border-yellow-400",
                    duration : 10000
                });
            })
        } 
        catch (error) {
            toast({
                title: "Verification Failed",
                description: "VERIFICATION ERROR",
                variant : "destructive",
                action : <ToastAction altText="Ok">Ok</ToastAction>,
                className : "fixed bottom-5 right-2 w-6/12 rounded-xl"
            })
        }
    }

    return (
        <Box className="w-full space-y-8">
            <Text className="font-bold flex flow-row items-center gap-2">
                Email Verification Overview
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className={`${ButtonStyle} !bg-transparent h-auto w-auto !border-none`}>
                                <Info />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className="dark:bg-theme-bgPrimary max-w-96 border-2 border-theme-borderSecondary">
                            <Text className="dark:text-neutral-300 text-lg font-normal text-start">
                                Please note that using multiple email accounts will create multiple sessions, 
                                which is currently not supported by the app. Additionally, you can only select a primary email if the email is verified.
                            </Text>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </Text>
            <VStack>
                <ErrorManager>
                        {
                            isSignedIn ? (
                                user.emailAddresses.map((email, eIndex) => (
                                    <Box key={email.id} className="w-full dark:bg-theme-bgFifth flex flex-row items-center justify-between p-2 h-12 rounded-xl border space-x-3">
                                        <Text className="truncate underline underline-offset-2 dark:decoration-neutral-400 max-sm:text-xs">{email.emailAddress}</Text>
                                        <Text 
                                            className={` text-start uppercase max-sm:text-xs
                                                ${email.verification.status == "verified" ? "!text-theme-textSecondary" : "text-neutral-600"}`
                                            }>
                                                {email.verification.status == "verified" ? "verified" : "unverified"}
                                        </Text>
                                        <Button 
                                            disabled={email.verification.status == "verified"} 
                                            className={`${ButtonStyle} w-auto h-auto`}
                                            onClick={() => handleVerifyEmail(email, eIndex)}
                                        >
                                                Verify
                                        </Button>
                                    </Box>
                                ))
                            )
                            :
                            (
                                Array(3).fill('').map((x, i) => (
                                    <Skeleton className="animate-none w-full h-10" key={i} />
                                ))
                            )
                        }
                </ErrorManager>
            </VStack>
            <Dialog open={openVerificationCodeDialog}>
                <DialogContent className="sm:max-w-md dark:bg-theme-bgFourth rounded-xl">
                    <DialogHeader className="space-y-5">
                        <DialogTitle className="text-xl">Enter 7 Digit Code To Complete Verification</DialogTitle>
                        <DialogDescription className="text-lg font-normal">
                            A verification code has been sent to {currentUnVerifiedEmail?.emailAddress}. Please check your email and enter the code.
                        </DialogDescription>
                    </DialogHeader>
                    <Box className="w-full flex justify-center items-center">
                        <ErrorManager>
                            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} onComplete={(code) => handleSubmitVerificationCode(code)}>
                                <InputOTPGroup>
                                    <InputOTPSlot className={InputOTPSlotStyle} index={0} />
                                    <InputOTPSlot className={InputOTPSlotStyle} index={1} />
                                    <InputOTPSlot className={InputOTPSlotStyle} index={2} />
                                </InputOTPGroup>
                                <InputOTPGroup>
                                    <InputOTPSlot className={InputOTPSlotStyle} index={3} />
                                    <InputOTPSlot className={InputOTPSlotStyle} index={4} />
                                    <InputOTPSlot className={InputOTPSlotStyle} index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </ErrorManager>
                    </Box>
                    <Box className="w-full space-y-2 mt-5">
                        <Button 
                            disabled={false}
                            onClick={() => setOpenVerificationCodeDialog(false)}
                            className={`${ButtonStyle} border-none justify-center ${!isVerificationLoading ? 'hidden' : 'flex'}`}>
                                Force Close
                        </Button>
                        <Button 
                            disabled={isVerificationLoading}
                            onClick={() => setOpenVerificationCodeDialog(false)}
                            className={`${ButtonStyle} justify-center dark:disabled:text-white dark:border-transparent border-transparent dark:disabled:border-neutral-400`}>
                                {isVerificationLoading ? "Verifying" : "Continue"}
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    )
}
