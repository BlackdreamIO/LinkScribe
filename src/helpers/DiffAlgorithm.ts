function deepEqual(obj1: any, obj2: any): boolean {
    if (obj1 === obj2) return true;

    if (typeof obj1 === 'object' && obj1 !== null && typeof obj2 === 'object' && obj2 !== null) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) return false;

        for (let key of keys1) {
            if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
        }

        return true;
    }

    return false;
}

interface IOutput<T> {
    added: T[];
    removed: T[];
    updated: { oldSection: T, newSection: T }[];
    unchanged: T[];
}

function createMap<T>(arr: T[], key: string): Map<string, T> {
    return new Map<string, T>(arr.map((item : any) => [item[key], item]));
}

function calculateDifferences<T>(map1: Map<string, T>, map2: Map<string, T>): IOutput<T> {
    const added: T[] = [];
    const removed: T[] = [];
    const updated: { oldSection: T, newSection: T }[] = [];
    const unchanged: T[] = [];

    for (const iterator = map1.entries(); iterator.next().done === false;) {
        const [key, item1] = iterator.next().value;

        if (!map2.has(key)) {
            removed.push(item1);
        } else {
            const item2 = map2.get(key);
            if (item2 !== undefined) {
                if (deepEqual(item1, item2)) {
                    unchanged.push(item1);
                } else {
                    updated.push({ oldSection: item1, newSection: item2 });
                }
            }
        }
    }

    for (const iterator = map2.entries(); iterator.next().done === false;) {
        const [key, item2] = iterator.next().value;

        if (!map1.has(key)) {
            added.push(item2);
        }
    }

    return { added, removed, updated, unchanged };
}

export function DifferenceComparatorAlgorithm<T>(arr1: T[], arr2: T[], key: string): IOutput<T> {
    const map1 = createMap(arr1, key);
    const map2 = createMap(arr2, key);

    return calculateDifferences(map1, map2);
}