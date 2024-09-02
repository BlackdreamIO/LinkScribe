
/**

 * @perameter query - The search query.
 * @perameter key - The key to query to look for and for its value for, e.g. "from".
 * @returns string or null if not found.
 * 
 * @input : ...text `from:<origin_name>` ...text
 *@example: 'const origin = ParseSearchQuery(query, "from");'
 */
export const ParseSearchQuery = (query: string, key: string): string | null => {
    // Regular expression to match "from:<value>"
    const fromRegex = new RegExp(`${key}:<([^>]+)>`);

    // Execute the regex on the query string
    const match = query.match(fromRegex);

    // If there's a match, return the value; otherwise, return null
    return match ? match[1] : null;
};