import React from 'react'
import { Form, List } from 'semantic-ui-react'
import { usePrefs } from '../../../contexts/SystemPrefs'
import { SummaryViewProps } from '../../types'
import { FileDisplay } from './components'
import { FileInfo } from './ApplicationView'

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, Markdown, response }) => {
  const { preferences } = usePrefs()
  const { label, description, useDocumentModal = preferences.showDocumentModal } = parameters
  return (
    <Form.Field required={parameters.isRequired}>
      {label && (
        <label style={{ color: 'black' }}>
          <Markdown text={parameters?.label} semanticComponent="noParagraph" />
        </label>
      )}
      <Markdown text={description} />
      <List horizontal verticalAlign="top">
        {response?.files &&
          response.files.map((file) => (
            <FileDisplay
              key={file.uniqueId}
              file={{ filename: file.filename, fileData: file } as FileInfo}
              showDocumentModal={useDocumentModal}
            />
          ))}
      </List>
    </Form.Field>
  )
}

export default SummaryView
