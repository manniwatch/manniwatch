/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

import { LOCAL_STORAGE_FACTORY } from './local-storage-factory';
import { MapStorage } from './map-storage';
import { IStorage } from './storage';

describe('./src/app/util/storage/local-storage-factory', (): void => {
    describe('LOCAL_STORAGE_FACTORY', (): void => {
        let sessionStorageSpy: jasmine.SpyObj<Storage>;
        let localStorageSpy: jasmine.SpyObj<Storage>;
        beforeEach((): void => {
            sessionStorageSpy = spyOnAllFunctions(sessionStorage);
            localStorageSpy = spyOnAllFunctions(localStorage);
        });
        it('should return a localStorage', (): void => {
            const storage: IStorage = LOCAL_STORAGE_FACTORY();
            expect(storage).toBe(localStorageSpy);
            expect(sessionStorageSpy.setItem).toHaveBeenCalledTimes(0);
            expect(sessionStorageSpy.removeItem).toHaveBeenCalledTimes(0);
            expect(localStorageSpy.setItem).toHaveBeenCalledTimes(1);
            expect(localStorageSpy.removeItem).toHaveBeenCalledTimes(1);
        });
        it('should return a sessionStorage', (): void => {
            localStorageSpy.setItem.and.throwError(new Error('asdaf'));
            const storage: IStorage = LOCAL_STORAGE_FACTORY();
            expect(storage).toBe(sessionStorageSpy);
            expect(sessionStorageSpy.setItem).toHaveBeenCalledTimes(1);
            expect(sessionStorageSpy.removeItem).toHaveBeenCalledTimes(1);
            expect(localStorageSpy.setItem).toHaveBeenCalledTimes(1);
            expect(localStorageSpy.removeItem).toHaveBeenCalledTimes(0);
        });
        it('should return a HashMap based storage', (): void => {
            sessionStorageSpy.setItem.and.throwError(new Error('asdaf'));
            localStorageSpy.setItem.and.throwError(new Error('asdaf'));
            const storage: IStorage = LOCAL_STORAGE_FACTORY();
            expect(storage).toBeInstanceOf(MapStorage);
            expect(sessionStorageSpy.setItem).toHaveBeenCalledTimes(1);
            expect(sessionStorageSpy.removeItem).toHaveBeenCalledTimes(0);
            expect(localStorageSpy.setItem).toHaveBeenCalledTimes(1);
            expect(localStorageSpy.removeItem).toHaveBeenCalledTimes(0);
        });
    });
});
