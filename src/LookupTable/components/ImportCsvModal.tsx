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
import config from '../../config'
import axios from 'axios'
import { useLanguageProvider } from '../../contexts/Localisation'

const ImportCsvModal: React.FC<any> = ({
  onImportSuccess,
  onClose,
  open = false,
  tableLabel = '',
  tableStructureID = 0,
}: any) => {
  const { strings } = useLanguageProvider()
  const { state, dispatch } = React.useContext(LookUpTableImportCsvContext)
  const { uploadModalOpen, file, tableName, submittable, submitting, errors, success } = state

  useEffect(() => {
    dispatch({ type: open ? 'OPEN_MODAL' : 'CLOSE_MODAL' })
  }, [open])

  useEffect(() => {
    dispatch({
      type: 'SUBMITTABLE',
      payload: uploadModalOpen && file !== null && (tableStructureID ? true : tableName !== ''),
    })
  }, [uploadModalOpen, file, tableName])

  const fileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return
    dispatch({ type: 'SET_FILE', payload: input.files[0] })
  }

  const onImportCSV = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dispatch({ type: 'SUBMITTING', payload: true })

    let formData: any = new FormData()
    formData.append('file', file)

    if (!tableStructureID) formData.append('tableName', tableName)

    const JWT = localStorage.getItem(config.localStorageJWTKey || '')
    const authHeader = JWT ? { Authorization: 'Bearer ' + JWT } : undefined

    await axios
      .post(
        `${config.serverREST}/admin/lookup-table/import${
          tableStructureID ? '/' + String(tableStructureID) : ''
        }?tableName=${tableName}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...authHeader,
          },
        }
      )
      .then(function (response: any) {
        const successResponse = response.data
        onImportSuccess()
        dispatch({ type: 'SET_SUCCESS_MESSAGES', payload: JSON.parse(successResponse.message) })
      })
      .catch(function (error: any) {
        let myErrors = []
        if (error.response) {
          const errorResponse = error.response.data
          if (errorResponse.name === 'ValidationErrors') {
            myErrors = JSON.parse(errorResponse.message)
          } else {
            myErrors.push(errorResponse.message)
          }
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
      open={uploadModalOpen}
    >
      <Modal.Header>
        {!tableLabel
          ? strings.LOOKUP_TABLE_IMPORT
          : `${strings.LOOKUP_TABLE_IMPORT_INTO} ${tableLabel}`}
      </Modal.Header>
      <Modal.Content>
        {submitting ? (
          <Segment basic placeholder>
            <Dimmer active inverted>
              <Loader inverted content={strings.LABEL_SUBMITTING} />
            </Dimmer>
            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Segment>
        ) : errors.length > 0 ? (
          <Message error header={strings.ERROR_FOUND} list={[...errors]} />
        ) : success.length > 0 ? (
          <Message
            positive
            header={
              tableLabel
                ? strings.LOOKUP_TABLE_SUCCESS_CREATED.replace('%1', tableLabel)
                : strings.LOOKUP_TABLE_SUCCESS_UPDATED.replace('%1', tableLabel)
            }
            list={[...success]}
          />
        ) : (
          <Form>
            {!tableLabel && (
              <Form.Field>
                <label>{strings.LOOKUP_TABLE_NAME}</label>
                <input
                  placeholder={strings.LOOKUP_TABLE_NAME}
                  value={tableName || ''}
                  onChange={(event) =>
                    dispatch({ type: 'SET_TABLE_NAME', payload: event.target.value })
                  }
                />
              </Form.Field>
            )}
            <Form.Field>
              <label>{strings.LABEL_FILE_UPLOAD_TITLE}</label>

              <Button as="label" htmlFor="file" type="button" animated="fade">
                <Button.Content visible>
                  <Icon name="file" />
                </Button.Content>
                <Button.Content hidden content={strings.LABEL_FILE_UPLOAD} />
              </Button>
              <input type="file" id="file" hidden onChange={(event) => fileChange(event)} />
              <Form.Input
                fluid
                label={strings.LABEL_FILE_UPLOAD_CHOSEN}
                placeholder={strings.LABEL_FILE_UPLOAD_PLACEHOLDER}
                readOnly
                value={file?.name || ''}
              />
            </Form.Field>
          </Form>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={onClose} content={strings.BUTTON_CLOSE} />
        {errors.length > 0 || success.length > 0 ? (
          <Button
            content={success ? strings.LOOKUP_TABLE_IMPORT_OTHER : strings.LABEL_TRY_AGAIN}
            labelPosition="right"
            icon="download"
            color={success ? 'green' : 'orange'}
            onClick={(_) => dispatch({ type: 'OPEN_MODAL' })}
          />
        ) : (
          <Button
            content={strings.LABEL_FILE_IMPORT_CSV}
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

export default React.memo(ImportCsvModal)
