import React from 'react'
import { useViewport } from '../../contexts/ViewportState'

export const TableCellMobileLabeller: React.FC<{ label: string; disabled?: boolean }> = ({
  children,
  label,
  disabled = false,
}) => {
  const { isMobile } = useViewport()

  if (!isMobile || disabled) return <>{children}</>

  return (
    <div className="flex-row" style={{ gap: 5 }}>
      <strong className="slightly-smaller-text">{label}:</strong> {children}
    </div>
  )
}
