import { useEffect, useState } from 'react'
import evaluate from '@openmsupply/expression-evaluator'
import { EvaluatorParameters, User } from '../types'

interface UseEvaluateMessage {
  currentUser: User
  message?: string
  shouldEvaluate: boolean
}

const useEvaluateMessage = ({ currentUser, message, shouldEvaluate }: UseEvaluateMessage) => {
  const [evaluatedMessage, setEvaluatedMessage] = useState('')
  const [isMessageEvaluated, setIsMessageEvaluated] = useState(false)

  useEffect(() => {
    if (!shouldEvaluate) setIsMessageEvaluated(true)
    if (!message) return
    setIsMessageEvaluated(false)
    const evaluatorParams: EvaluatorParameters = {
      objects: { currentUser },
      APIfetch: fetch,
    }
    evaluate(message || '', evaluatorParams).then((result: any) => {
      setEvaluatedMessage(result)
      setIsMessageEvaluated(true)
    })
  }, [message, shouldEvaluate])

  return {
    evaluatedMessage,
    isMessageEvaluated,
  }
}

export default useEvaluateMessage
