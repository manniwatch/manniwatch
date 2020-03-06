/*!
 * Source https://github.com/donmahallem/trapeze Package: trapeze-api-proxy-router
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
