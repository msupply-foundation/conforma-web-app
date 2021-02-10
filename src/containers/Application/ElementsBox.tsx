import React from 'react'
import { Form, Header, Label, Segment } from 'semantic-ui-react'
import { ApplicationViewWrapper } from '../../formElementPlugins'
import { PageElements, ResponsesByCode } from '../../utils/types'
import strings from '../../utils/constants'

interface ElementsBoxProps {
  sectionTitle: string
  responsesByCode: ResponsesByCode
  pageElements: PageElements
  forceValidation: boolean
}

const ElementsBox: React.FC<ElementsBoxProps> = ({
  sectionTitle,
  responsesByCode,
  pageElements,
  forceValidation,
}) => {
  return pageElements ? (
    <Segment vertical style={{ marginBottom: 20 }}>
      <Header content={sectionTitle} />
      <Form>
        {pageElements.map(({ element }) => {
          const {
            code,
            pluginCode,
            parameters,
            isVisible,
            isRequired,
            isEditable,
            validation,
            validationMessage,
          } = element
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
              validationExpression={validation}
              validationMessage={validationMessage}
              allResponses={responsesByCode}
              currentResponse={response}
              forceValidation={forceValidation}
            />
          )
        })}
      </Form>
    </Segment>
  ) : (
    <Label content={strings.ERROR_APPLICATION_ELEMENTS} />
  )
}

export default ElementsBox
