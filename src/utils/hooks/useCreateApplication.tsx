import { useState } from 'react'
import {
  Application,
  ApplicationSection,
  CreateApplicationMutation,
  CreateResponseMutation,
  CreateSectionMutation,
  TemplateElement,
  TemplateSection,
  useCreateApplicationMutation,
  useCreateResponseMutation,
  useCreateSectionMutation,
} from '../../utils/generated/graphql'
import getApplicationQuery from '../../utils/graphql/queries/getApplication.query'
import { ResponsePayload, SectionPayload } from '../types'

const useCreateApplication = () => {
  const [serialNumber, setSerialNumber] = useState<string | null>(null)
  const [responses, setCompletedResponse] = useState({})

  const [applicationMutation] = useCreateApplicationMutation({
    onCompleted: (data: CreateApplicationMutation) =>
      onCreateApplicationCompleted(data, setSerialNumber, sectionMutation),
  })

  const [sectionMutation] = useCreateSectionMutation({
    onCompleted: (data: CreateSectionMutation) =>
      onCreateSectionCompleted(data, responseMutation, responses, setCompletedResponse),

    // Update cached query of getApplication
    refetchQueries: [
      {
        query: getApplicationQuery,
        variables: { serial: serialNumber },
      },
    ],
  })

  const [responseMutation] = useCreateResponseMutation({
    onCompleted: (data: CreateResponseMutation) =>
      onCreateResponseCompleted(data, responses, setCompletedResponse),
    // TODO: Update cached query of getResponses -- if needed
  })

  return {
    applicationMutation,
    responses,
  }
}

function onCreateApplicationCompleted(
  { createApplication }: CreateApplicationMutation,
  setSerialNumber: React.Dispatch<React.SetStateAction<string | null>>,
  sectionMutation: any
) {
  const { id, serial, template } = createApplication?.application as Application
  const sectionsIds = template?.templateSections.nodes.map((section) =>
    section ? section.id : null
  )

  if (id && serial && sectionsIds) {
    console.log(`Success to create application: ${serial}!`)
    setSerialNumber(serial)
    createApplicationSections(
      {
        applicationId: id,
        templateSections: sectionsIds,
      },
      sectionMutation
    )
  } else console.log('Failed to create application - wrong data!', createApplication)
}

function createApplicationSections(payload: SectionPayload, sectionMutation: any) {
  const { applicationId, templateSections } = payload
  try {
    templateSections.forEach((id) => {
      sectionMutation({
        variables: {
          applicationId,
          templateSectionId: id,
        },
      })
    })
  } catch (error) {
    console.error(error)
  }
}

function onCreateSectionCompleted(
  { createApplicationSection }: CreateSectionMutation,
  responseMutation: any,
  responses: object,
  setCompletedResponse: (responses: object) => void
) {
  const {
    applicationId,
    templateSection,
  } = createApplicationSection?.applicationSection as ApplicationSection
  const elements = templateSection?.templateElementsBySectionId.nodes as TemplateElement[]

  if (applicationId && templateSection && elements) {
    const questions = elements.filter(({ category }) => category === 'QUESTION')
    console.log(`Success to create application section: ${templateSection.title}`)

    createApplicationResponse(
      {
        applicationId: applicationId as number,
        templateQuestions: questions,
      },
      responseMutation,
      responses,
      setCompletedResponse
    )
  } else console.log('Failed to create application section - wrong data!', createApplicationSection)
}

function createApplicationResponse(
  payload: ResponsePayload,
  responseMutation: any,
  responses: object,
  setCompletedResponse: (responses: object) => void
) {
  const { applicationId, templateQuestions } = payload
  try {
    templateQuestions.forEach(({ id, code }) => {
      setCompletedResponse({ ...responses, [code]: false })
      responseMutation({
        variables: {
          applicationId,
          templateElementId: id,
          timeCreated: new Date(Date.now()),
        },
      })
    })
  } catch (error) {
    console.error(error)
  }
}

function onCreateResponseCompleted(
  { createApplicationResponse }: CreateResponseMutation,
  responses: object,
  setCompletedResponse: (responses: object) => void
) {
  const question = createApplicationResponse?.applicationResponse
    ?.templateElement as TemplateElement
  if (question) {
    console.log(`Success to create application response: ${question.code}`)
    setCompletedResponse({ ...responses, [question.code]: true })
  } else
    console.log('Failed to create application response - wrong data!', createApplicationResponse)

  // TODO: Should return an error
}

export default useCreateApplication
