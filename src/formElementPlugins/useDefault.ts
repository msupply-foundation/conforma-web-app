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
    if (defaultValue === loadingValue || defaultValue === undefined) return
    if (ignoreNullDefault && defaultValue === null) return

    // This prevents an existing response from being wiped out by a default on
    // first load, but allows it to still be replaced on subsequent default
    // changes
    setIsInitialLoad(false)

    if ((!persistUserInput || !currentResponse?.text) && !isInitialLoad) {
      onChange(defaultValue)
    }
  }, [defaultValue, ...additionalDependencies])
}

export default useDefault
