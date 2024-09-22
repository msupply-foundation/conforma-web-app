import { useRef } from 'react'

export type WorkflowStep = (...params: unknown[]) => void | Promise<void>

export const useMultiStep = <T>() => {
  const workflow = useRef<WorkflowStep[]>([])
  const state: React.MutableRefObject<T | null> = useRef(null)
  const step = useRef(-1)

  const setWorkflow = (steps: WorkflowStep[], initialState?: T) => {
    if (initialState) state.current = initialState
    workflow.current = steps
    console.log('New workflow:', workflow.current)
    step.current = -1
  }

  const nextStep = () => {
    step.current++
    console.log('Now running step', step.current)
    const method = workflow.current[step.current]
    method(state.current)
  }

  const hasNext = () => {
    return step.current < workflow.current.length - 1
  }

  const setWorkflowState = (newState: T) => {
    state.current = newState
  }

  return {
    setWorkflow,
    nextStep,
    hasNext,
    workflowState: state.current,
    setWorkflowState,
  }
}
