import React, { createContext, useContext, useEffect, useState } from 'react'
import { throttle } from 'lodash-es'

// From Semantic-UI breakpoints
const TABLET_BREAKPOINT = 768

interface ViewportState {
  viewport: { width: number; height: number }
  isMobile: boolean
}

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window
  return {
    width,
    height,
  }
}

const ViewportStateContext = createContext<ViewportState>({
  viewport: getWindowDimensions(),
  isMobile: getWindowDimensions().width < TABLET_BREAKPOINT,
})

export const ViewportStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [viewport, setViewport] = useState(getWindowDimensions())

  useEffect(() => {
    const handleResize = throttle(() => setViewport(getWindowDimensions()), 300)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <ViewportStateContext.Provider
      value={{ viewport, isMobile: viewport.width < TABLET_BREAKPOINT }}
    >
      {children}
    </ViewportStateContext.Provider>
  )
}

export const useViewport = () => useContext(ViewportStateContext)
