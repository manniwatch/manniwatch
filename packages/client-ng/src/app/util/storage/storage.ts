/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

/**
 * This interface mimics the Storage implemented in browsers
 */
export interface IStorage {
    readonly length: number;
    clear(): void;
    getItem(key: string): string | null;
    removeItem(key: string): void;
    setItem(key: string, value: string): void;
}
