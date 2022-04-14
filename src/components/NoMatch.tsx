import React from 'react'
import { useRouter } from '../utils/hooks/useRouter'
import { Container, Header, Icon, Segment } from 'semantic-ui-react'
import { useLanguageProvider } from '../contexts/Localisation'

const NoMatch: React.FC<{ header?: string; message?: string }> = ({ header, message }) => {
  const { strings } = useLanguageProvider()
  const { history } = useRouter()
  return (
    <Container id="application-summary">
      <Segment basic textAlign="center" id="submission-header">
        <Header as="h2" icon>
          <Icon name="times circle" className="error-colour" />
          404!
        </Header>
        <Header as="h3">{header || strings.NO_MATCH_404_DEFAULT_HEADER}</Header>
        <p>{message || strings.NO_MATCH_404_DEFAULT_CONTENT}</p>
      </Segment>
      <Segment basic textAlign="center" id="submission-nav">
        <p onClick={() => history.goBack()} className="clickable link-style ">
          <Icon name="arrow alternate circle left" />
          {strings.NO_MATCH_404_GO_BACK}
        </p>
      </Segment>
    </Container>
  )
}

export default NoMatch
