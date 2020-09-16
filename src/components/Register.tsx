import React, { useState } from 'react'
import { Button, Checkbox, Form, Message, Segment } from 'semantic-ui-react'

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

  return (
    <Segment.Group>
      <Segment>
        <Form>
          <Form.Field>
            <label>First Name</label>
            <input placeholder="First Name" />
          </Form.Field>
          <Form.Field>
            <label>Last Name</label>
            <input placeholder="Last Name" />
          </Form.Field>
          <Form.Field>
            <Checkbox label="I agree to the Terms and Conditions" />
          </Form.Field>
          <Button
            type="submit"
            onClick={() => {
              changeSnackback(submitedObject)
              setTimeout(() => {
                removeSnackbar()
              }, 2000)
            }}
          >
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
