import React, { ChangeEvent, useEffect } from 'react'
import {
  Button,
  Dimmer,
  Form,
  Icon,
  Loader,
  Modal,
  Segment,
  Image,
  Message,
} from 'semantic-ui-react'
import { LookUpTableImportCsvContext } from '../contexts'
import config from '../../config.json'
import axios from 'axios'
import { useHistory } from 'react-router'

const ImportCsvModal: React.FC = ({
  onImportSuccess,
  importModelOpen = false,
  structure = null,
  ...props
}: any) => {
  const { state, dispatch } = React.useContext(LookUpTableImportCsvContext)
  const { uploadModalOpen: open, file, tableName, submittable, submitting, errors, success } = state

  const history = useHistory()

  const goBack = () => {
    history.goBack()
  }

  useEffect(() => {
    if (importModelOpen) {
      dispatch({ type: 'OPEN_MODAL' })
    } else {
      dispatch({ type: 'CLOSE_MODAL' })
    }
  }, [importModelOpen])

  useEffect(() => {
    dispatch({
      type: 'SUBMITTABLE',
      payload: open && file !== null && structure?.id ? true : tableName !== '',
    })
  }, [open, file, tableName])

  const fileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return
    dispatch({ type: 'SET_FILE', payload: input.files[0] })
  }

  const onImportCSV = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dispatch({ type: 'SUBMITTING', payload: true })

    let formData: any = new FormData()
    formData.append('file', file)
    if (!structure?.id) formData.append('tableName', tableName)

    axios
      .post(
        config.serverREST + '/lookup-table/import' + (structure?.id ? '/' + structure.id : ''),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      .then(function (response) {
        dispatch({ type: 'SET_SUCCESS', payload: true })
        onImportSuccess()
      })
      .catch(function (error: any) {
        let myErrors = []
        if (error.response) {
          const errorResponse = error.response.data
          if (errorResponse.name === 'ValidationError') {
            myErrors = JSON.parse(errorResponse.message)
          }
          myErrors.push(errorResponse.message)
        } else if (error.request) {
          myErrors.push(error.request.message)
        } else {
          myErrors.push(error.message)
        }

        dispatch({ type: 'SET_ERROR_MESSAGES', payload: myErrors })
      })
  }

  return (
    <Modal
      onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
      onOpen={() => dispatch({ type: 'OPEN_MODAL' })}
      open={open}
    >
      <Modal.Header>
        {!structure?.id ? 'Import Lookup-table' : `Import into Lookup-table: ${structure.label}`}
      </Modal.Header>
      <Modal.Content>
        {submitting ? (
          <Segment basic placeholder>
            <Dimmer active inverted>
              <Loader inverted>Submitting...</Loader>
            </Dimmer>
            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Segment>
        ) : errors.length > 0 ? (
          <Message error header="Errors found" list={[...errors]} />
        ) : success ? (
          <Message positive>
            <Message.Header>Lookup table successfully imported</Message.Header>
            <p>
              Lookup table '{structure?.label}' has been successfully
              {!structure?.id ? ' created' : ' updated'}.
            </p>
          </Message>
        ) : (
          <Form>
            {!structure?.id && (
              <Form.Field>
                <label>Table name</label>
                <input
                  placeholder="Table name"
                  value={tableName || ''}
                  onChange={(event) =>
                    dispatch({ type: 'SET_TABLE_NAME', payload: event.target.value })
                  }
                />
              </Form.Field>
            )}
            <Form.Field>
              <label>File input & upload </label>

              <Button as="label" htmlFor="file" type="button" animated="fade">
                <Button.Content visible>
                  <Icon name="file" />
                </Button.Content>
                <Button.Content hidden>Choose a File</Button.Content>
              </Button>
              <input type="file" id="file" hidden onChange={(event) => fileChange(event)} />
              <Form.Input
                fluid
                label="File Chosen: "
                placeholder="Use the above bar to browse your file system"
                readOnly
                value={file?.name || ''}
              />
            </Form.Field>
          </Form>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={goBack}>
          Cancel
        </Button>
        {errors.length > 0 || success ? (
          <Button
            content={success ? 'Import another CSV' : 'Try again'}
            labelPosition="right"
            icon="download"
            color={success ? 'green' : 'orange'}
            onClick={(e) => dispatch({ type: 'OPEN_MODAL' })}
          />
        ) : (
          <Button
            content="Import CSV"
            labelPosition="right"
            icon="download"
            onClick={(event) => onImportCSV(event)}
            disabled={!submittable}
            positive
          />
        )}
      </Modal.Actions>
    </Modal>
  )
}

export default ImportCsvModal
