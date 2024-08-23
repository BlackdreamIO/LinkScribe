"use client"

import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from '@/components/ui/toast';


interface IToastMessage {
    message : string;
    description? : string;
    type : "Status" | "Error" | "Warning" | "Success";
    actionText? : string;
    action? : () => void;
}

export function useSendToastMessage ()
{
    const { toast } = useToast();

    const ToastMessage = ({message, description, type = "Status", action, actionText="Ok"} : IToastMessage) => {

        let className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary capitalize";
        switch (type) {
            case "Status":
                className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary";
                break;
            case "Success":
                className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-green-500"
                break;
            case "Error":
                className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-red-500"
                break;
            case "Warning":
                className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-yellow-400"
                break;
            default:
                className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary";    
                break;
        }

        toast({
            title: message,
            description: description,
            action : <ToastAction onClick={() => action?.()} altText={actionText}>{actionText}</ToastAction>,
            className : className
        })
    }

    return { ToastMessage };
}