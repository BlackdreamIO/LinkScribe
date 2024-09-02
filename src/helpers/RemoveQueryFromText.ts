
/**
 * Removes any query parameters from the provided input string.
 *
 * @param input - The input string to remove query parameters from.
 * @param keys - An optional array of query parameter keys to remove. Defaults to ["from", "date"].
 * @returns The input string with all matched query parameters removed.
 */
export const RemoveQueryFromText = (input: string, keys: string[] = ["from", "date"]): string => {
    // Create a regular expression pattern to match all keys provided
    const regexPattern = keys.map((key) => `${key}:<[^>]+>`).join("|");
    
    // Create a new RegExp object using the combined pattern
    const regex = new RegExp(regexPattern, "g");
    
    // Remove all matched query parts and trim the result
    const result = input.replace(regex, "").trim();
    
    return result;
};