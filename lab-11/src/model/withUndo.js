/** Історія, з якої починають: present і порожні past та future. */
export function createHistory(present) {
  return {
    past: [],
    present,
    future: [],
  }
}

/**
 * Ред'юсер вищого порядку: отримує ред'юсер і повертає новий, який веде
 * історію змін.
 */
export function withUndo(reducer, limit = 20) {
  return function undoableReducer(history, action) {
    switch (action.type) {
      case 'undo': {
        if (history.past.length === 0) return history
        const previous = history.past[history.past.length - 1]
        const past = history.past.slice(0, -1)
        return {
          past,
          present: previous,
          future: [history.present, ...history.future],
        }
      }

      case 'redo': {
        if (history.future.length === 0) return history
        const [next, ...future] = history.future
        return {
          past: [...history.past, history.present],
          present: next,
          future,
        }
      }

      default: {
        const nextPresent = reducer(history.present, action)
        if (Object.is(nextPresent, history.present)) {
          return history
        }
        const nextPast = [...history.past, history.present]
        const past = limit > 0 ? nextPast.slice(-limit) : []
        return {
          past,
          present: nextPresent,
          future: [],
        }
      }
    }
  }
}
