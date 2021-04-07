import React from 'react'
import { Container, Image, Segment } from 'semantic-ui-react'

const Footer: React.FC = () => (
  <Container
    style={{
      position: 'fixed',
      bottom: 0,
      padding: 0,
      border: 'none',
      boxShadow: 'none',
      background: 'white',
      zIndex: 1000,
      height: '65px',
    }}
  >
    <Segment style={{ margin: 0, boxShadow: 'none', border: 'none', borderRadius: 0 }}>
      <Image centered size="mini" src="/images/logo-32x32.png" />
    </Segment>
  </Container>
)

export default Footer
