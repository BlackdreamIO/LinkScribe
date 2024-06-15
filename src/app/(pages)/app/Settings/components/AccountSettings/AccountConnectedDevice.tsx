"use client"

import { useEffect, useState } from "react";
import { useClerk, useSession } from "@clerk/nextjs";
import { SessionWithActivitiesResource } from '@clerk/types';
import { useUser } from "@clerk/shared/react";

import Image, { StaticImageData } from "next/image";

import { X } from "lucide-react";
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

import windowsIcon from '../../../../../../../public/icons/windowsIcons.png';

type DeviceType = {
    deviceName : string;
    deviceLogo : StaticImageData;
    deviceIP : string;
    deviceCity : string;
    deviceCountry : string;
    isMobile : boolean;
    status : string;
    isPrimary : boolean;
}

export const AccountConnectedDevice = () => {
    
    const [connectedDeviceSessions, setConnectedDeviceSessions] = useState<SessionWithActivitiesResource[]>([]);

    const { user } = useClerk();

    useEffect(() => {
      
        const getSession = async () => {
            const response = await user?.getSessions();
            console.log();
            
            
            if(response) {
                setConnectedDeviceSessions(response);
            }
        }

        getSession();

    }, [connectedDeviceSessions])
    
    const DeviceCard = (props : DeviceType) => {

        const { deviceName, deviceLogo, deviceIP, deviceCity, deviceCountry, isMobile, status, isPrimary } = props;

        return (
            <Box className="w-[450px] p-4 dark:bg-black/35 rounded-xl border dark:border-neutral-700 space-y-4 relative flex flex-row shadow-lg dark:shadow-black">
                <Button disabled={isPrimary} variant={"ghost"} className="!bg-transparent !border-none p-0 absolute right-3 top-2 dark:text-neutral-500 dark:hover:text-red-500">
                    <X />
                </Button>
                <Flex flexDir={"column"} alignItems={"center"} justifyContent={"center"} >
                    <Image
                        src={deviceLogo.src}
                        alt="deviceLogo not found"
                        width={100}
                        height={100}
                        className="w-14 h-14"
                    />
                    <Text className=" text-lg mt-2">
                        {deviceName}
                    </Text>
                </Flex>
                <Box className="w-full flex flex-col items-center justify-center space-y-4">
                    <HStack className="w-full justify-center space-x-4">
                        <Text className="text-xs dark:text-neutral-200">
                            IP : {deviceIP}
                        </Text>
                        <Text className="text-xs dark:text-neutral-200">
                            CITY : {deviceCity}
                        </Text>
                    </HStack>
                    <HStack className="w-full justify-center space-x-4">
                        <Text className="text-xs dark:text-neutral-200">
                            COUNTRY : {deviceCountry}
                        </Text>
                        <Text className="text-xs dark:text-neutral-200">
                            ISMOBILE : {isMobile ? "True" : "False"}
                        </Text>
                    </HStack>
                    <HStack className="w-full justify-center mb-2">
                        <Text className="font-bold text-sm uppercase">
                            STATUS : <span className="text-green-500"> {status} </span>
                        </Text>
                    </HStack>
                </Box>
            </Box>    
        )
    }

    return (
        <Box className="w-full space-y-8">
            <Text className="font-bold flex flex-col items-start gap-6">
                Account Connected Device
            </Text>
            <Box className="w-full flex flex-row items-center justify-start gap-4">
                {
                    connectedDeviceSessions && connectedDeviceSessions.length > 0 ? (
                        connectedDeviceSessions.map((device, index) => (
                            <DeviceCard
                                deviceName={device.latestActivity.deviceType ?? "Unknown"}
                                deviceLogo={windowsIcon}
                                deviceCity={device.latestActivity.city ?? 'UNKNWON'}
                                deviceIP={device.latestActivity.ipAddress ?? "192.168.0.0.0>(default)"}
                                deviceCountry={device.latestActivity.country ?? 'UNKNWON'}
                                isMobile={device.latestActivity.isMobile ?? true}
                                status={device.status ?? 'revoked'}
                                isPrimary={device.status == "active"}
                                key={index}
                            />
                        ))
                    )
                    :
                    (
                        <Text>NO ACTIVE DEVICE DETECTED</Text>
                    )
                }
            </Box>
        </Box>
    )
}
