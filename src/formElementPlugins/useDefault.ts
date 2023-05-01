import { useEffect, useState } from 'react'
import { ResponseFull } from '../utils/types'
import { DEFAULT_LOADING_VALUE } from './ApplicationViewWrapper'

interface UseDefaultProps {
  defaultValue: any
  currentResponse: ResponseFull | null
  loadingValue?: string | null
  parameters: Record<string, any>
  onChange: (value: any) => void
  additionalDependencies?: any[]
}

const useDefault = ({
  defaultValue,
  currentResponse,
  loadingValue = DEFAULT_LOADING_VALUE,
  parameters,
  onChange,
  additionalDependencies = [],
}: UseDefaultProps) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const { persistUserInput = false, ignoreNullDefault = false } = parameters

  useEffect(() => {
    let initial = isInitialLoad
    if (parameters.label === 'Total price (FJ$)') {
      console.log('defaultValue', defaultValue, initial)
      console.log('parameters', parameters)
    }
    if (defaultValue === loadingValue || defaultValue === undefined) return
    if (ignoreNullDefault && defaultValue === null) return

    // This allows elements that have a hard-coded default (i.e. it'll never
    // start 'undefined') to load without having to wait for subsequent default
    // change (which won't happen)
    if (defaultValue !== undefined && initial) initial = false

    // This prevents an existing response from being wiped out by a default on
    // first load, but allows it to still be replaced on subsequent default
    // changes
    setIsInitialLoad(false)

    if (!persistUserInput) return

    if (!currentResponse?.text && !isInitialLoad && !initial) {
      onChange(defaultValue)
    }
  }, [defaultValue, ...additionalDependencies])
}

export default useDefault
