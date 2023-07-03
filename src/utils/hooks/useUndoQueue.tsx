import { useState } from 'react'

export const useUndoQueue = <T,>(initialValue?: T) => {
  const [undoQueue, setUndoQueue] = useState<T[]>([])
  const [redoQueue, setRedoQueue] = useState<T[]>([])
  const [currentValue, setCurrentValue] = useState<T | undefined>(initialValue)
  const [hasChanged, setHasChanged] = useState(false)

  const setValue = (value: T) => {
    if (value !== undefined) {
      if (currentValue !== undefined) {
        setUndoQueue([...undoQueue, currentValue])
        setRedoQueue([])
        setHasChanged(true)
      }
      setCurrentValue(value)
    }
  }

  const undo = () => {
    const queue = [...undoQueue]
    const prev = queue.pop()
    if (prev !== undefined && currentValue !== undefined) {
      setHasChanged(true)
      setRedoQueue([...redoQueue, currentValue])
      setCurrentValue(prev)
      setUndoQueue(queue)
    }
  }

  const redo = () => {
    const queue = [...redoQueue]
    const next = queue.pop()
    if (next !== undefined && currentValue !== undefined) {
      setUndoQueue([...undoQueue, currentValue])
      setCurrentValue(next)
      setRedoQueue(queue)
    }
  }

  const setSaved = () => {
    setHasChanged(false)
  }

  return {
    currentValue,
    setValue,
    undo,
    redo,
    hasChanged,
    setSaved,
    canUndo: undoQueue.length > 0,
    canRedo: redoQueue.length > 0,
  }
}
