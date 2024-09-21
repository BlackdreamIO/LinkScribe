import { useSendToastMessage } from "./useSendToastMessage";

export const useCopyToClipboard = () : [(text: string) => void] => {

    const { ToastMessage } = useSendToastMessage();

    async function copyToClipboard(textToCopy : string) {
        if (navigator?.clipboard?.writeText) {
            ToastMessage({ message : "Copied To Clipboard", type : "Status", duration : 1000 })
            return navigator.clipboard.writeText(textToCopy);
        }
        ToastMessage({ message : "The Clipboard API is not available Try Different Browser", type : "Warning", duration : 1000 })
        return Promise.reject('The Clipboard API is not available.');
    }      

    return [copyToClipboard];
}
