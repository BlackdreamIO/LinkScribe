import { NextRequest, NextResponse } from "next/server";
import { URLStatus } from "@/global/checkUrlValidity";

export async function POST(req : Request, res : NextResponse) {
    try {
        
        const url = new URL(req.url);
        const searchParams = new URLSearchParams(url.search);

        if(!searchParams.get("url")) {
            return NextResponse.json(URLStatus.Invalid);
        }

        const fetchURL = searchParams.get("url")!;

        const response = await fetch(fetchURL, { 
            mode : "no-cors", 
            keepalive : true, 
            cache : "no-store", 
            method : "GET", 
            headers : {
                'Access-Control-Allow-Origin': '*',
                "x-client-source" : "explorer"
            } 
        });

        if (!response.ok) {
            return NextResponse.json(URLStatus.Invalid);
        }
        else if (response.status != 200) {
            return NextResponse.json(URLStatus.NetworkIssue);    
        }
        else {
            return NextResponse.json(URLStatus.Valid);
        }
    }
    catch (error) {
        return NextResponse.json(URLStatus.Unknown);
    }
}