import React from 'react'
import { Container, Header, Icon, Label } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import { useUserState } from '../../contexts/UserState'
import { TemplateDetails, User } from '../../utils/types'
import { useLanguageProvider } from '../../contexts/Localisation'
export interface ApplicationContainerProps {
  template: TemplateDetails
}

const ApplicationContainer: React.FC<ApplicationContainerProps> = ({ template, children }) => {
  const { strings } = useLanguageProvider()
  const { replace } = useRouter()
  const {
    userState: { currentUser, isNonRegistered },
  } = useUserState()
  const { code, name } = template

  return (
    <Container id="application-area" className={isNonRegistered ? 'non-registered' : ''}>
      <div className={`top-container ${isNonRegistered ? 'hidden-element' : ''}`}>
        <Label
          className="back-label clickable"
          onClick={() => replace(`/applications?type=${code}`)}
        >
          <Icon name="chevron left" className="dark-grey" />
          {strings.LABEL_APPLICATIONS.replace('%1', name)}
        </Label>
        {currentUser?.organisation?.orgName && (
          <Header
            as="h2"
            className="heading-alt"
            textAlign="center"
            content={currentUser?.organisation?.orgName}
          />
        )}
      </div>
      {children}
    </Container>
  )
}

export default ApplicationContainer
