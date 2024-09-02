import { LinkScheme } from "@/scheme/Link";
export * from './modules';

export const AdvancedQueryTextSearch = (links: LinkScheme[], modules: Array<(links: LinkScheme[]) => LinkScheme[]>): LinkScheme[] => {
    return modules.reduce((filteredLinks, filterFn) => filterFn(filteredLinks), links);
};