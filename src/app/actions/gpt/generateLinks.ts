"use server"

import { LinkScheme } from "@/scheme/Link";
import jwt from "jsonwebtoken";

interface IGenerateAILinks {
    userId : string;
    prompt : string;
    maxGeneration : number;
}

interface IOutput {
    error : null | any,
    code : number,
    usages : {
        promptTokenCount : number;
        candidatesTokenCount : number;
        totalTokenCount : number;
    },
    message : string;
    links : LinkScheme[];
}

function convertStringToArray(inputString : string) {
    // Remove new lines and extra spaces
    const cleanedString = inputString.replace(/\s+/g, ' ').trim();

    // Use regex to match and extract objects
    const regex = /{([^{}]*)}/g;
    const matches = [];
    let match;

    // Extract each object string from the cleaned string
    while ((match = regex.exec(cleanedString)) !== null) {
        const objectString = `{${match[1]}}`;
        matches.push(JSON.parse(objectString.replace(/,\s*}/, '}'))); // Parse and fix trailing commas
    }

    return matches;
}

export async function generateAILinks({ userId, prompt, maxGeneration } : IGenerateAILinks) : Promise<IOutput>
{
    try
    {
        if(!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }
        if(!process.env.SERVER_BASE_URL) {
            throw new Error("SERVER_BASE_URL is not defined");
        }

        const serverBaseURL = process.env.SERVER_BASE_URL as string;
        const jwtSecret = process.env.JWT_SECRET as string;

        const token = jwt.sign({ userId: userId, hasProVersion: true }, jwtSecret, { expiresIn: '1h' });

        const response = await fetch(`${serverBaseURL}/generateLinks`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                prompt: prompt,
                maxGeneration: maxGeneration,
                safetyLevel : "default"
            }),
        });

        const result = await response.json();
        
        console.log(result);

        if(result.error) {
            return {
                error : result.error,
                code : 500,
                usages : {
                    promptTokenCount : 0,
                    candidatesTokenCount : 0,
                    totalTokenCount : 0
                },
                message : result.message,
                links : []
            }
        }

        else {
            return {
                error : null,
                code : 200,
                usages : {
                    promptTokenCount : result.promptTokenCount,
                    candidatesTokenCount : result.candidatesTokenCount,
                    totalTokenCount : result.totalTokenCount
                },
                message : result.message,
                links : result.data
            }
        }
    }
    catch (error : any) {
        return {
            error : JSON.stringify(error),
            code : 500,
            usages : {
                promptTokenCount : 0,
                candidatesTokenCount : 0,
                totalTokenCount : 0
            },
            message : error.message,
            links : []
        }
    }
}