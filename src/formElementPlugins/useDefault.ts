import { useState, useEffect } from 'react'
import { ResponseFull } from '../utils/types'
import { DEFAULT_LOADING_VALUE } from './ApplicationViewWrapper'

interface UseDefaultProps {
  defaultValue: any
  currentResponse: ResponseFull | null
  loadingValue?: string | null
  shouldUpdateIfFilled?: boolean
  onChange: (value: any) => void
  additionalDependencies?: any[]
}

const useDefault = ({
  defaultValue,
  currentResponse,
  loadingValue = DEFAULT_LOADING_VALUE,
  shouldUpdateIfFilled = true,
  onChange,
  additionalDependencies = [],
}: UseDefaultProps) => {
  useEffect(() => {
    if (defaultValue === loadingValue || defaultValue === null) return

    if (shouldUpdateIfFilled || !currentResponse?.text) {
      onChange(defaultValue)
    }
  }, [defaultValue, ...additionalDependencies])
}

export default useDefault
