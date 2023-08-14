import React from 'react'
import { Image } from 'semantic-ui-react'
import { ApplicationViewProps } from '../../types'

const ApplicationView: React.FC<ApplicationViewProps> = ({ parameters }) => {
  const { url, size, alignment, altText, style = {} } = parameters

  return (
    <Image
      src={url}
      size={allowedSizeValues.includes(size) ? size : 'medium'}
      // Have to do a bit of trickery in terms margin over-rides to get
      // right-alignment working
      centered={alignment === 'center' || alignment === 'right'}
      style={alignment === 'right' ? { marginRight: 'unset', ...style } : style}
      alt={altText}
      title={altText}
    />
  )
}

export default ApplicationView

export const allowedSizeValues = [
  'mini',
  'tiny',
  'small',
  'medium',
  'large',
  'big',
  'huge',
  'massive',
]
