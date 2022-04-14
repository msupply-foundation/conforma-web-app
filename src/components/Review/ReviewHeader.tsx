import React from 'react'
import { Header } from 'semantic-ui-react'
import { StageDetails } from '../../utils/types'
import { useLanguageProvider } from '../../contexts/Localisation'
import { Stage } from '../Review'

export interface ReviewHeaderProps {
  applicationName: string
  stage: StageDetails
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({ applicationName, stage }) => {
  const { strings } = useLanguageProvider()
  return (
    <div id="application-summary-header">
      <Header as="h5" content={applicationName} />
      <Header as="h2" content={strings.LABEL_REVIEW} />
      <Stage name={stage.name || ''} colour={stage.colour} />
    </div>
  )
}

export default ReviewHeader
