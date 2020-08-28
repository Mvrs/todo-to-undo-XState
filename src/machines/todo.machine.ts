import { Machine, assign } from 'xstate'

interface TodoStateSchema {
  states: {
    add: {}
    remove: {}
  }
}

interface Context {
  text: string
  completed: boolean
  todo: []
}

type Event =
  | { type: 'ADD'; text: string; complete: boolean }
  | { type: 'REMOVE'; index: number }

export const todoMachine = Machine<Context, Event>({
  id: 'todoMachine',
  initial: 'add',
  context: {
    completed: false,
    text: '',
    todo: null,
  },
  states: {
    add: {
      // your target is always the next transition in the predicted state
      on: {
        ADD: {
          target: 'delete',
          actions: (context, event) => {
            return [
              ...context.todo,
              { text: event.text, complete: event.complete },
            ]
          },
        },
      },
    },
    delete: {
      on: {
        REMOVE: {
          target: 'add',
          actions: (context, event) => {
            return context.todo.filter((_, i) => event.index !== i)
          },
        },
      },
    },
  },
})
