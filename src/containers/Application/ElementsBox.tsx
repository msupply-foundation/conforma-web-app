import React from 'react'
import { Header, Label, Segment } from 'semantic-ui-react'
import { ApplicationViewWrapper } from '../../elementPlugins'
import useGetSectionElementAndResponses from '../../utils/hooks/useGetSectionElementAndResponses'
import { Loading } from '../../components'
import {
  ApplicationElementStates,
  ElementAndResponse,
  ResponsesByCode,
  ResponsesFullByCode,
} from '../../utils/types'

interface ElementsBoxProps {
  serialNumber: string
  sectionTitle: string
  sectionTemplateId: number
  sectionPage: number
  responsesByCode: ResponsesByCode
  responsesFullByCode: ResponsesFullByCode
  elementsState: ApplicationElementStates
}

const ElementsBox: React.FC<ElementsBoxProps> = ({
  serialNumber,
  sectionTitle,
  sectionTemplateId: sectionTempId,
  sectionPage,
  responsesByCode,
}) => {
  const { elements, loading, error } = useGetSectionElementAndResponses({
    serialNumber,
    sectionTempId,
  })

  return error ? (
    <Label content="Problem to load elements" error={error} />
  ) : loading ? (
    <Loading />
  ) : elements && elements[sectionPage] ? (
    <Segment vertical>
      <Header content={sectionTitle} />
      {elements[sectionPage].map(({ element, response }: ElementAndResponse) => (
        <ApplicationViewWrapper
          key={`question_${element.code}`}
          code={element.code}
          initialValue={response?.text}
          pluginCode={element.elementTypePluginCode}
          isVisible={element.isVisible}
          isEditable={element.isEditable}
          isRequired={element.isRequired}
          parameters={element.parameters}
          allResponses={responsesByCode}
          currentResponse={response}
        />
      ))}
    </Segment>
  ) : (
    <Label content="Elements area can't be displayed" />
  )
}

export default ElementsBox
