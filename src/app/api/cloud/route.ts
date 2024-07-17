import { NextResponse } from "next/server";

export async function POST(req : Request, res : NextResponse) {
    let x = 0;
    console.log(x + 1);
    
    return NextResponse.json({
        status : `success ${x + 1}`
    })
}