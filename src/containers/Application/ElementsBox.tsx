import React from 'react'
import { Header, Label, Segment } from 'semantic-ui-react'
import { ApplicationViewWrapper } from '../../formElementPlugins'
import { ApplicationElementStates, ResponsesFullByCode } from '../../utils/types'
import getPageElements from '../../utils/helpers/getPageElements'

interface ElementsBoxProps {
  sectionTitle: string
  sectionIndex: number
  sectionPage: number
  responsesFullByCode: ResponsesFullByCode
  elementsState: ApplicationElementStates
}

const ElementsBox: React.FC<ElementsBoxProps> = ({
  sectionTitle,
  sectionIndex,
  sectionPage,
  responsesFullByCode,
  elementsState,
}) => {
  const elements = getPageElements({ elementsState, sectionIndex, pageNumber: sectionPage })
  return elements ? (
    <Segment vertical>
      <Header content={sectionTitle} />
      {elements.map((element) => {
        const { code, pluginCode, parameters, isVisible, isRequired, isEditable } = element
        const response = responsesFullByCode[code]
        return (
          <ApplicationViewWrapper
            key={`question_${code}`}
            code={code}
            initialValue={response?.text}
            pluginCode={pluginCode}
            parameters={parameters}
            isVisible={isVisible}
            isEditable={isEditable}
            isRequired={isRequired}
            allResponses={responsesFullByCode}
            currentResponse={response}
          />
        )
      })}
    </Segment>
  ) : (
    <Label content="Elements area can't be displayed" />
  )
}

export default ElementsBox
