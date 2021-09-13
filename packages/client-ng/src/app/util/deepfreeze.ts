/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

export const deepFreezeObject: <T extends object | object[]>(obj: T) => T
    = <T extends object | object[]>(obj: T): T => {
        // Retrieve the property names defined on object
        const propNames: string[] = Object.getOwnPropertyNames(obj);

        // Freeze properties before freezing self

        for (const name of propNames) {
            const value: unknown = obj[name];

            if (value && typeof value === 'object') {
                deepFreezeObject(value);
            }
        }

        return Object.freeze(obj);
    };
