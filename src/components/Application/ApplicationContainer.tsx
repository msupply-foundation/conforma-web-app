import React from 'react'
import { Container, Header, Icon, Label } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'
import { TemplateDetails, User } from '../../utils/types'
import strings from '../../utils/constants'
export interface ApplicationContainerProps {
  template: TemplateDetails
  currentUser: User | null
}

const ApplicationContainer: React.FC<ApplicationContainerProps> = ({
  template,
  currentUser,
  children,
}) => {
  const { replace } = useRouter()
  const { code, name } = template
  const isNonRegistered = currentUser?.username === strings.USER_NONREGISTERED
  return (
    <Container id="application-area" className={isNonRegistered ? 'non-registered' : ''}>
      <div className={'top-container' + isNonRegistered ? 'hidden-element' : ''}>
        <Label
          className="back-label clickable"
          onClick={() => replace(`/applications?type=${code}`)}
          content={
            <>
              <Icon name="angle left" className="dark-grey" size="large" />
              {`${name} ${strings.LABEL_APPLICATIONS}`}
            </>
          }
        />
        <Header as="h2" className="heading-alt" textAlign="center">
          {currentUser?.organisation?.orgName || strings.TITLE_NO_ORGANISATION}
        </Header>
      </div>
      {children}
    </Container>
  )
}

export default ApplicationContainer
