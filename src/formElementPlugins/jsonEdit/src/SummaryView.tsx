import React from 'react'
import { SummaryViewProps } from '../../types'
import { useViewport } from '../../../contexts/ViewportState'
import { Parameters } from './ApplicationView'

const JsonEditor = React.lazy(() => import('../../../components/Admin/JsonEditor/JsonEditor'))

const SummaryView: React.FC<SummaryViewProps> = ({ parameters, response, Markdown }) => {
  const { viewport } = useViewport()

  const {
    label,
    description,
    width,
    collapse = 1,
    showSearch = false,
    searchPlaceholder,
    ...jsonProps
  } = parameters as Parameters

  const jsonEditProps = {
    collapse,
    restrictEdit: true,
    restrictAdd: true,
    restrictDelete: true,
    ...jsonProps,
  }

  const widthProps = width ? { theme: { container: { width: `${width}px` } } } : {}

  return (
    <>
      {label && (
        <label>
          <Markdown text={label} semanticComponent="noParagraph" />
        </label>
      )}
      <Markdown text={description} />
      <JsonEditor
        data={response?.data ?? response ?? {}}
        onSave={() => {}}
        showSaveButton={false}
        {...jsonEditProps}
        maxWidth={viewport.width - 70}
        {...widthProps}
        showSearch={showSearch}
        searchPlaceholder={searchPlaceholder}
      />
    </>
  )
}

export default SummaryView
