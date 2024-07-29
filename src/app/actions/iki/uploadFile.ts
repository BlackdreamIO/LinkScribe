"use server"

import { IMAGEKIT_IO_PRIVATE_KEY } from "@/utils/envExporter";
import { UploadResponse } from "imagekit-javascript/dist/src/interfaces";
import { join } from "path";

export async function UploadFile()
{
    const file = join(__dirname, 'test.json');
}

async function UplaodToImageKitIO() {
    const file = join(__dirname, 'test.json');
    const IKIForm = new FormData();
    IKIForm.append("file", file);
    IKIForm.append("fileName", "TFC");
    IKIForm.append("folder", "subFolder");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
        method : "POST",
        body : IKIForm,
        headers: {
            Authorization: `Basic ${Buffer.from(IMAGEKIT_IO_PRIVATE_KEY + ':').toString('base64')}`,
        },
    }).then(async (response) => {
        const responseJSON : UploadResponse & { $ResponseMetadata: any } = await response.json();
        console.log(responseJSON);
    })
    .catch((e) => {
        return null;
    })
}