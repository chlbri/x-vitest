import { describe } from 'vitest';
import { interpret } from './describe';
import { inputMachine, THROTTLE_TIME } from './fixtures/input.machine';

const machine = inputMachine.withConfig(
  {
    actions: {
      sendParentInput: () => {},
      startQuery: () => {},
    },
  },
  { name: 'test' },
);

const group = interpret(machine);

describe('Workflows', () => {
  group('#1', ({ start, matches, context, send, advanceTime, stop }) => {
    start();

    matches('State is "idle"', 'idle');

    context(
      'Property "editing" is undefined',
      undefined,
      context => context.editing,
    );

    send('Send Input', { type: 'INPUT', input: 'name' });

    context(
      'Property "editing" is true',
      true,
      context => context.editing,
    );

    advanceTime('Wait THROTTLE_TIME', THROTTLE_TIME);

    context(
      'State was passed by "done"',
      false,
      context => context.editing,
    );

    stop();
  });
  group('#2', ({ start, matches, context, send, advanceTime, stop }) => {
    start();

    matches('State is "idle"', 'idle');

    advanceTime('Wait THROTTLE_TIME', THROTTLE_TIME + 5);

    describe('#3 => Nothing is updated', () => {
      context(
        'Property "editing" is undefined',
        undefined,
        context => context.editing,
      );

      context(
        'Property "input" is undefined',
        undefined,
        context => context.input,
      );
    });
  });
});
