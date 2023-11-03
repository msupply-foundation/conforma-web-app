import React from 'react'
import { useViewport } from '../../contexts/ViewportState'

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
  hideLabel?: boolean
  minLabelWidth?: number | string
  maxLabelWidth?: number | string
  contentFontSize?: number | string
}

export const TableCellMobileLabelWrapper: React.FC<MobileLabelWrapperProps> = ({
  children,
  label,
  hideLabel = false,
  minLabelWidth = 80,
  maxLabelWidth,
  contentFontSize,
}) => {
  const { isMobile } = useViewport()

  if (!isMobile || hideLabel) return <>{children}</>

  return (
    <div className="flex-row" style={{ gap: 5, alignItems: 'flex-end' }}>
      <strong
        className="slightly-smaller-text"
        style={{ minWidth: minLabelWidth, maxWidth: maxLabelWidth }}
      >
        {label}:
      </strong>{' '}
      <span style={{ fontSize: contentFontSize }}>{children}</span>
    </div>
  )
}
