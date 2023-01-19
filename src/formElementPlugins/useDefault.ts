import { useEffect } from 'react'
import { ResponseFull } from '../utils/types'
import { DEFAULT_LOADING_VALUE } from './ApplicationViewWrapper'

interface UseDefaultProps {
  defaultValue: any
  currentResponse: ResponseFull | null
  loadingValue?: string | null
  replaceResponseOnDefaultChange?: boolean
  onChange: (value: any) => void
  additionalDependencies?: any[]
}

const useDefault = ({
  defaultValue,
  currentResponse,
  loadingValue = DEFAULT_LOADING_VALUE,
  replaceResponseOnDefaultChange = true,
  onChange,
  additionalDependencies = [],
}: UseDefaultProps) => {
  useEffect(() => {
    if (defaultValue === loadingValue || defaultValue === null) return

    if (replaceResponseOnDefaultChange || !currentResponse?.text) onChange(defaultValue)
  }, [defaultValue, ...additionalDependencies])
}

export default useDefault
