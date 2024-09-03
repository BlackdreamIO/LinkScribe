import { LinkScheme } from "@/scheme/Link";
export * from './modules';

/**
 * Given an array of links and an array of filter functions, applies each filter in order and returns the filtered links.
 * Each filter function takes an array of links and returns a filtered array of links.
 * The order of the filter functions in the array matters; the first filter will be applied first, then the second, and so on.
 * @param links - The array of links to filter.
 * @param modules - The array of filter functions to apply.
 * @returns The filtered array of links.
 */
export const AdvancedQueryTextSearch = (links: LinkScheme[], modules: Array<(links: LinkScheme[]) => LinkScheme[]>): LinkScheme[] => {
    return modules.reduce((filteredLinks, filterFn) => filterFn(filteredLinks), links);
};