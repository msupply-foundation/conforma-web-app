import React from 'react'
import { Container, Image } from 'semantic-ui-react'
import config from '../../config'
import { useLanguageProvider } from '../../contexts/Localisation'
const logo = require('../../../images/logos/logo_512.png').default

const Footer: React.FC = () => {
  const { strings } = useLanguageProvider()
  return (
    <Container id="footer" fluid>
      <div id="footer-content">
        <Image src={logo} />
        <p>
          {strings.FOOTER_TEXT}
          <br />
          {'© ' + new Date().getFullYear()}
          <br />
          {`version: ${config.version}`}
        </p>
      </div>
    </Container>
  )
}

export default Footer
