import React from 'react'
import { useViewport } from '../../contexts/ViewportState'
import { HideOnMobileTestMethod } from '../types'

/**
 * When displayed on mobile devices, table rows become "stacked", in that each
 * cell is stacked vertically within a box. This removes any ability to see the
 * field names (column headers), so this components provides a simple wrapper
 * around table cells to inject a header back in as a label. When not in
 * "mobile" view, the table cells will be rendered unchanged
 *
 * It also has a few options so that this behaviour can be suppressed (in cases
 * where the context clearly implies the label), or hidden completely in mobile
 * view.
 */

interface MobileLabelWrapperProps {
  label: string
  rowData: Record<string, unknown>
  hideIf?: HideOnMobileTestMethod
  hideLabel?: boolean
}

export const TableCellMobileLabelWrapper: React.FC<MobileLabelWrapperProps> = ({
  children,
  rowData,
  label,
  hideIf,
  hideLabel = false,
}) => {
  const { isMobile } = useViewport()

  if (isMobile && hideIf && hideIf(rowData)) return null

  if (!isMobile || hideLabel) return <>{children}</>

  return (
    <div className="flex-row" style={{ gap: 5, alignItems: 'flex-end' }}>
      <strong className="slightly-smaller-text">{label}:</strong> {children}
    </div>
  )
}
