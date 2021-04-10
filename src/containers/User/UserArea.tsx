import React, { CSSProperties } from 'react'
import { Button, Container, Icon } from 'semantic-ui-react'
import { useUserState } from '../../contexts/UserState'
import { Link } from 'react-router-dom'
import strings from '../../utils/constants'

const UserArea: React.FC = () => {
  const {
    userState: { currentUser },
    logout,
  } = useUserState()
  return (
    <Container style={inlineStyles.container}>
      <div style={inlineStyles.top}>
        <Link to="/" style={inlineStyles.link}>
          <Icon name="home" />
          {strings.MENU_ITEM_DASHBOARD}
        </Link>
        {currentUser?.organisation?.orgName && (
          <div style={inlineStyles.left}>
            {/* <Image
              style={inlineStyles.image}
              src="/images/ss.png"
              circular
            /> */}
            <div style={inlineStyles.company}>
              {currentUser?.organisation?.orgName || ''}
              <Icon size="small" name="angle down" />
            </div>
          </div>
        )}
      </div>
      <div>
        <Button animated style={inlineStyles.user} onClick={() => logout()}>
          <Button.Content visible>
            {currentUser?.firstName || ''} {currentUser?.lastName || ''}
          </Button.Content>
          <Button.Content hidden>
            <Icon name="log out" />
          </Button.Content>
        </Button>
      </div>
    </Container>
  )
}

// Styles - TODO: Move to LESS || Global class style (semantic)
const inlineStyles = {
  container: {
    position: 'fixed',
    display: 'flex',
    background: '#4A4A4A',
    top: 0,
    zIndex: 1000,
    height: 135,
    padding: 20,
    justifyContent: 'space-between',
  } as CSSProperties,
  top: { display: 'flex', flexDirection: 'column' } as CSSProperties,
  link: { color: 'rgb(240,240,240)', fontSize: 14, letterSpacing: 1 } as CSSProperties,
  left: { marginTop: 10, display: 'flex', alignItems: 'center' } as CSSProperties,
  company: {
    marginLeft: 20,
    color: 'rgb(200,200,200)',
    fontSize: 27,
    fontWeight: 500,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } as CSSProperties,
  image: { height: 60, width: 60, boxShadow: '0px 0px 3px rgb(240,240,240)' } as CSSProperties,
  user: {
    background: 'rgb(248,248,248)',
    border: 'none',
    borderRadius: 20,
    fontSize: 14,
    color: 'rgb(50,50,50)',
    paddingRight: 5,
  } as CSSProperties,
}

export default UserArea
