import React from 'react'
import { Container, Image, Segment } from 'semantic-ui-react'
import strings from '../../utils/constants'

const Footer: React.FC = () => (
  <Container id="footer">
    <div id="footer-content">
      <Image src="/images/logo-32x32.png" />
      <p>
        {strings.FOOTER_TEXT}
        <br />
        {strings.FOOTER_COPYRIGHT}
      </p>
    </div>
  </Container>
)

// Styles - TODO: Move to LESS || Global class style (semantic)
const inlineStyles = {
  container: {
    bottom: 0,
    padding: 0,
    border: 'none',
    boxShadow: 'none',
    background: 'white',
    height: '65px',
  },
  segment: { margin: 0, boxShadow: 'none', border: 'none', borderRadius: 0 },
}

export default Footer
