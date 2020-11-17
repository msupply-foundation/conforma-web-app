import React from 'react'
import { Header, Label, Segment } from 'semantic-ui-react'
import { ApplicationViewWrapper } from '../../elementPlugins'
import useLoadElementsOfSection from '../../utils/hooks/useLoadElementsOfSection'
import { Loading } from '../../components'
import { useUpdateResponseMutation } from '../../utils/generated/graphql'
import { ApplicationElementState, ResponsesByCode, ResponsesFullByCode } from '../../utils/types'
import evaluateExpression from '@openmsupply/expression-evaluator'

interface ElementsBoxProps {
  applicationId: number
  sectionTitle: string
  sectionTemplateId: number
  sectionPage: number
  responsesByCode: ResponsesByCode
  responsesFullByCode: ResponsesFullByCode
  elementsState: ApplicationElementState
}

const ElementsBox: React.FC<ElementsBoxProps> = ({
  applicationId,
  sectionTitle,
  sectionTemplateId: sectionTempId,
  sectionPage,
  responsesByCode,
  responsesFullByCode,
  elementsState,
}) => {
  const { elements, loading, error } = useLoadElementsOfSection({
    applicationId,
    sectionTempId,
    sectionPage,
  })

  const [responseMutation] = useUpdateResponseMutation()

  return error ? (
    <Label content="Problem to load elements" error={error} />
  ) : loading ? (
    <Loading />
  ) : elements ? (
    <Segment vertical>
      <Header content={sectionTitle} />
      {elements.map(({ question, response }) => (
        <ApplicationViewWrapper
          key={`question_${question.code}`}
          initialValue={response?.value}
          templateElement={question}
          isVisible={elementsState[question.code].isVisible}
          isEditable={elementsState[question.code].isEditable}
          isRequired={elementsState[question.code].isRequired}
          allResponses={responsesByCode}
          evaluator={evaluateExpression}
          onUpdate={(updateObject) => {
            const { isValid, value } = updateObject
            /**
             * Note: Issue #46 (Persist cache) will change this to only write to cache
             * sending the whole application changes to the server on Submit...
             * Also considering send to server on 'Next' or adding a Save button.
             **/
            // TODO: Only send mutation on loose focus event.
            responseMutation({
              variables: { id: response?.id as number, value, isValid },
            })
          }}
        />
      ))}
    </Segment>
  ) : (
    <Label content="Elements area can't be displayed" />
  )
}

export default ElementsBox
