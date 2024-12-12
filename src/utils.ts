import type { Fn, KeysFn } from './types';

export function reFunction<
  T extends object = object,
  FnKey extends KeysFn<T> = KeysFn<T>,
  Pm extends any[] = T[FnKey] extends (...args: infer P) => any
    ? P
    : any[],
  Re = T[FnKey] extends (...args: any) => infer R ? R : any,
>(object: T, fn: FnKey) {
  return (...args: Pm) => (object[fn] as Function)(...args) as Re;
}

export function reFunction2<
  T extends object = object,
  FnKey extends KeysFn<T> = KeysFn<T>,
  Pm extends any[] = T[FnKey] extends (...args: infer P) => any
    ? P
    : any[],
  Re = T[FnKey] extends (...args: any) => infer R ? R : any,
>(object: T, fn: FnKey) {
  return (...args: Pm) =>
    () => {
      (object[fn] as Function)(...args) as Re;
    };
}

export function transformToTest<P extends any[] = any, R = any>(
  fn: Fn<P, R>,
) {
  return (...args: P) => {
    return () => {
      fn(...args);
    };
  };
}
