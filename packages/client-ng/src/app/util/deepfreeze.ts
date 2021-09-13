/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

export function deepFreezeObject<T extends object | object[]>(obj: T): T {
    // Retrieve the property names defined on object
    const propNames = Object.getOwnPropertyNames(obj);

    // Freeze properties before freezing self

    for (const name of propNames) {
        const value = obj[name];

        if (value && typeof value === "object") {
            deepFreezeObject(value);
        }
    }

    return Object.freeze(obj);
}
