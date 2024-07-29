
export interface LinkScheme {
    id : string;
    title : string;
    url : string;
    visitCount : number;
    created_at : string;
}

export type LinkLayout = {
    layout : "Grid Compact" | "List Compact" | "Compact" | "Grid Detailed" | "List Detailed";
    size : number;
}