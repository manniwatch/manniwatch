
import { MonoTypeOperatorFunction, Observable } from "rxjs";
import { map } from "rxjs/operators";

export const resetValue = <T = number>(resetInterval: number, resetValue: T): MonoTypeOperatorFunction<T> => {
    return (source: Observable<T>): Observable<T> => {
        let lastTimestamp: number | undefined = undefined;
        return source
            .pipe(map((currentValue: T): T => {
                if (lastTimestamp == undefined || lastTimestamp + resetInterval > Date.now()) {
                    return currentValue;
                } else {
                    lastTimestamp = Date.now();
                    return resetValue;
                }
            }));
    };
}