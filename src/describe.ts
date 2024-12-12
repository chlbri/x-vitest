import {
  interpret as _interpret,
  type InterpreterOptions,
} from '@bemedev/x-test';
import { describe, test, type TestOptions } from 'vitest';
import type {
  AreAllImplementationsAssumedToBeProvided,
  BaseActionObject,
  EventObject,
  MissingImplementationsError,
  ResolveTypegenMeta,
  ServiceMap,
  State,
  StateConfig,
  StateMachine,
  StateValue,
  TypegenDisabled,
  Typestate,
} from 'xstate';
import type { TransformObjectTest } from './types';

export function interpret<
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
>(
  machine: AreAllImplementationsAssumedToBeProvided<TResolvedTypesMeta> extends true
    ? StateMachine<
        TContext,
        any,
        TEvents,
        TTypestate,
        any,
        any,
        TResolvedTypesMeta
      >
    : MissingImplementationsError<TResolvedTypesMeta>,
  options: InterpreterOptions = { simulateClock: true },
) {
  type RT = ReturnType<
    typeof _interpret<
      TContext,
      TEvents,
      TTypestate,
      TAction,
      TServiceMap,
      TResolvedTypesMeta
    >
  >;
  type _Ri1 = TransformObjectTest<
    Omit<
      RT,
      | '__status'
      | 'getSnapshot'
      | 'sender'
      | 'sendAction'
      | 'action'
      | 'assign'
      | 'delay'
      | 'guard'
      | 'promise'
      | 'stop'
      | 'start'
    >
  >;

  type Initial =
    | StateValue
    | State<TContext, TEvents, any, TTypestate, TResolvedTypesMeta>
    | StateConfig<TContext, TEvents>
    | undefined;

  type Tev<T extends TEvents['type']> = TEvents extends {
    type: T;
  } & infer U
    ? // eslint-disable-next-line @typescript-eslint/ban-types
      U extends {}
      ? Omit<U, 'type'>
      : never
    : never;

  type Ri = _Ri1 & {
    stop: () => void;
    start: (initial?: Initial) => void;
    group: (
      invite: string,
      func: (args: _Ri1) => void,
      _optionsTest?: TestOptions | number,
    ) => void;
    sender: <T extends TEvents['type']>(
      event: T,
    ) => (
      invite: string,
      ...data: Tev<T> extends never ? [] : [event: Tev<T>]
    ) => void;
  };

  // type TimeArgs = typeof
  type Service = ReturnType<
    typeof _interpret<
      TContext,
      TEvents,
      TTypestate,
      TAction,
      TServiceMap,
      TResolvedTypesMeta
    >
  >;

  const _group = (
    invite: string,
    service: Service,
    func: (args: Ri) => void,
    _optionsTest?: TestOptions | number,
  ) => {
    const collection: {
      type: keyof _Ri1 | 'stop' | 'start' | 'group';
      args: [str: string, ...args: any[]];
    }[] = [];

    const collector: Ri = {
      context: (...args) => {
        collection.push({
          type: 'context',
          args,
        });
      },

      advanceTime: (...args) => {
        collection.push({
          type: 'advanceTime',
          args,
        });
      },

      hasTags: (...args) => {
        collection.push({
          type: 'hasTags',
          args,
        });
      },

      matches: (...args) => {
        collection.push({
          type: 'matches',
          args,
        });
      },

      send: (...args) => {
        collection.push({
          type: 'send',
          args,
        });
      },

      start: (...args1) => {
        collection.push({
          type: 'start',
          args: ['Start the machine', ...args1],
        });
      },
      stop: () => {
        collection.push({
          type: 'stop',
          args: ['Stop the machine'],
        });
      },
      group: (...args) => {
        collection.push({
          type: 'group',
          args,
        });
      },
      sender: <T extends TEvents['type']>(type: T) => {
        type E = TEvents extends {
          type: T;
        } & infer U
          ? // eslint-disable-next-line @typescript-eslint/ban-types
            U extends {}
            ? Omit<U, 'type'>
            : never
          : never;

        const fn = (
          invite: string,
          ...data: E extends never ? [] : [event: E]
        ) => {
          const _data = { type, ...data?.[0] };
          collection.push({
            type: 'send',
            args: [invite, _data],
          });
        };
        return fn;
      },
    };

    func({ ...collector });

    return describe(
      invite,
      () => {
        collection.forEach(({ type, args: [invite, ...args] }, index) => {
          if (type === 'group') {
            //@ts-ignore
            return _group(`#${index} => ${invite}`, service, ...args);
          }
          return test(`#${index} => ${invite}`, async () => {
            switch (type) {
              case 'context':
                //@ts-ignore
                service.context(...args);
                break;

              case 'advanceTime':
                //@ts-ignore
                await service.advanceTime(...args);
                break;

              case 'hasTags':
                //@ts-ignore
                service.hasTags(...args);
                break;

              case 'matches':
                //@ts-ignore
                service.matches(...args);
                break;

              case 'send':
                //@ts-ignore
                service.send(...args);
                break;

              case 'start':
                //@ts-ignore
                service.start(...args);
                break;

              case 'stop':
                //@ts-ignore
                service.stop();
                break;

              default:
                break;
            }
          });
        });
      },
      _optionsTest,
    );
  };

  const group = (
    invite: string,
    func: (args: Ri) => void,
    _optionsTest?: TestOptions | number,
  ) => {
    let service = _interpret(machine, options);

    return _group(invite, service, func, _optionsTest);
  };

  return group;
}
