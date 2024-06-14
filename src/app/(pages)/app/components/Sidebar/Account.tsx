'use client'

import { useUser, useSession } from "@clerk/nextjs";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton"
import { Box, Text } from "@chakra-ui/react";

export const Account = ({ minimizeMode } : { minimizeMode : boolean }) => {

    const { user, isSignedIn, isLoaded } = useUser();

    return (
        <Box className="w-full">
            <Box className={`flex flex-row items-center gap-4 dark:bg-opacity-50 
                w-full rounded-3xl focus-visible:!outline-blue-500 !ring-0 !border-none outline-none transition-all duration-150
                ${minimizeMode ? "p-0" : "py-2 px-4"}
                ${minimizeMode ? "dark:bg-transparent justify-center" : "dark:bg-[mediumspringgreen]"}`
            }>
                {
                    user?.hasImage && isLoaded ? (
                        <Image
                            src={user.imageUrl}
                            alt=""
                            unoptimized
                            width={100}
                            height={100}
                            className={`w-10 h-10 rounded-full border-2 ${minimizeMode ? "border-[mediumspringgreen]" : "border-transparent "}`}
                        />
                    )
                    :
                    (
                        <Skeleton className="w-10 h-10 rounded-full" />
                    )
                }
                <Box className={`flex-grow flex-col items-start justify-center overflow-hidden ${minimizeMode ? "hidden" : "flex"}`}>
                    {
                        isSignedIn && isLoaded ? (
                            <>
                                {
                                    user && user.username ? (
                                        <Text fontWeight={"bold"} className="truncate">{user.username.replaceAll("_", " ")}</Text>
                                    )
                                    :
                                    <Text fontWeight={"bold"} className="truncate">{`${user.firstName} ${user.lastName}`}</Text>
                                }
                                <Text className="truncate mr-3">{user.primaryEmailAddress?.emailAddress}</Text>
                            </>
                        )
                        :
                        (
                            <>
                                {/* <Text>NO USER FOUND</Text> */}
                                <Skeleton className="w-11/12 h-2 mb-2" />
                                <Skeleton className="w-11/12 h-2" />
                            </>
                        )
                    }
                </Box>
            </Box>
        </Box>
    )
}
