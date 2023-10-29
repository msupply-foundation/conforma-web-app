/**
 * A very simple key-value store. Currently used to cache recently uploaded
 * files so they can be retrieved easily without re-downloading them.
 */

import { useState } from 'react'

type SimpleCache<T> = Record<string, T>

export const useSimpleCache = <T>(): SimpleCacheReturn<T> => {
  const [cache, setCache] = useState<SimpleCache<T>>({})

  const addToCache = (key: string, value: T) => {
    setCache((prev) => ({ ...prev, [key]: value }))
  }

  const removeFromCache = (key: string) =>
    setCache((current) => {
      const newCache = { ...current }
      delete newCache[key]
      return newCache
    })

  const getFromCache = (key: string) => (key in cache ? cache[key] : undefined)

  return { cache, addToCache, removeFromCache, getFromCache }
}

export type SimpleCacheReturn<T> = {
  cache: SimpleCache<T>
  addToCache: (key: string, value: T) => void
  removeFromCache: (key: string) => void
  getFromCache: (key: string) => T | undefined
}
