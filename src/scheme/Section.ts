import { LinkLayoutType } from "@/types/SettingTypes";
import { LinkScheme } from "./Link";

export interface SectionScheme {
    id : string;
    title : string;
    totalLinksCount : number;
    links : LinkScheme[];
    linksLayout : LinkLayoutType;
    selfLayout : string;
    section_ref : string;
    created_at : string;
    _deleted : boolean;
}
