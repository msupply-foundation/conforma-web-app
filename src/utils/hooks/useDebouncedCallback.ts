import { useCallback, DependencyList } from 'react'

export const useDebounceCallback = <T extends (...args: any[]) => any>(
  callback: T,
  depsArray: DependencyList,
  wait = 500
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  const debounced = useCallback(debounce(callback, wait), depsArray)

  return debounced
}

const debounce = <T extends (...args: any[]) => any>(
  callback: T,
  wait = 500
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  let timer: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer)
    }
    return new Promise<ReturnType<T>>((resolve) => {
      timer = setTimeout(() => {
        const returnValue = callback(...args) as ReturnType<T>
        resolve(returnValue)
      }, wait)
    })
  }
}
