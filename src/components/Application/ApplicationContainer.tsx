import React, { useState } from 'react'
import { Container, Header, Icon, Label } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import { useUserState } from '../../contexts/UserState'
import { TemplateDetails, User } from '../../utils/types'
import { useLanguageProvider } from '../../contexts/Localisation'
export interface ApplicationContainerProps {
  template: TemplateDetails
}

const ApplicationContainer: React.FC<ApplicationContainerProps> = ({ template, children }) => {
  const { t } = useLanguageProvider()
  const { push, location } = useRouter()
  const {
    userState: { currentUser, isNonRegistered },
  } = useUserState()
  // Need to store in useState, else location.state is lost on subsequent
  // re-renders
  const [prevQueryString] = useState(location?.state?.prevQuery)
  const { code, name } = template

  const linkBack = prevQueryString
    ? `/applications${prevQueryString}`
    : `/applications?type=${code}`

  return (
    <Container id="application-area" className={isNonRegistered ? 'non-registered' : ''}>
      <div className={`top-container ${isNonRegistered ? 'hidden-element' : ''}`}>
        {currentUser?.organisation?.orgName && (
          <Header
            as="h2"
            className="heading-alt"
            textAlign="center"
            content={currentUser?.organisation?.orgName}
          />
        )}
        <Label className="back-label clickable" onClick={() => push(linkBack)}>
          <Icon name="chevron left" className="dark-grey" />
          {t('LABEL_APPLICATIONS', name)}
        </Label>
      </div>
      {children}
    </Container>
  )
}

export default ApplicationContainer
