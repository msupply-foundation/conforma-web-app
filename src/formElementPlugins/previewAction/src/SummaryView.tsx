import { ApplicationViewProps } from '../../types'
import { PreviewButton, PreviewButtonProps } from './ApplicationView'

const SummaryView = (props: PreviewButtonProps) => {
  return <PreviewButton {...(props as ApplicationViewProps)} />
}

export default SummaryView
