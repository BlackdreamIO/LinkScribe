/**
 * Converts a file to a base64 encoded string.
 *
 * @param {File} file - The file to be converted.
 * @return {Promise<string>} A promise that resolves with the base64 encoded string.
 */
export function FileToBase64(file: File): Promise<string>
{
    return new Promise((resolve, reject) => {
        // Check if window is defined (browser environment)
        if (typeof window !== 'undefined')
        { 
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        }
        else {
            reject(new Error('FileReader is not supported in this environment'));
        }
    });
}