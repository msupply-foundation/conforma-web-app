import React from 'react'
import { Container, Image } from 'semantic-ui-react'
import config from '../../config'
import { usePrefs } from '../../contexts/SystemPrefs'
import { useUserState } from '../../contexts/UserState'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'
import Markdown from '../../utils/helpers/semanticReactMarkdown'
const defaultLogo = require('../../../images/logos/logo_512.png').default

const Footer: React.FC = () => {
  const {
    latestSnapshot,
    preferences: { footerLogoId, footerText },
  } = usePrefs()
  const {
    userState: { currentUser },
  } = useUserState()

  const logo = footerLogoId ? getServerUrl('file', { fileId: footerLogoId }) : defaultLogo

  return (
    <Container id="footer" fluid>
      <div id="footer-content-left">
        <Image src={logo} />
        <p>
          <span className="name">conforma</span>
          <br />
          {`© ${new Date().getFullYear()} `}
          The mSupply Foundation
          <br />
          {`v${config.version}`}
          {currentUser?.isAdmin && (
            <>
              <br />
              {latestSnapshot}
            </>
          )}
        </p>
      </div>
      {footerText && (
        <div id="footer-content-center">
          <Markdown text={footerText} />
        </div>
      )}
    </Container>
  )
}

export default Footer
