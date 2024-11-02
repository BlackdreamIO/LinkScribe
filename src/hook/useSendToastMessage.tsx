"use client"

import { toast } from "@/components/ui/use-toast";
import { ToastAction } from '@/components/ui/toast';
import { PlayAudio } from "@/lib/AudioPlayer";


interface IToastMessage {
    message : string;
    description? : string;
    duration? : number;
    type : "Status" | "Error" | "Warning" | "Success";
    actionText? : string;
    action? : () => void;
}

export function useSendToastMessage ()
{
    //const { toast } = useToast();

    const ToastMessage = ({message, description, type = "Status", action, actionText="Ok", duration=3000} : IToastMessage) => {

        let audioSrc = "../sound/notifications/info.wav";

        let className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary capitalize";
        switch (type) {
            case "Status":
                className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary";
                audioSrc = "../sound/notifications/info.wav";
                break;
            case "Success":
                audioSrc = "../sound/notifications/info.wav";
                className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-green-500"
                break;
            case "Error":
                audioSrc = "../sound/notifications/error.wav";
                className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-red-500"
                break;
            case "Warning":
                audioSrc = "../sound/notifications/error.wav";
                className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-yellow-400"
                break;
            default:
                className = "fixed bottom-5 right-2 w-6/12 max-sm:w-auto rounded-xl border-2 border-theme-borderSecondary";    
                break;
        }

        // PlayAudio({
        //     src : audioSrc,
        //     volume : 0.05,            
        // });

        toast({
            title: message,
            description: description,
            action : <ToastAction onClick={() => action?.()} altText={actionText}>{actionText}</ToastAction>,
            className : className,
            duration : duration
        })
    }

    return { ToastMessage };
}