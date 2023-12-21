export declare global {
	type Falsy = 0 | null | undefined | void | never[] | Record<K, never> | "";
	type ProbablyPromise<V = unknown> = Promise<V> | V;
	type RecordString<V = string> = Record<string, V>;
	type IsNil<T> = T extends Falsy ? true : false;
}