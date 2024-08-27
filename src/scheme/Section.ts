import { LinkLayout, LinkScheme } from "./Link";

export interface SectionScheme {
    id : string;
    title : string;
    totalLinksCount : number;
    links : LinkScheme[];
    links_layout : LinkLayout;
    selfLayout : string;
    section_ref : string;
    created_at : string;
    _deleted : boolean;
    minimized? : boolean;
}
