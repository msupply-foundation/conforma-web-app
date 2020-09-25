import { ApolloCache } from '@apollo/client'
import React, { useState } from 'react'
import { Button, Checkbox, Form, Input, Message, Segment } from 'semantic-ui-react'
import {
  CreateUserPayload,
  useCreateUserMutation,
  UserRole,
  UsersConnection,
} from '../generated/graphql'
import addNewUser from '../graphql/fragments/addNewUser.fragment'
// import getUsers from '../graphql/queries/getUsers.query'

interface Snackbar {
  showMessage: boolean
  messageTitle: string
  messageText: string
  isErrorMessage: boolean
}

interface User {
  username: string
  password: string
  email: string
  role: UserRole | undefined
}

const Register: React.FC = () => {
  const [snackbar, changeSnackback] = useState<Snackbar>({
    showMessage: false,
    messageTitle: '',
    messageText: '',
    isErrorMessage: false,
  })

  const [newUser, updateNewUser] = useState<User>({
    username: '',
    password: '',
    email: '',
    role: undefined,
  })

  // const [createUserMutation] = useCreateUserMutation({
  //   update(cache, { data: createdUser }) {
  //     const { users } = cache.readQuery({ query: getUsers })
  //     const newUser = createdUser.createUser.user
  //     console.log(users)
  //     const updatedUsers = users.push(newUser)
  //     console.log(updatedUsers)
  //     cache.writeQuery({ query: getUsers, data: { users: updatedUsers } })
  //   },
  //   onCompleted: () => console.log('Mutation finished'),
  // })

  const submitedObject: Snackbar = {
    showMessage: true,
    messageTitle: 'Snackbar is built',
    messageText: 'Congrats, you have pressed the Submit button!',
    isErrorMessage: false,
  }

  const removeSnackbar = () => {
    changeSnackback({
      showMessage: false,
      messageText: '',
      messageTitle: '',
      isErrorMessage: false,
    })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    updateNewUser({ ...newUser, [name]: value })
  }

  const [createUserMutation] = useCreateUserMutation({
    update(cache, { data: createdUser }) {
      if (!createdUser) return
      cache.modify({
        fields: {
          users(existingUserRefs: UsersConnection, { readField }) {
            const { user } = createdUser.createUser as CreateUserPayload
            if (!user) return existingUserRefs

            const newUserRef = cache.writeFragment({
              data: user,
              fragment: addNewUser,
            })

            // Quick safety check - if the new user is already
            // present in the cache, we don't need to add it again.
            if (
              existingUserRefs.nodes.some((ref) => (ref ? readField('id', ref) === user.id : false))
            ) {
              return existingUserRefs
            }

            return [...existingUserRefs.nodes, newUserRef]
          },
        },
      })
    },
    onCompleted: () => {
      changeSnackback(submitedObject)
      setTimeout(() => {
        removeSnackbar()
      }, 2000)
    },
  })

  const updateUser = async () => {
    try {
      const { username, password, email, role } = newUser
      const updatedUser = await createUserMutation({
        variables: {
          username: username,
          password: password,
          email: email,
          role: role as UserRole,
        },
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (
      newUser.username != '' &&
      newUser.password != '' &&
      newUser.email != '' &&
      newUser.role != undefined
    ) {
      updateUser()
    } else {
      alert('Invalid user details')
    }
  }

  return (
    <Segment.Group>
      <Segment>
        <Form>
          <Form.Field
            id="form-input-username"
            control={Input}
            label="Username"
            name="username"
            content={newUser.username}
            onChange={handleInputChange}
          />
          <Form.Field
            id="form-input-password"
            control={Input}
            label="Password"
            name="password"
            content={newUser.password}
            onChange={handleInputChange}
          />
          <Form.Field
            id="form-input-email"
            control={Input}
            label="Email"
            name="email"
            content={newUser.email}
            onChange={handleInputChange}
          />
          <Form.Group inline>
            <label>Role</label>
            {Object.keys(UserRole).map((element) => (
              <Form.Radio
                key={`from-input-role-${element}`}
                label={element}
                value={element}
                onChange={(event, { value }) => {
                  const strValue: string = typeof value === 'string' ? value : ''
                  updateNewUser({ ...newUser, role: strValue.toUpperCase() as UserRole })
                }}
              />
            ))}
          </Form.Group>
          <Form.Field
            id="form-input-terms-and-conditions"
            control={Checkbox}
            label="I agree to the Terms and Conditions"
          />
          <Form.Input control={Button} type="submit" content="Submit" onClick={handleSubmit} />
        </Form>
      </Segment>
      <Segment>
        <Message
          success
          hidden={!snackbar.showMessage}
          header={snackbar.messageTitle}
          content={snackbar.messageText}
          error={snackbar.isErrorMessage}
        />
      </Segment>
    </Segment.Group>
  )
}

export default Register
