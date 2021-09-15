/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

export interface IStorage {
    readonly length: number;
    clear(): void;
    getItem(key: string): string | null;
    removeItem(key: string): void;
    setItem(key: string, value: string): void;
}
