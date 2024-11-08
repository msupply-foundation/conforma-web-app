import React from 'react'
import { Container, Header, Icon, Label } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import { ApplicationDetails } from '../../utils/types'
import { useLanguageProvider } from '../../contexts/Localisation'

export interface ReviewContainerProps {
  application: ApplicationDetails
  children: React.ReactNode
}

const ReviewContainer: React.FC<ReviewContainerProps> = ({ application, children }) => {
  const { t } = useLanguageProvider()
  const { push } = useRouter()
  const { serial, org } = application
  return (
    <Container id="review-container">
      <div className="top-container">
        <Label
          className="back-label clickable"
          onClick={() => push(`/application/${serial}/review`)}
          content={
            <>
              <Icon name="chevron left" className="dark-grey" />
              {t('BUTTON_BACK')}
            </>
          }
        />
        {org?.name && (
          <Header as="h3" className="heading-alt" textAlign="center" content={org?.name} />
        )}
      </div>
      {children}
    </Container>
  )
}

export default ReviewContainer
