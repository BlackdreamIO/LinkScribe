import { NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from "fs";
import { drive, auth } from "@googleapis/drive";
import path from 'path';
/*
async function uploadFile(authClient: any) {
  return new Promise((resolve, reject) => {
    const driveInstance = drive({ version: 'v3', auth: authClient });

    // Correctly resolve the file path
    // Read the file content
    // fs.readFile(filePath, (err, data) => {
    //   if (err) {
    //     console.error('Error reading file:', err);
    //     reject(err); // Properly reject the promise on error
    //     return;
    //   }

    const filePath = path.join(process.cwd(), 'google.json');
    const fileStream = fs.createReadStream(filePath);

    // driveInstance.files.update({

    // })

      driveInstance.files.create({
        requestBody: {
          name: crypto.randomUUID(),
          parents: ['1dPo1vYIEY6F6T9DGtytDSfdNiYdl6CAp'],
          mimeType: 'application/json',
          description: 'test',
        },
        media: {
          body:  fileStream, // Pass file content as the body
          mimeType: 'application/json',
        },
        fields: 'id',
      }, function (error: any, file: any) {
        if (error) {
          console.error('Error uploading file:', error);
          reject(error); // Properly reject the promise on upload error
          return;
        }
        resolve(file);
      });
    });
  
}


async function authorize()
{
    const SCOPE = ['https://www.googleapis.com/auth/drive'];

    const apikeys = await import("../../../../google.json", {
        assert: {
            type: "json"
        }
    });

    const jwtClient = new auth.JWT(
        apikeys.client_email,
        null as any,
        apikeys.private_key,
        SCOPE
    );

    await jwtClient.authorize();

    return jwtClient;
}
*/
export async function POST(req: Request, res: NextApiResponse) {

  /*
    const authClient = await authorize();
    await uploadFile(authClient);
*/    

    return NextResponse.json("FILE 259")
}