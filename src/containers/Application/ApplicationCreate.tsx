import React, { useEffect, useState } from 'react'
import { Button, Message, Segment } from 'semantic-ui-react'
import { ApplicationContainer, Loading } from '../../components'
import { useUserState } from '../../contexts/UserState'
import useCreateApplication from '../../utils/hooks/useCreateApplication'
import useLoadTemplate from '../../utils/hooks/useLoadTemplate'
import { useRouter } from '../../utils/hooks/useRouter'
import usePageTitle from '../../utils/hooks/usePageTitle'
import strings from '../../utils/constants'
import { SectionsList } from '../../components/Sections'
import ApplicationHomeWrapper from '../../components/Application/ApplicationHomeWrapper'
import { ElementForEvaluation, EvaluatorNode, User } from '../../utils/types'
import { evaluateElements } from '../../utils/helpers/evaluateElements'
import useGetApplicationSerial from '../../utils/hooks/useGetApplicationSerial'

const ApplicationCreate: React.FC = () => {
  const {
    push,
    query: { type },
  } = useRouter()
  const {
    userState: { currentUser },
  } = useUserState()
  const { error, loading, template } = useLoadTemplate({
    templateCode: type,
  })
  const { getSerialAsync } = useGetApplicationSerial()
  const [newApplicationError, setNewApplicationError] = useState<Error | null>(null)
  const [newApplicationLoading, setNewApplicationLoading] = useState<boolean>(false)
  usePageTitle(strings.PAGE_TITLE_CREATE)

  const { error: creationError, create } = useCreateApplication()

  useEffect(() => {
    if (template && !template?.startMessage) handleCreate()
  }, [template?.startMessage])

  const handleCreate = async (_?: any) => {
    try {
      if (!template?.sections) {
        throw new Error('Problem creating application, template information is missing')
      }
      setNewApplicationLoading(true)

      const { name, elementsIds, elementsDefaults } = template
      const defaultValues = await getDefaultValues(elementsDefaults || [], currentUser)

      const mutationResult = await create({
        name,
        templateId: template.id,
        templateResponses: (elementsIds as number[]).map((id, index) => ({
          templateElementId: id,
          value: defaultValues[index],
        })),
      })
      const applicationId = mutationResult.data?.createApplication?.application?.id
      if (!applicationId) throw new Error('Application mutation did not return id')

      const serial = await getSerialAsync(applicationId)

      const firstSection = template.sections[0].code
      // The pageNumber starts in 1 when is a new application
      push(`${serial}/${firstSection}/Page1`)
    } catch (e) {
      setNewApplicationError(e)
    }
  }

  if (error || creationError || newApplicationError)
    return (
      <Message
        error
        title={strings.ERROR_APPLICATION_CREATE}
        list={[error, creationError?.message || '', newApplicationError?.message || '']}
      />
    )

  // if (!template) return <ApplicationSelectType /> // TODO
  if (loading || !template?.startMessage || newApplicationLoading) return <Loading />

  if (!template) return null

  const StartButtonSegment: React.FC = () => {
    return (
      <Segment basic className="padding-zero">
        <Button
          color="blue"
          className="button-wide"
          loading={newApplicationLoading}
          onClick={handleCreate}
        >
          {strings.BUTTON_APPLICATION_START}
        </Button>
      </Segment>
    )
  }

  return template?.sections ? (
    <ApplicationContainer template={template}>
      <ApplicationHomeWrapper
        startMessage={template.startMessage}
        name={template.name}
        title={strings.TITLE_INTRODUCTION}
        subtitle={strings.SUBTITLE_APPLICATION_STEPS}
        ButtonSegment={StartButtonSegment}
      >
        <SectionsList sections={template.sections} />
      </ApplicationHomeWrapper>
    </ApplicationContainer>
  ) : null
}

export const getDefaultValues = async (
  defaultValueExpressions: EvaluatorNode[],
  currentUser: User | null
) => {
  const evaluationElements: ElementForEvaluation[] = defaultValueExpressions.map(
    (defaultValueExpression) => ({ defaultValueExpression, code: '' })
  )

  const evaluatedElements = await evaluateElements(evaluationElements, ['defaultValue'], {
    currentUser,
  })
  return evaluatedElements.map(({ defaultValue }) => defaultValue)
}

export default ApplicationCreate
