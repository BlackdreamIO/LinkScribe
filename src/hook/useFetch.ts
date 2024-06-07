import { useState, useEffect } from 'react';

//export const revalidate = 0;
export const dynamic = 'force-dynamic';

interface useFetchInterface  {
    method? : 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'CUSTOM',
    url : string,
    body? : any,
    cache? : 'default' | 'force-cache' | 'no-cache' | 'no-store' | 'only-if-cached' | 'reload',
    customHeaders? : any,
    requireJsonBody? : boolean,
    onAbort? : (reason : any) => void;
    onFetch? : (data : any) => void;
    onError? : (error : string) => void;
    onLoadingCallback? : (loading : boolean) => void;
}

export function useFetch(props : useFetchInterface) 
{
    const { method='GET', url, body, onAbort, onFetch, onError, requireJsonBody = true, customHeaders, cache, onLoadingCallback } = props;

    const [isRequestSent, setIsRequestSent] = useState(false);

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        
        const fetchData = async () => {
            try 
            {
                onLoadingCallback?.(true);
                setIsRequestSent(true);
                
                const response = await fetch(url, {
                    method : method,
                    headers : requireJsonBody ? customHeaders : { 'Content-Type': 'application/json' },
                    body : body,
                    signal : signal,
                    cache : cache
                })
                
                const jsonData = await response.json()
                return { response, jsonData };
            } 
            catch (error) 
            {
                onLoadingCallback?.(false);
                onError?.(String(error));
                return {};    
            }
        }
        
        fetchData()
            .then(({response, jsonData}) => {
                if(jsonData != undefined) {
                    onFetch?.(jsonData??[]);
                }
                onLoadingCallback?.(false);
            })
            .catch((err) => {
                onError?.(err);
                onLoadingCallback?.(false);
            })
        
        return () => {
            if (!isRequestSent) {
                const abortReason = abortController.abort();
                onAbort?.(abortReason); // Call onAbort callback if request is aborted
                onLoadingCallback?.(false);
            }
        };

    }, [url, body, method, requireJsonBody])
}

export async function FetchGET ({ url, returnJsonData=true } : { url : string, returnJsonData? : boolean }) 
{
    try 
    {
        const response = await fetch(url, {
            method : 'GET',
            headers : { 'Content-Type': 'application/json' },
            cache : 'no-store',
            next : {
                revalidate : 0
            }
        })
        
        const jsonData = await response.json()
        return returnJsonData ? jsonData : response;
    } 
    catch (error) 
    {
        return error;    
    }
}

export async function FetchPOST ({ url, body, useJsonStringify=true } : { url : string, body : any, useJsonStringify? : boolean }) 
{
    try 
    {
        const response = await fetch(url, {
            method : 'POST',
            headers : { 'Content-Type': 'application/json' },
            body : useJsonStringify ? JSON.stringify(body) : body,
            cache : 'no-store',
            next : {
                revalidate : 0
            }
        })
        return response;
    } 
    catch (error) 
    {
        return error;    
    }
}


interface FetchPUTInterface {
    url : string,
    body : any,
    useJsonStringify? : boolean,
}
export async function FetchPUT ( arg : FetchPUTInterface) 
{
    const { url, body, useJsonStringify=true } = arg;

    try
    {
        const response : Response = await fetch(url, {
            method : 'PUT',
            headers : { 'Content-Type': 'application/json' },
            body : useJsonStringify ? JSON.stringify(body) : body,
            cache : 'no-store',
            next : {
                revalidate : 0
            }
        })
        return response;
    } 
    catch (error) 
    {
        return error;    
    }
}

interface FetchDELETEInterface {
    url : string,
    body : any,
    useJsonStringify? : boolean,
}
export async function FetchDELETE ( arg : FetchDELETEInterface) 
{
    const { url, body, useJsonStringify=true } = arg;

    try
    {
        const response : Response = await fetch(url, {
            method : 'DELETE',
            headers : { 'Content-Type': 'application/json' },
            body : useJsonStringify ? JSON.stringify(body) : body,
            cache : 'no-store',
            next : {
                revalidate : 0
            }
        })
        return response;
    } 
    catch (error) 
    {
        return error;    
    }
}