

export const RecursiveRemoveObjectFields = (obj: unknown , fieldsToRemove: string[]): any => {
    
    // Deep clone the object to avoid mutation
    const clone = JSON.parse(JSON.stringify(obj));

    const recursiveRemoveFields = (object: any) => {
        for (const key in object) {
            if (fieldsToRemove.includes(key)) {
                delete object[key];
            } 
            else if (typeof object[key] === 'object' && object[key] !== null) {
                recursiveRemoveFields(object[key]);
            }
        }
    };

    recursiveRemoveFields(clone);
    return clone;
};