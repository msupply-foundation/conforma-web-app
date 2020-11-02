import React from 'react'
import { Header, Label, Segment } from 'semantic-ui-react'
import { ApplicationViewWrapper } from '../../elementPlugins'
import useLoadElements from '../../utils/hooks/useLoadElements'
import { Loading } from '../../components'
import { useUpdateResponseMutation } from '../../utils/generated/graphql'

interface ElementsBoxProps {
  applicationId: number
  sectionTitle: string
  sectionTemplateId: number
  sectionPage: number
}

const ElementsBox: React.FC<ElementsBoxProps> = ({
  applicationId,
  sectionTitle,
  sectionTemplateId: sectionTempId,
  sectionPage,
}) => {
  const { elements, loading, error } = useLoadElements({
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
          onUpdate={(updateObject) => {
            const { isValid, value } = updateObject
            /**
             * Note: Issue #46 (Persist cache) will change this to only write to cache
             * sending the whole application changes to the server on Submit...
             * Also considering send to server on 'Next' or adding a Save button.
             **/
            // TODO: Only send mutation on loose focus event.
            if (isValid) responseMutation({ variables: { id: response?.id as number, value } })
          }}
          isVisible={true}
          isEditable={true}
        />
      ))}
    </Segment>
  ) : (
    <Label content="Elements area can't be displayed" />
  )
}

export default ElementsBox
