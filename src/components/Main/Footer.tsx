import React from 'react'
import { Container, Image, Segment } from 'semantic-ui-react'

const Footer: React.FC = () => (
  <Container style={inlineStyles.container}>
    <Segment style={inlineStyles.segment}>
      <Image centered size="mini" src="/images/logo-32x32.png" />
    </Segment>
  </Container>
)

// Styles - TODO: Move to LESS || Global class style (semantic)
const inlineStyles = {
  container: {
    position: 'fixed',
    bottom: 0,
    padding: 0,
    border: 'none',
    boxShadow: 'none',
    background: 'white',
    zIndex: 1000,
    height: '65px',
  },
  segment: { margin: 0, boxShadow: 'none', border: 'none', borderRadius: 0 },
}

export default Footer
