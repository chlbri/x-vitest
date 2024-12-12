import type {
  BaseActionObject,
  EventObject,
  ResolveTypegenMeta,
  ServiceMap,
  TypegenDisabled,
  Typestate,
} from 'xstate';

// #region SubType
type FilterFlags<Base, Condition> = {
  [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
};

type AllowedNames<Base, Condition> = FilterFlags<
  Base,
  Condition
>[keyof Base];

export type SubType<Base extends object, Condition> = Pick<
  Base,
  AllowedNames<Base, Condition>
>;
// #endregion

export type Fn<P extends any[] = any, R = any> = (...arg: P) => R;
export type KeysFn<T extends object = object> = keyof SubType<T, Fn>;

export type DescribeArgs<
  TContext extends object,
  TEvents extends EventObject = EventObject,
  TTypestate extends Typestate<TContext> = {
    value: any;
    context: TContext;
  },
  TAction extends BaseActionObject = BaseActionObject,
  TServiceMap extends ServiceMap = ServiceMap,
  TResolvedTypesMeta = ResolveTypegenMeta<
    TypegenDisabled,
    NoInfer<TEvents>,
    TAction,
    TServiceMap
  >,
> = {
  invite: string;
};

export type TransformObjectTest<T extends object> = {
  [key in KeysFn<T>]: T[key] extends Fn
    ? TransformFunctionTest<T[key]>
    : never;
};

export type TupleToObject<
  T extends readonly any[],
  M extends Record<Exclude<keyof T, keyof any[]>, PropertyKey>,
> = { [K in Exclude<keyof T, keyof any[]> as M[K]]: T[K] };

export type TransformFunctionTest<T extends Fn> = (
  invite: string,
  ...args: Parameters<T>
) => void;
