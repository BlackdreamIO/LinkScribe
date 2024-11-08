import imageCompression, { Options } from 'browser-image-compression';

/**
 * Fetches an image from a URL and converts it to a Blob.
 * @param imageUrl The URL of the image to fetch.
 * @returns A Promise that resolves to a Blob of the fetched image.
 */
async function fetchImageAsBlob(imageUrl: string): Promise<Blob> {
  try {
    console.log(imageUrl)
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch image from URL');
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error fetching image:', error);
    throw new Error('Failed to fetch image.');
  }
}

/**
 * Compresses an image from a URL and returns it as a compressed Blob.
 * @param imageUrl The URL of the image to compress.
 * @param maxSizeMB The maximum size of the compressed image in MB (default is 1MB).
 * @param maxWidthOrHeight The maximum width or height of the compressed image (default is 1920px).
 * @returns A Promise that resolves to a compressed image Blob.
 */
export async function CompressImageFromUrl(
  imageUrl: string,
  maxSizeMB: number = 1,
  maxWidthOrHeight: number = 1920
): Promise<Blob> {
  try {
    // Fetch the image from URL and convert it to a Blob
    const imageBlob = await fetchImageAsBlob(imageUrl);
    console.log(imageBlob)

    // Convert Blob to File
    const file = new File([imageBlob], 'image.jpg', { type: imageBlob.type });

    // Set compression options
    const options : Options = {
      maxSizeMB, // Maximum size of the compressed image
      maxWidthOrHeight, // Maximum width or height of the image
      useWebWorker: true, // Use web worker for processing
    };

    // Compress the image file
    const compressedFile = await imageCompression(file, options);

    // Convert compressed file to Blob
    const compressedBlob = new Blob([compressedFile], { type: compressedFile.type });

    return compressedBlob;
  } catch (error) {
    console.error('Error compressing image: <CompressImageFromUrl> : ', error);
    throw new Error('Failed to compress image.');
  }
}


export async function CompressFromBlob(file: Blob, maxSizeMB: number = 1, maxWidthOrHeight: number = 1920 ): Promise<Blob> {
    try
    {
        // Set compression options
        const options : Options = {
            maxSizeMB, // Maximum size of the compressed image
            maxWidthOrHeight, // Maximum width or height of the image
            useWebWorker: true, // Use web worker for processing
        };

        const fileBlob = new File([file], 'filename', { type: file.type });

        // Compress the image file
        const compressedFile = await imageCompression(fileBlob, options);

        // Convert compressed file to Blob
        const compressedBlob = new Blob([compressedFile], { type: compressedFile.type });

        return compressedBlob;
    }
    catch (error) {
        console.error('Error compressing image: <CompressFromBlob> : ', error);
        throw new Error('Failed to compress image.');
    }
  
}