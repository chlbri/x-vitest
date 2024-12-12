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
  group(
    'Workflow #1',
    ({ start, matches, context, send, advanceTime, stop, group }) => {
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

      group('State was passed by "done"', ({ context, matches }) => {
        context('editing is "false"', false, context => context.editing);
        matches('State is returned in "idle"', 'idle');
      });

      stop();
    },
  );

  group(
    'Workflow #2',
    ({ start, matches, advanceTime, stop, group, hasTags, sender }) => {
      start();
      matches('State is "idle"', 'idle');
      advanceTime('Wait THROTTLE_TIME', THROTTLE_TIME + 5);

      group('#3 => Nothing is updated', ({ context }) => {
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

      hasTags('The state has a tag "busy"', 'busy');

      const input = sender('INPUT');
      input('Send a input "bemedev" with function sender', {
        input: 'bemedev',
      });

      group('Input is edited', ({ context }) => {
        context('editing is modified', true, context => context.editing);
        context('input is modified', 'bemedev', context => context.input);
      });

      advanceTime('Wait THROTTLE_TIME', THROTTLE_TIME);

      group('State was passed by "done"', ({ context, matches }) => {
        context('editing is "false"', false, context => context.editing);
        matches('State is returned in "idle"', 'idle');
      });

      stop();
    },
  );
});
