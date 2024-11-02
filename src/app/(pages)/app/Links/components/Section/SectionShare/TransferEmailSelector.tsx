import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

import { Box, Text, VStack } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";

type TransferEmailSelectorProps = {
    selectedEmail : string,
    setSelectedEmail : React.Dispatch<React.SetStateAction<string>>;
}

export const TransferEmailSelector = ({ selectedEmail, setSelectedEmail } : TransferEmailSelectorProps) => {

    const [userEmails, setUserEmails] = useState<string[]>([]);
    const { user, isLoaded, isSignedIn } = useUser();

    useEffect(() => {
        if(user && isLoaded && isSignedIn && user.primaryEmailAddress) {
            const varifiedEmailAddresses = user.emailAddresses
                .filter(email => email.verification.status == "verified")
                .map((email) => email.emailAddress);
            setUserEmails(varifiedEmailAddresses);
        }
    }, [user, isLoaded, isSignedIn]);

    return (
        <VStack className="w-full space-y-4" >
            {
                (userEmails.filter(email => email != user?.primaryEmailAddress?.emailAddress) ?? []).map((email, i) => (
                    <Box
                        key={email}
                        tabIndex={1}
                        role="tab"
                        className={`w-full flex flex-row items-center justify-between py-2 px-4 rounded-lg outline-1 outline-double
                        dark:outline-neutral-700 focus-visible:outline-theme-borderNavigation
                        transition-all duration-100
                        ${email == selectedEmail ? "dark:bg-neutral-300 dark:text-black" : "dark:hover:bg-neutral-300 dark:hover:text-black focus-visible:text-black focus-visible:bg-neutral-300"}`}
                    >
                        <Text className="truncate">{email}</Text>
                        <Button
                            disabled={email !== selectedEmail && selectedEmail !== ""}
                            onClick={() => setSelectedEmail(email == selectedEmail ? "" : email)}
                            tabIndex={1}
                            className="dark:bg-theme-bgFifth dark:hover:bg-theme-textSecondary dark:hover:text-black dark:text-white px-4
                            focus-visible:!bg-theme-textSecondary focus-visible:!text-black">
                                { selectedEmail == email ? "Remove" : "Select" }
                        </Button>
                    </Box>
                ))
            }
        </VStack>
    )
}
