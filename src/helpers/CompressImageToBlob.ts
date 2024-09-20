import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file and returns it as a Blob.
 * @param file The original image file to compress.
 * @param maxSizeMB The maximum size of the compressed image in MB (default is 1MB).
 * @param maxWidthOrHeight The maximum width or height of the compressed image (default is 1920px).
 * @returns A Promise that resolves to a compressed image Blob.
 */
export async function CompressImageToBlob(file: File, maxSizeMB: number = 1, maxWidthOrHeight: number = 1920 ): Promise<Blob> {
    try
    {
        // Set compression options
        const options = {
            maxSizeMB, // Maximum size of the compressed image
            maxWidthOrHeight, // Maximum width or height of the image
            useWebWorker: true, // Use web worker for processing
        };

        // Compress the image
        const compressedFile = await imageCompression(file, options);

        // Convert compressed file to Blob
        const compressedBlob = new Blob([compressedFile], { type: compressedFile.type });

        return compressedBlob;
    }
    catch (error) {
        console.error('Error compressing image:', error);
        throw new Error('Failed to compress image.');
    }
}
