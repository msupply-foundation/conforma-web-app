import { EvaluatorNode, EvaluatorOutput } from 'fig-tree-evaluator'
import React, { createContext, useContext, useState } from 'react'

interface FigTreeState {
  expression: EvaluatorNode
  getNode: (path: string) => EvaluatorNode
  update: (path: string, value: EvaluatorNode) => void
  evaluate: (path: string) => EvaluatorOutput
}

const initialState = {
  expression: {},
  getNode: () => ({}),
  update: () => {},
  evaluate: () => 'temp',
}

const FigTreeContext = createContext<FigTreeState>(initialState)

export const FigTreeProvider = ({
  children,
  expression = {},
}: {
  children: React.ReactNode
  expression?: EvaluatorNode
}) => {
  const [current, setCurrent] = useState<EvaluatorNode>(expression)

  const getNode = (path: string) => ({})

  const update = (path: string, value: EvaluatorNode) => {}

  const evaluate = async (path: string) => {
    return 'TEST'
  }

  return (
    <FigTreeContext.Provider value={{ expression: current, getNode, update, evaluate }}>
      {children}
    </FigTreeContext.Provider>
  )
}

export const useFigTreeContext = () => useContext(FigTreeContext)
