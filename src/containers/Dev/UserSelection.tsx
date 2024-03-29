import React, { useEffect, useState } from 'react'
import { Button, Grid, Icon, Message, Popup } from 'semantic-ui-react'
import { Loading } from '../../components'
import { postRequest as attemptLogin } from '../../utils/helpers/fetchMethods'
import config from '../../config'
import { useGetUsersQuery } from '../../utils/generated/graphql'
import { User } from '../../utils/types'
import { useUserState } from '../../contexts/UserState'
import getServerUrl from '../../utils/helpers/endpoints/endpointUrlBuilder'

const hardcodedPassword = '123456'

const UserSelection: React.FC = () => {
  const [users, setUsers] = useState<Array<string>>([])
  const [isOpen, setIsOpen] = useState(false)
  const { data, error } = useGetUsersQuery()
  const { onLogin } = useUserState()

  useEffect(() => {
    if (data && data.users && data.users.nodes) {
      const users = data.users.nodes as Pick<User, 'username'>[]
      const userNames = users
        .filter((user) => user !== null)
        .map(({ username }) => username) as string[]
      setUsers(userNames)
    }
  }, [data, error])

  const handleChangeUser = async (username: string) => {
    setIsOpen(false)
    // Selected User login
    const loginResult = await attemptLogin({
      jsonBody: { username, password: hardcodedPassword },
      url: getServerUrl('login'),
      headers: { 'Content-Type': 'application/json' },
    })
    if (!loginResult.success) {
      console.log(`Problem logging in user: ${username}`)
      return
    } else localStorage.setItem(config.localStorageJWTKey, loginResult.JWT)

    // Organisation login (auto-select first in list)
    const { JWT, user, templatePermissions, orgList } = loginResult
    if (orgList.length === 0) {
      await onLogin(JWT, user, templatePermissions, orgList)
      return
    }
    const selectedOrg = orgList[0]

    const verifyOrgResult = await attemptLogin({
      jsonBody: { userId: user.userId, orgId: selectedOrg.orgId },
      url: getServerUrl('loginOrg'),
      headers: { 'Content-Type': 'application/json' },
    })

    if (!verifyOrgResult.success) {
      console.log(`Problem logging in with organisation: ${selectedOrg.name}`)
      return
    }

    await onLogin(
      verifyOrgResult.JWT,
      verifyOrgResult.user,
      verifyOrgResult.templatePermissions,
      orgList
    )
  }

  return (
    <Popup
      position="bottom right"
      trigger={<Icon name="chevron down" style={{ paddingLeft: 10 }} />}
      on="click"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      open={isOpen}
      style={{ zIndex: 1001 }}
    >
      {data ? (
        users ? (
          <Grid divided columns="equal">
            <Grid.Column>
              {users.map((user, index) => (
                <Grid.Row key={`user_select_${index}`}>
                  <Button
                    // basic
                    color="grey"
                    content={user}
                    fluid
                    onClick={() => handleChangeUser(user)}
                  />
                </Grid.Row>
              ))}
            </Grid.Column>
          </Grid>
        ) : (
          <Loading />
        )
      ) : (
        <Message content="Error" />
      )}
    </Popup>
  )
}

export default UserSelection
