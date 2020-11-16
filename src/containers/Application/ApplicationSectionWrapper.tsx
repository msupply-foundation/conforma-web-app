import React from 'react'
import { Grid, Message, Segment } from 'semantic-ui-react'
import ElementsBox from './ElementsBox'
import NavigationBox from './NavigationBox'
import { Loading, ProgressBar } from '../../components'
import { useRouter } from '../../utils/hooks/useRouter'
import useGetProgressInSections from '../../utils/hooks/useGetProgressInSections'
import { TemplateSectionPayload, ResponsesByCode, ResponsesFullByCode } from '../../utils/types'

interface ApplicationSectionWrapperProps {
  applicationId: number
  templateSections: TemplateSectionPayload[]
  responsesByCode: ResponsesByCode
  responsesFullByCode: ResponsesFullByCode
  elementsState: any
}

const ApplicationSectionWrapper: React.FC<ApplicationSectionWrapperProps> = ({
  applicationId,
  templateSections,
  responsesByCode,
  responsesFullByCode,
  elementsState,
}) => {
  const { query, push } = useRouter()
  const { serialNumber, sectionCode, page } = query

  const currentSection = templateSections.find(({ code }) => code === sectionCode)

  console.log(
    'ApplicationSectionWrapper',
    applicationId,
    templateSections,
    responsesByCode,
    responsesFullByCode,
    elementsState
  )

  const { processing, progressInSections } = useGetProgressInSections({
    applicationId: applicationId,
    currentSection,
    currentPage: Number(page),
    elementsState,
    templateSections,
  })

  return !currentSection ? (
    <Message error header="Problem to load sections" />
  ) : (
    <Segment.Group>
      <Grid stackable>
        <Grid.Column width={4}>
          <ProgressBar
            serialNumber={serialNumber as string}
            currentSectionPage={{ sectionIndex: currentSection.index, currentPage: Number(page) }}
            templateSections={templateSections}
            push={push}
          />
        </Grid.Column>
        <Grid.Column width={12} stretched>
          <ElementsBox
            applicationId={applicationId}
            sectionTitle={currentSection.title}
            sectionTemplateId={currentSection.id}
            sectionPage={Number(page)}
            responsesByCode={responsesByCode}
            responsesFullByCode={responsesFullByCode}
            elementsState={elementsState}
          />
          <NavigationBox templateSections={templateSections} />
        </Grid.Column>
      </Grid>
    </Segment.Group>
  )
}

export default ApplicationSectionWrapper
