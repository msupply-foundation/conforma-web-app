import { useEffect } from 'react'
import { ResponseFull } from '../utils/types'
import { DEFAULT_LOADING_VALUE } from './ApplicationViewWrapper'

interface UseDefaultProps {
  defaultValue: any
  currentResponse: ResponseFull | null
  loadingValue?: string | null
  persistUserInput?: boolean
  onChange: (value: any) => void
  additionalDependencies?: any[]
}

const useDefault = ({
  defaultValue,
  currentResponse,
  loadingValue = DEFAULT_LOADING_VALUE,
  persistUserInput = false,
  onChange,
  additionalDependencies = [],
}: UseDefaultProps) => {
  useEffect(() => {
    if (defaultValue === loadingValue || defaultValue === undefined) return

    if (!persistUserInput || !currentResponse?.text) onChange(defaultValue)
  }, [defaultValue, ...additionalDependencies])
}

export default useDefault
