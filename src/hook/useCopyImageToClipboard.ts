import { useSendToastMessage } from './useSendToastMessage';

export const useCopyImageToClipboard = (): [(imageUrl: string) => void] => {

    const { ToastMessage } = useSendToastMessage();

    const copyImageToClipboard = async (imageUrl: string) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();

            const item = new ClipboardItem({
                [blob.type]: blob,
            });

            await navigator.clipboard.write([item]);
            ToastMessage({ message : "Copied To Clipboard", type : "Status", duration : 1000 });

        }
        catch (error) {
            ToastMessage({ message : "Failed to copy image to clipboard", type : "Warning", duration : 1000 });
            console.error('Failed to copy image to clipboard:', error);
        }

    }

    return [copyImageToClipboard];
}
