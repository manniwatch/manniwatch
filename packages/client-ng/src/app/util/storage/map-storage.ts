/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

import { IStorage } from './storage';

export class MapStorage implements IStorage {
    private data: { [key: string]: string } = {};

    readonly length: number;
    public clear(): void {
        this.data = {};
    }
    public getItem(key: string): string | null {
        return this.data[key];
    }

    public removeItem(key: string): void {
        delete this.data[key];
    }
    public setItem(key: string, value: string): void {
        this.data[key] = value;
    }
}
