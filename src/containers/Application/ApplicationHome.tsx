import React, { useEffect } from 'react'
import { Button, Message, Segment } from 'semantic-ui-react'
import { FullStructure, StageAndStatus, TemplateDetails } from '../../utils/types'
import useGetApplicationStructure from '../../utils/hooks/useGetApplicationStructure'
import { ApplicationSections, Loading } from '../../components'
import { useLanguageProvider } from '../../contexts/Localisation'
import { useRouter } from '../../utils/hooks/useRouter'
import usePageTitle from '../../utils/hooks/usePageTitle'
import { ApplicationStatus } from '../../utils/generated/graphql'
import { Link } from 'react-router-dom'
import ApplicationHomeWrapper from '../../components/Application/ApplicationHomeWrapper'

interface ApplicationProps {
  structure: FullStructure
  template: TemplateDetails
}

const ApplicationHome: React.FC<ApplicationProps> = ({ structure, template }) => {
  const { strings } = useLanguageProvider()
  const {
    query: { serialNumber },
    replace,
    push,
  } = useRouter()

  const { error, fullStructure } = useGetApplicationStructure({
    structure,
  })

  usePageTitle(strings.PAGE_TITLE_APPLICATION.replace('%1', serialNumber))

  useEffect(() => {
    if (!fullStructure) return
    const { status } = fullStructure.info.current as StageAndStatus
    if (status !== ApplicationStatus.Draft && status !== ApplicationStatus.ChangesRequired)
      replace(`/application/${serialNumber}/summary`)
  }, [fullStructure])

  const handleSummaryClicked = () => {
    push(`/application/${serialNumber}/summary`)
  }

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />
  if (!fullStructure || !fullStructure.responsesByCode) return <Loading />

  const {
    info: {
      current: { status },
      firstStrictInvalidPage,
    },
  } = fullStructure

  const SummaryButtonSegment: React.FC = () => {
    return status === ApplicationStatus.Draft && !firstStrictInvalidPage ? (
      <Segment basic className="padding-zero" textAlign="right">
        <Button as={Link} color="blue" onClick={handleSummaryClicked}>
          {strings.BUTTON_SUMMARY}
        </Button>
      </Segment>
    ) : null
  }

  return (
    <>
      <ApplicationHomeWrapper
        startMessage={structure.info.startMessage}
        name={template.name}
        title={strings.TITLE_OVERVIEW}
        subtitle={strings.SUBTITLE_APPLICATION_CHANGES_REQUIRED}
        ButtonSegment={SummaryButtonSegment}
      >
        <ApplicationSections fullStructure={fullStructure} />
      </ApplicationHomeWrapper>
    </>
  )
}

export default ApplicationHome
