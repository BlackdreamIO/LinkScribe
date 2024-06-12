"use client"

import { Suspense, useState } from "react";
import ErrorBoundary from "./ErrorBoundry";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";

interface ErrorManager {
    enableRetry? : boolean;
    children : React.ReactNode;
    useCustomTitle? : boolean;
    customTitle? : string;
    useCustomErrorText? : boolean;
    customErrorText? : string;
}

export default function ErrorManager(args : ErrorManager)
{
    const { children, customErrorText, enableRetry, useCustomErrorText, customTitle, useCustomTitle } = args;

    const [errorMessage, setErrorMessage] = useState("");
    const [errorInfo, setErrorInfo] = useState("");

    const ErrorSkeleton = () => {
        return (
            <Accordion type="single" collapsible className="w-full decoration-transparent !bg-transparent !border-none">
                <AccordionItem value="item-1" className="dark:border-neutral-700 rounded-lg w-full px-4 py-2 space-y-4 !border-none">
                    <Flex alignItems={"center"} justifyContent={"space-between"}>
                        <AccordionTrigger className="text-center dark:text-yellow-300 font-extrabold text-xl !no-underline flex-grow flex !border-none">
                            {
                                useCustomTitle ? customTitle : "ERROR WHILE RENDERING THIS COMPONENT"
                            }
                        </AccordionTrigger>
                        <Button>TRY RERENDER</Button>
                    </Flex>
                    <AccordionContent className="dark:bg-red-500 border dark:border-neutral-700 rounded-lg w-full px-4 py-2 space-y-4">
                        <p>
                            {
                                useCustomErrorText ? customErrorText : errorMessage
                            }
                        </p>
                        <p className="text-center">{errorInfo}</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        )
    }

    const handleErrorCaught = (error : any, info : any) => {
        setErrorMessage(typeof(error) == "string" ? error : JSON.stringify(error));
        setErrorInfo(typeof(info) == "string" ? error : JSON.stringify(info));
    }

    return (
        <ErrorBoundary onErrorCaught={handleErrorCaught} fallback={<ErrorSkeleton />}>
            {children}
        </ErrorBoundary>
    )
}
