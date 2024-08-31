
/**
 * Extracts the domain name from a given URL.
 * 
 * @param url - The URL to extract the domain from.
 * @returns The domain name, or `null` if the URL is invalid or cannot be parsed.
 */
export const ExtractDomain = (url: string): string | null => {
    try
    {
        const parsedUrl = new URL(url);
      
        // Extract the hostname (e.g., www.youtube.com)
        const hostname = parsedUrl.hostname;
        
        // Split the hostname into parts (e.g., ['www', 'youtube', 'com'])
        const parts = hostname.split('.');
        
        // Return the second-to-last part (e.g., 'youtube')
        return parts.length > 1 ? parts[parts.length - 2] : null;
    }
    catch (error) {
        return null;
    }
};