/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type KeyMap = { [key: string]: any };

export const deepFreezeObject: <T extends KeyMap | KeyMap[]>(obj: T) => T
    = <T extends KeyMap | KeyMap[]>(obj: T): T => {
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
