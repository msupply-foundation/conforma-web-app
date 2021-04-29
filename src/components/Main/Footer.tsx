import React from 'react'
import { Container, Image } from 'semantic-ui-react'
import strings from '../../utils/constants'

const Footer: React.FC = () => (
  <Container id="footer">
    <div id="footer-content">
      <Image src="/images/logos/logo_512.png" />
      <p>
        {strings.FOOTER_TEXT}
        <br />
        {strings.FOOTER_COPYRIGHT}
      </p>
    </div>
  </Container>
)

export default Footer
