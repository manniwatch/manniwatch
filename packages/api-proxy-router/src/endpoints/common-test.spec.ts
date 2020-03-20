/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

/**
 * @hidden
 */
type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never }[keyof T];
/**
 * @hidden
 */
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;
/**
 * @hidden
 */
export interface ITestEndpoint<K, T> {
    endpointFn: FunctionProperties<K>;
    innerMethod: FunctionPropertyNames<T>;
}

export const delayPromise: <T>(resolveValue: T, delayMs?: number) => Promise<T> =
    <T>(resolveValue: T, delayMs: number = 50): Promise<T> => {
        return new Promise<T>((resolve: (v: T) => void): void => {
            setTimeout((): void => {
                resolve(resolveValue);
            }, delayMs);
        });
    };
