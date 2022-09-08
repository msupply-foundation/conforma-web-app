import React from 'react'
import { Container, Image } from 'semantic-ui-react'
import config from '../../config'
import { usePrefs } from '../../contexts/SystemPrefs'
import { useUserState } from '../../contexts/UserState'
const logo = require('../../../images/logos/logo_512.png').default

const Footer: React.FC = () => {
  const { latestSnapshot } = usePrefs()
  const {
    userState: { isAdmin },
  } = useUserState()

  return (
    <Container id="footer" fluid>
      <div id="footer-content">
        <Image src={logo} />
        <p>
          <span className="name">conforma</span>
          <br />
          {`© ${new Date().getFullYear()} `}
          The mSupply Foundation
          <br />
          {`v ${config.version}`}
          {isAdmin && (
            <>
              <br />
              {latestSnapshot}
            </>
          )}
        </p>
      </div>
    </Container>
  )
}

export default Footer
