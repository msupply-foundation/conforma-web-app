import React, { useState } from 'react'
import { Button, Checkbox, Dropdown, Form, Message, Segment } from 'semantic-ui-react'
import { useCreateUserMutation, UserRole } from '../generated/graphql'

interface Snackbar {
  showMessage: boolean
  messageTitle: String
  messageText: String
  isErrorMessage: boolean
}

const Register: React.FC = () => {
  const [snackbar, changeSnackback] = useState<Snackbar>({
    showMessage: false,
    messageTitle: '',
    messageText: '',
    isErrorMessage: false,
  })

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

  const [createUserMutation, { loading, error }] = useCreateUserMutation()

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    // createUserMutation()
    console.log('handleSubmit')
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
          <Form.Field>
            <label>User Name</label>
            <input placeholder="User Name" />
          </Form.Field>
          <Form.Field>
            <label>Password</label>
            <input placeholder="Password" />
          </Form.Field>
          <Form.Field>
            <label>Email</label>
            <input placeholder="Email" />
          </Form.Field>
          <Form.Group inline>
            <label>Role</label>
            {Object.keys(UserRole).map((element) => (
              <Form.Radio
                label={element}
                value={element}
                // checked={role === element}
                // onChange={handleRoleChanged}
              />
            ))}
          </Form.Group>
          <Form.Field>
            <Checkbox label="I agree to the Terms and Conditions" />
          </Form.Field>
          <Button type="submit" onClick={handleSubmit}>
            Submit
          </Button>
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
