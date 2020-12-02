import React from 'react'
import { Form, Header, Label, Segment } from 'semantic-ui-react'
import { ApplicationViewWrapper } from '../../formElementPlugins'
import { ElementState, ResponsesByCode } from '../../utils/types'

interface ElementsBoxProps {
  sectionTitle: string
  responsesByCode: ResponsesByCode
  elements: ElementState[]
  anyRequiredQuestions: boolean
}

const ElementsBox: React.FC<ElementsBoxProps> = ({
  sectionTitle,
  responsesByCode,
  elements,
  anyRequiredQuestions,
}) => {
  return elements ? (
    <Segment vertical>
      <Header content={sectionTitle} />
      <Form>
        {elements.map((element) => {
          const { code, pluginCode, parameters, isVisible, isRequired, isEditable } = element
          const response = responsesByCode[code]
          return (
            <ApplicationViewWrapper
              key={`question_${code}`}
              code={code}
              initialValue={response}
              pluginCode={pluginCode}
              parameters={parameters}
              isVisible={isVisible}
              isEditable={isEditable}
              isRequired={isRequired}
              allResponses={responsesByCode}
              currentResponse={response}
            />
          )
        })}
        {anyRequiredQuestions && <p>(*) Required questions</p>}
      </Form>
    </Segment>
  ) : (
    <Label content="Elements area can't be displayed" />
  )
}

export default ElementsBox
