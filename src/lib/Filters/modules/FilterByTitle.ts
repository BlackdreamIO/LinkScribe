import { LinkScheme } from "@/scheme/Link";

/**
 * Filters an array of links based on the provided title.
 * 
 * @param links - An array of links to filter.
 * @param title - The title to filter the links by.
 * @returns The filtered array of links.
 */
export const FilterByTitle = (links: LinkScheme[], title: string) => {
    if (title.trim().length === 0) return links;
        return links.filter((link) =>
        link.title.toLowerCase().includes(title.toLowerCase())
    );
};