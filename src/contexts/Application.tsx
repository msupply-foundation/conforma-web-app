// For now this just provides a way to set a "reloadApplication" function and
// make it available to other components. Eventually, we should migrate all
// application state to here (full structure, etc.)

import React, { createContext, Dispatch, useContext, useEffect, useState } from 'react'

type ApplicationProviderProps = {
  children: React.ReactNode
  //   reloadApplication: () => {}
  //   setReloadApplication: () => {}
}

interface ApplicationContext {
  reloadApp: () => void
  setReload?: any
}

const initialContext: ApplicationContext = {
  reloadApp: () => {
    console.log('Original still')
  },
  setReload: () => {
    console.log('Default')
  },
}

const ApplicationProviderContext = createContext(initialContext)

export function ApplicationProvider({ children }: ApplicationProviderProps) {
  const [reloadApplication, setReloadApplication] = useState<any>(() => {})
  const r = () => reloadApplication()
  const s = (func: Function) => setReloadApplication(func)

  useEffect(() => {
    console.log('Reload function changed')
  }, [reloadApplication])

  return (
    <ApplicationProviderContext.Provider value={{ reloadApp: r, setReload: s }}>
      {children}
    </ApplicationProviderContext.Provider>
  )
}

export const useApplicationProvider = () => useContext(ApplicationProviderContext)
