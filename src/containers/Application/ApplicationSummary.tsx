import React, { useEffect, useState } from 'react'
import { ApplicationProps, MethodToCallProps, ResponsesByCode, User } from '../../utils/types'
import useSubmitApplication from '../../utils/hooks/useSubmitApplication'
import { useUserState } from '../../contexts/UserState'
import { ApplicationStatus } from '../../utils/generated/graphql'
import { useRouter } from '../../utils/hooks/useRouter'
import { Loading } from '../../components'
import { SectionWrapper } from '../../components/Application'
import strings from '../../utils/constants'
import { Button, Header, Message, Container, Segment } from 'semantic-ui-react'
import useQuerySectionActivation from '../../utils/hooks/useQuerySectionActivation'

const ApplicationSummary: React.FC<ApplicationProps> = ({
  structure: fullStructure,
  requestRevalidation,
}) => {
  const { replace, push } = useRouter()
  const [error, setError] = useState(false)

  const {
    userState: { currentUser },
  } = useUserState()

  const { submitFromStructure } = useSubmitApplication({
    serialNumber: fullStructure?.info.serial as string,
    currentUser: currentUser as User,
  })

  const { isSectionActive, toggleSection } = useQuerySectionActivation({
    defaultActiveSectionCodes: Object.keys(fullStructure?.sections),
  })

  useEffect(() => {
    if (!fullStructure) return

    // Re-direct based on application status
    if (fullStructure.info.current?.status === ApplicationStatus.ChangesRequired)
      replace(`/application/${fullStructure.info.serial}`)

    // Re-direct if application is not valid
    if (fullStructure.info.firstStrictInvalidPage) {
      const { sectionCode, pageNumber } = fullStructure.info.firstStrictInvalidPage
      replace(`/application/${fullStructure.info.serial}/${sectionCode}/Page${pageNumber}`)
    }
  }, [fullStructure])

  const handleSubmit = () => {
    requestRevalidation &&
      requestRevalidation(
        async ({ firstStrictInvalidPage, setStrictSectionPage }: MethodToCallProps) => {
          if (firstStrictInvalidPage) {
            const { sectionCode, pageNumber } = firstStrictInvalidPage
            setStrictSectionPage(firstStrictInvalidPage)
            replace(`/application/${fullStructure.info.serial}/${sectionCode}/Page${pageNumber}`)
          } else {
            try {
              await submitFromStructure(fullStructure)
              push(`/application/${fullStructure?.info.serial}/submission`)
            } catch (e) {
              console.log(e)
              setError(true)
            }
          }
        }
      )
  }

  if (error) return <Message error header={strings.ERROR_APPLICATION_SUBMIT} list={[error]} />
  if (!fullStructure) return <Loading />
  const { sections, responsesByCode, info } = fullStructure
  return (
    <Container style={{ paddingBottom: 60 }}>
      <Header
        textAlign="center"
        style={{
          color: 'rgb(150,150,150)',
          letterSpacing: 1,
          textTransform: 'uppercase',
          fontWeight: 400,
          fontSize: 24,
          paddingTop: 25,
        }}
      >
        {currentUser?.organisation?.orgName || strings.TITLE_NO_ORGANISATION}
      </Header>
      <Segment
        className="sup"
        style={{
          background: 'white',
          border: 'none',
          borderRadius: 0,
          boxShadow: 'none',
          paddingTop: 25,
        }}
      >
        <Header
          as="h1"
          textAlign="center"
          style={{ fontSize: 26, fontWeight: 900, letterSpacing: 1, marginBottom: 4 }}
          content="Review and submit"
        />
        <Header
          textAlign="center"
          style={{ marginTop: 4, color: '#4A4A4A', fontSize: 16, letterSpacing: 0.36 }}
          as="h3"
        >
          Please review each section before submitting form
        </Header>
        {Object.values(sections).map((section) => (
          <SectionWrapper
            key={`ApplicationSection_${section.details.id}`}
            isActive={isSectionActive(section.details.code)}
            toggleSection={toggleSection(section.details.code)}
            section={section}
            responsesByCode={responsesByCode as ResponsesByCode}
            serial={info.serial}
            isSummary
            canEdit={info.current?.status === ApplicationStatus.Draft}
          />
        ))}
        {/* <ModalWarning showModal={showModal} /> */}
      </Segment>
      {info.current?.status === ApplicationStatus.Draft ? (
        <Container
          style={{
            background: 'white',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            boxShadow: '0px -6px 3px -3px #AAAAAA',
            paddingTop: 10,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              style={{ alignSelf: 'flex-end', marginRight: 30 }}
              color="blue"
              onClick={handleSubmit}
              content={strings.BUTTON_SUBMIT}
            />
          </div>
        </Container>
      ) : null}
    </Container>
  )
}

export default ApplicationSummary
