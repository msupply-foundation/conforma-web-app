import React from 'react'
import { Image } from 'semantic-ui-react'
import { allowedSizeValues } from './ApplicationView'
import { SummaryViewProps } from '../../types'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters }) => {
  const { url, size, alignment, altText, summarySize = 'small' } = parameters

  // By default, image is displayed "small" in Summary view, but can be
  // over-ridden by specifying "summarySize"

  return (
    <Image
      src={url}
      size={allowedSizeValues.includes(summarySize) ? size : 'small'}
      // Have to do a bit of trickery in terms margin over-rides to get
      // right-alignment working
      centered={alignment === 'center' || alignment === 'right'}
      style={alignment === 'right' ? { marginRight: 'unset' } : { maxWidth: 100 }}
      alt={altText}
      title={altText}
    />
  )
}

export default SummaryView
