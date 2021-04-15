import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Header, Icon, Segment } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { TemplateDetails, User } from '../../utils/types'

export interface AppHeaderProps {
  template: TemplateDetails
  currentUser: User | null
  ChildComponent: React.FC
}

const ApplicationHeader: React.FC<AppHeaderProps> = ({ template, currentUser, ChildComponent }) => {
  const { code, name } = template
  return (
    <Container id="application-area">
      <Button
        className="back"
        icon
        as={Link}
        to={`/applications?type=${code}`}
        content={
          <>
            <Icon name="angle left" />
            {`${name} ${strings.LABEL_APPLICATIONS}`}
          </>
        }
      />
      <Header as="h4" className="company-title" textAlign="center">
        {currentUser?.organisation?.orgName || strings.TITLE_NO_ORGANISATION}
      </Header>
      <Container className="rectangle">
        <Header as="h2" textAlign="center">
          {`${name} ${strings.TITLE_APPLICATION_FORM}`}
          <Header.Subheader as="h3" content={strings.TITLE_INTRODUCTION} />
        </Header>
        <ChildComponent />
      </Container>
    </Container>
  )
}

export default ApplicationHeader
