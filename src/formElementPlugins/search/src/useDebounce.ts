import { useState, useEffect } from 'react'

// Adapted from:
// https://typeofnan.dev/writing-a-custom-react-usedebounce-hook-with-typescript/

export default function useDebounce<T>(initialValue: T, delay: number): [T, React.Dispatch<T>] {
  const [debounceInput, setDebounceInput] = useState<T>(initialValue)
  const [debounceOutput, setDebounceOutput] = useState<T>(initialValue)

  useEffect(() => {
    const debounce = setTimeout(() => {
      setDebounceOutput(debounceInput)
    }, delay)
    return () => {
      clearTimeout(debounce)
    }
  }, [debounceInput, delay])

  return [debounceOutput, setDebounceInput]
}
