import { LinkScheme } from "./Link";

export interface SectionScheme {
    id : string;
    title : string;
    totalLinksCount : number;
    links : LinkScheme[];
    created_at : Date;
}