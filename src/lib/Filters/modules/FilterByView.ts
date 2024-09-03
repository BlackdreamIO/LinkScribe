import { LinkScheme } from "@/scheme/Link";

/**
 * Filter the given array of links by the given query_view.
 *
 * @param links - An array of `LinkScheme` objects representing the links to filter.
 * @param query_view - A string indicating how to filter the links. Can be "ascending", "descending", or "disabled".
 * @returns An array of `LinkScheme` objects that match the provided query.
 */
export const FilterByView = (links: LinkScheme[], query_view: string | null) : LinkScheme[] => {
    if (!query_view || query_view == "" || query_view === "disabled") return links; // Return original if query is invalid or disabled

    const sortedLinks = [...links];

    if (query_view === "descending" || query_view === "1") {
        // descending
        return sortedLinks.sort((a, b) => b.visitCount - a.visitCount);
    }

    if (query_view === "ascending" || query_view === "0") {
        // ascending
        return sortedLinks.sort((a, b) => a.visitCount - b.visitCount);
    }

    return links;
}
