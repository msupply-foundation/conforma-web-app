import React, { ChangeEvent } from 'react'
import { Button, Form, Icon, Modal } from 'semantic-ui-react'
import { LookUpTableImportCsvContext } from '../contexts'

const ImportCsvModal: React.FC = () => {
  const { state, dispatch } = React.useContext(LookUpTableImportCsvContext)

  const { uploadModalOpen: open, file, tableName } = state

  const fileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement
    if (!input.files?.length) return
    dispatch({ type: 'SET_FILE', payload: input.files[0] })
  }

  return (
    <Modal
      onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
      onOpen={() => dispatch({ type: 'CLOSE_MODAL' })}
      open={open}
    >
      <Modal.Header>Import Lookup-table</Modal.Header>
      <Modal.Content>
        <Form>
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
            {/* <Progress style={{ marginTop: '20px' }} percent={100} error active progress>
              File Upload Failed
            </Progress> */}
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={(e) => dispatch({ type: 'CLOSE_MODAL' })}>
          Cancel
        </Button>
        <Button
          content="Import"
          labelPosition="right"
          icon="download"
          onClick={(e) => dispatch({ type: 'CLOSE_MODAL' })}
          positive
        />
      </Modal.Actions>
    </Modal>
  )
}

export default ImportCsvModal
