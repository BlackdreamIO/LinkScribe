import { LinkScheme } from "@/scheme/Link";


/**
 * Filters a list of links by the provided date query.
 *
 * @param links - An array of `LinkScheme` objects representing the links to filter.
 * @param query_date - A string representing the date to filter the links by, in the format "DD/MM/YYYY".
 * @returns An array of `LinkScheme` objects that match the provided date query.
 */
export const FilterByDate = (links: LinkScheme[], query_date: string | null) => {
    if (!query_date || query_date.trim().length === 0) return links;
        
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = query_date.match(dateRegex);
        
    if (!match) return links;

    const [, day, month, year] = match;
    const queryDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
    ).toLocaleDateString();

    return links.filter((link) => {
      const linkDate = new Date(link.created_at).toLocaleDateString();
      return linkDate === queryDate;
    });
}