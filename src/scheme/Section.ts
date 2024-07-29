import { LinkLayoutType } from "@/types/SettingTypes";
import { LinkScheme } from "./Link";
import { Timestamp } from "firebase/firestore";

export interface SectionScheme {
    id : string;
    title : string;
    totalLinksCount : number;
    links : LinkScheme[];
    linksLayout : LinkLayoutType;
    created_at : string;
    timestamp : string;
    _deleted : boolean;
}
