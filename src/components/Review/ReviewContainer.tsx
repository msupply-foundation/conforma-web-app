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
  const { code, name, org } = application
  return (
    <Container>
      <div className="top-container">
        <Label
          className="back-label clickable"
          onClick={() => push(`/applications?type=${code}`)}
          content={
            <>
              <Icon name="angle left" />
              {`${name} ${strings.LABEL_APPLICATIONS}`}
            </>
          }
        />
        <Header as="h2" className="heading-alt" textAlign="center">
          {org?.name || strings.TITLE_NO_ORGANISATION}
        </Header>
      </div>
      {children}
    </Container>
  )
}

// top: { display: 'flex', alignItems: 'center' } as CSSProperties,
// link: { background: 'none' } as CSSProperties,
// title: { padding: 0, margin: 10 } as CSSProperties,

export default ReviewContainer
