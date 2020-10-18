import { useState } from 'react'
import {
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
    const [ serialNumber, setSerialNumber ] = useState<number | null>(null)

    const [ applicationMutation ] = useCreateApplicationMutation({
        onCompleted: (data: CreateApplicationMutation) =>         
            onCreateApplicationCompleted(data, setSerialNumber, sectionMutation)
    })

    const [ sectionMutation ] = useCreateSectionMutation({
        onCompleted: (data: CreateSectionMutation) => 
            onCreateSectionCompleted(data, responseMutation),
        
        // Update cached query of getApplication
        refetchQueries: [
            {
                query: getApplicationQuery,
                variables: { serial: serialNumber },
            },
        ],
    })

    const [ responseMutation ] = useCreateResponseMutation({
        onCompleted: onCreateResponseCompleted,
        // TODO: Update cached query of getResponses -- if needed
    })

    return {
        applicationMutation 
    }
}
  
function onCreateApplicationCompleted ({createApplication}: CreateApplicationMutation, 
    setSerialNumber: React.Dispatch<React.SetStateAction<number| null>>, 
    sectionMutation: any) {
    if (createApplication) {
        const { application } = createApplication
        if (application && application.template && application.template.templateSections) {
            setSerialNumber(application.serial as number)
            const sections = application.template.templateSections.nodes.map((section) =>
                section ? section.id : -1
            )
            console.log(`Success to create application ${application.serial}!`)
        
            createApplicationSections({ applicationId: application.id, templateSections: sections }, sectionMutation)
        } else console.log('Create application failed - no sections!')
    } else console.log('Create application failed - no data!')
}
  
function createApplicationSections (payload: SectionPayload, sectionMutation: any) {
    const { applicationId, templateSections } = payload
    try {
        templateSections.forEach((sectionId) => {
            if (sectionId !== -1) {
                sectionMutation({
                    variables: {
                        applicationId,
                        templateSectionId: sectionId,
                    }
                })
            }
        })
    } catch (error) {
        console.error(error)
    }
}

function onCreateSectionCompleted ({ createApplicationSection }: CreateSectionMutation, responseMutation: any) {
    if (
        createApplicationSection &&
        createApplicationSection.applicationSection &&
        createApplicationSection.applicationSection.templateSection
    ) {
        const { applicationId } = createApplicationSection.applicationSection
        const section = createApplicationSection.applicationSection.templateSection as TemplateSection
        const elements = section.templateElementsBySectionId.nodes as TemplateElement[]
        const questions = elements.filter(({category}) => category === 'QUESTION')
        console.log(`Success to create application section ${section.title}`)

        createApplicationResponse({ 
            applicationId: applicationId as number, 
            templateQuestions: questions
        }, responseMutation)

    } else console.log('Create application section failed - no data!')
}

function createApplicationResponse (payload: ResponsePayload, responseMutation: any) {
    const { applicationId, templateQuestions } = payload
    try {
        templateQuestions.forEach(({id}) => {
            responseMutation({
                variables: {
                    applicationId,
                    templateElementId: id,
                    timeCreated: new Date(Date.now())
                }
            })
        })
    } catch (error) {
        console.error(error)
    }
}

function onCreateResponseCompleted ({ createApplicationResponse }: CreateResponseMutation) {
    if (
        createApplicationResponse &&
        createApplicationResponse.applicationResponse &&
        createApplicationResponse.applicationResponse.templateElement
    ) {
        const question = createApplicationResponse.applicationResponse.templateElement
        console.log(`Success to create application response ${question.code}`)
    } else console.log('Create application response failed - no data!')
}

export default useCreateApplication