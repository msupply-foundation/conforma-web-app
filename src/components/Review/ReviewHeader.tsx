import React from 'react'
import { Header } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { useRouter } from '../../utils/hooks/useRouter'

export interface ReviewHeaderProps {
  applicationName: string
}

const ReviewHeader: React.FC<ReviewHeaderProps> = ({ applicationName }) => {
  const {
    query: { serialNumber },
    push,
  } = useRouter()

  return (
    <div id="application-summary-header">
      <Header
        as="h2"
        className="clickable"
        textAlign="center"
        onClick={() => push(`/application/${serialNumber}`)}
      >
        <strong>{applicationName}</strong>
      </Header>
      <Header as="h2" textAlign="center" content={strings.LABEL_REVIEW} />
      <p>{strings.SUBTITLE_REVIEW}</p>
    </div>
  )
}

export default ReviewHeader
