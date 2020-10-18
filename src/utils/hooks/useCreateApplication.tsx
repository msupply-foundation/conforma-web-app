import { useState, useEffect } from 'react'
import { Application,
    CreateApplicationMutation,
    CreateSectionMutation,
    useCreateApplicationMutation,
    useCreateSectionMutation,
  } from '../../utils/generated/graphql'
  import getApplicationQuery from '../../utils/graphql/queries/getApplication.query'
import { SectionPayload } from '../types'

const useCreateApplication = () => {
    const [ serialNumber, setSerialNumber ] = useState<number | null>(null)

    const [ applicationMutation ] = useCreateApplicationMutation({
        onCompleted: (data: CreateApplicationMutation) => {           
            onCreateApplicationCompleted(data, setSerialNumber, sectionMutation)
    }})

    const [ sectionMutation ] = useCreateSectionMutation({
        onCompleted: onCreateSectionsCompleted,
        // Update cached query of getApplication
        refetchQueries: [
            {
                query: getApplicationQuery,
                variables: { serial: serialNumber },
            },
        ],
    })

    return {
        applicationMutation 
    }
}
  
function onCreateApplicationCompleted ({createApplication}: CreateApplicationMutation, 
    setSerialNumber: React.Dispatch<React.SetStateAction<number| null>>, 
    createSectionMutation: any) {
    if (createApplication) {
        const { application } = createApplication
        if (application && application.template && application.template.templateSections) {
            setSerialNumber(application.serial as number)
            const sections = application.template.templateSections.nodes.map((section) =>
                section ? section.id : -1
            )
            console.log(`Success to create application ${application.serial}!`)
        
            createApplicationSection({ applicationId: application.id, templateSections: sections }, createSectionMutation)
        } else console.log('Create application failed - no sections!')
    } else console.log('Create application failed - no data!')
}
  
  function createApplicationSection (payload: SectionPayload, createSectionMutation: any) {
    const { applicationId, templateSections } = payload
    try {
      templateSections.forEach((sectionId) => {
        createSectionMutation({
          variables: {
            applicationId,
            templateSectionId: sectionId,
          }
        })
      })
    } catch (error) {
      console.error(error)
    }
  }
    
  function onCreateSectionsCompleted ({ createApplicationSection }: CreateSectionMutation) {
    if (
      createApplicationSection &&
      createApplicationSection.applicationSection &&
      createApplicationSection.applicationSection.templateSection
    ) {
      const section = createApplicationSection.applicationSection.templateSection
      console.log(`Success to create application section ${section.title}`)
    } else console.log('Create application section failed - no data!')
  }

export default useCreateApplication