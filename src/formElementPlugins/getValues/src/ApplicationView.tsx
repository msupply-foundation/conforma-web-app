import React, { useState } from 'react'
import { ApplicationViewProps } from '../../types'
import useDefault from '../../useDefault'
import { JsonData } from 'json-edit-react'
import { useRouter } from '../../../utils/hooks/useRouter'

const ReactJsonView = React.lazy(() =>
  import('../../../components/Admin/JsonEditor/ReactJson').then((m) => ({
    default: m.ReactJsonView,
  }))
)

const ApplicationView: React.FC<ApplicationViewProps> = ({
  element,
  parameters,
  currentResponse,
  onSave,
}) => {
  const { currentPageType } = useRouter()
  const [value, setValue] = useState<unknown>(currentResponse)

  const defaultValue = parameters.default ?? parameters.values

  useDefault({
    defaultValue,
    currentResponse,
    parameters,
    onChange: (value: unknown) => {
      setValue(value)
      onSave({ text: JSON.stringify(value), data: value })
    },
  })

  // Only show in Template Builder
  if (currentPageType !== 'admin') return null

  return (
    <>
      <ReactJsonView
        data={value as JsonData}
        rootName={element.code}
        collapse={0}
        baseFontSize={14}
        theme={{
          container: {
            marginTop: 0,
            marginBottom: '0.5em',
            paddingTop: 0,
            paddingBottom: 0,
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      />
      <p className="slightly-smaller-text">
        <em>
          Not visible to applicants. Stores data to make available to other form elements (or
          actions)
        </em>
      </p>
    </>
  )
}

export default ApplicationView
