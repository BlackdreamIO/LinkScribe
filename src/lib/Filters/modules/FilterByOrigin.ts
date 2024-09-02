import { ExtractDomain } from "@/helpers";
import { LinkScheme } from "@/scheme/Link";


/**
 * Filters an array of links based on the origin (domain) of the link URL.
 * 
 * @param links - An array of `LinkScheme` objects representing the links to filter.
 * @param query_from - The domain to filter the links by. If null or an empty string, all links are returned.
 * @returns The filtered array of links.
 */
export const FilterByOrigin = (links: LinkScheme[], query_from: string | null) => {
    if (!query_from || query_from.trim().length === 0 || query_from.toLocaleLowerCase() == "*" || query_from.toLocaleLowerCase() == "all") return links;
    return links.filter((link) => {
        const domain = ExtractDomain(link.url);
        return domain && domain.toLowerCase() === query_from.toLowerCase();
    });
};