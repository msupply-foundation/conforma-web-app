import React, { useState } from 'react'
import { Button, Checkbox, Form, Input, Message, Segment } from 'semantic-ui-react'
import { useCreateUserMutation, UserRole } from '../generated/graphql'

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

  const [createUserMutation] = useCreateUserMutation()

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
      if (
        updatedUser &&
        updatedUser.data &&
        updatedUser.data.createUser &&
        updatedUser.data.createUser.user
      ) {
        afterCompleted()
      }
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

  const afterCompleted = () => {
    changeSnackback(submitedObject)
    setTimeout(() => {
      removeSnackbar()
    }, 2000)
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
                id={`from-input-role-${element}`}
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
