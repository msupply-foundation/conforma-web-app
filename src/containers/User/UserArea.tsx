import React from 'react'
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
    <Container
      style={{
        position: 'fixed',
        display: 'flex',
        background: '#4A4A4A',
        top: 0,
        zIndex: 1000,
        height: 135,
        padding: 20,
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Link to="/" style={{ color: 'rgb(240,240,240)', fontSize: 14, letterSpacing: 1 }}>
          <Icon name="home" />
          {strings.MENU_ITEM_DASHBOARD}
        </Link>
        {currentUser?.organisation?.orgName && (
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center' }}>
            {/* <Image
              style={{ height: 60, width: 60, boxShadow: '0px 0px 3px rgb(240,240,240)' }}
              src="/images/ss.png"
              circular
            /> */}
            <div
              style={{
                marginLeft: 20,
                color: 'rgb(200,200,200)',
                fontSize: 27,
                fontWeight: 500,
                letterSpacing: 1.2,
                textTransform: 'uppercase',
              }}
            >
              {currentUser?.organisation?.orgName || 'ABC COMPANY'}
              <Icon size="small" name="angle down" />
            </div>
          </div>
        )}
      </div>
      <div>
        <Button
          animated
          style={{
            background: 'rgb(248,248,248)',
            border: 'none',
            borderRadius: 20,
            fontSize: 14,
            color: 'rgb(50,50,50)',
            paddingRight: 5,
          }}
          onClick={() => logout()}
        >
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

export default UserArea
