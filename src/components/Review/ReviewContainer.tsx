import React from 'react'
import { Container, Header, Icon, Label } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import { ApplicationDetails } from '../../utils/types'
import strings from '../../utils/constants'

export interface ReviewContainerProps {
  application: ApplicationDetails
}

const ReviewContainer: React.FC<ReviewContainerProps> = ({ application, children }) => {
  const { push } = useRouter()
  const { template, name, org } = application
  return (
    <Container>
      <div className="top-container">
        <Label
          className="back-label clickable"
          onClick={() => push(`/applications?type=${template.code}`)}
          content={
            <>
              <Icon name="angle left" />
              {`${template.name} ${strings.LABEL_APPLICATIONS}`}
            </>
          }
        />
        <Header as="h3" className="heading-alt" textAlign="center">
          {org?.name || strings.TITLE_NO_ORGANISATION}
        </Header>
        <Header as="h2" textAlign="center" content={name} />
      </div>
      {children}
    </Container>
  )
}

export default ReviewContainer
