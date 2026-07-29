import React, { useRef, useState } from 'react'
import { Button, Header, Icon, List, Message } from 'semantic-ui-react'
import {
  ChangeRequestsProgress,
  FullStructure,
  ApplicationProgress,
  SectionAndPage,
} from '../../utils/types'
import { ApplicationProgressBar } from '../'
import { LoadingSmall } from '../common'
import { useLanguageProvider } from '../../contexts/Localisation'
import { useRouter } from '../../utils/hooks/useRouter'
import useRestartApplication from '../../utils/hooks/useRestartApplication'
import { ApplicationStatus } from '../../utils/generated/graphql'

interface ApplicationSectionsProps {
  fullStructure: FullStructure
}

const ApplicationSections: React.FC<ApplicationSectionsProps> = ({ fullStructure }) => {
  const { push } = useRouter()

  const {
    info: {
      serial,
      isChangeRequest,
      current: { status },
      firstStrictInvalidPage,
    },
    sections,
  } = fullStructure
  const isDraftStatus = status === ApplicationStatus.Draft

  const restartApplication = useRestartApplication(serial)

  // A restart re-creates application_responses for the WHOLE application, so
  // running it twice duplicates the entire response set. Every section with
  // outstanding change requests renders its own button, so the guard has to be
  // shared across all of them, not held per-button. The ref is the real gate --
  // it's written synchronously, so two clicks in the same tick can't both pass
  // the check before React re-renders. The state only drives the UI.
  const restartInFlight = useRef(false)
  const [restartingSection, setRestartingSection] = useState<string | null>(null)
  const [errorSection, setErrorSection] = useState<string | null>(null)

  const handleRestartClick = async ({ sectionCode, pageNumber }: SectionAndPage) => {
    if (restartInFlight.current) return
    restartInFlight.current = true
    setRestartingSection(sectionCode)
    setErrorSection(null)
    try {
      await restartApplication(fullStructure)
      // The guard is deliberately NOT released on success: push() unmounts this
      // component, and releasing it would re-enable the buttons for the frame
      // between the mutation resolving and the route changing.
      push(`/application/${serial}/${sectionCode}/Page${pageNumber}`)
    } catch (e) {
      console.log(e)
      restartInFlight.current = false
      setRestartingSection(null)
      setErrorSection(sectionCode)
    }
  }

  const handleResumeClick = ({ sectionCode, pageNumber }: SectionAndPage) => {
    push(`/application/${serial}/${sectionCode}/Page${pageNumber}`)
  }

  let isBeforeStrict = true

  const getIndicator = ({ completed, valid }: ApplicationProgress) => {
    return completed ? (
      <Icon name={valid ? 'check circle' : 'exclamation circle'} color={valid ? 'green' : 'red'} />
    ) : (
      <Icon name="circle outline" />
    )
  }

  return (
    <List
      celled
      relaxed="very"
      items={Object.entries(sections)
        .filter(([_, { details }]) => details.active)
        .map(([sectionCode, { details, progress, changeRequestsProgress }]) => {
          const isStrictSection = sectionCode === firstStrictInvalidPage?.sectionCode
          isBeforeStrict = isBeforeStrict
            ? firstStrictInvalidPage === null || !isStrictSection
            : false

          const sectionActionProps: ActionProps = {
            changeRequestsProgress,
            generalProgress: progress,
            resumeApplication: handleResumeClick,
            sectionCode,
          }

          // TODO: Create local component Section
          return {
            key: `list-item-${sectionCode}`,
            content: (
              <div className="section-single-row-box-container">
                <div className="centered-flex-box-row flex-grow-1">
                  {progress ? getIndicator(progress) : null}
                  <Header content={details.title} />
                </div>
                {(isDraftStatus || isChangeRequest) && progress && (
                  <ApplicationProgressBar {...progress} />
                )}
                <div className="actions-box">
                  {isChangeRequest ? (
                    <ActionsChangesRequest
                      {...sectionActionProps}
                      isDraftStatus={isDraftStatus}
                      restartApplication={handleRestartClick}
                      isRestarting={restartingSection !== null}
                      isThisSectionRestarting={restartingSection === sectionCode}
                      hasRestartError={errorSection === sectionCode}
                    />
                  ) : isDraftStatus ? (
                    <ActionGeneral
                      {...sectionActionProps}
                      isBeforeStrict={isBeforeStrict}
                      isStrictSection={isStrictSection}
                    />
                  ) : null}
                </div>
              </div>
            ),
          }
        })}
    />
  )
}

interface SectionEditProps {
  sectionCode: string
  resumeApplication: (location: SectionAndPage) => void
}

const SectionEdit: React.FC<SectionEditProps> = ({ sectionCode, resumeApplication }) => {
  return (
    <Icon
      link
      inverted
      name="edit"
      size="large"
      color="blue"
      onClick={() => resumeApplication({ sectionCode, pageNumber: 1 })}
    />
  )
}

interface ActionProps {
  changeRequestsProgress?: ChangeRequestsProgress
  generalProgress?: ApplicationProgress
  resumeApplication: (location: SectionAndPage) => void
  sectionCode: string
}

type ActionisChangesRequestProps = ActionProps & {
  isDraftStatus: boolean
  restartApplication: (location: SectionAndPage) => void
  // True while ANY section's restart is running -- see handleRestartClick
  isRestarting: boolean
  isThisSectionRestarting: boolean
  hasRestartError: boolean
}

const ActionsChangesRequest: React.FC<ActionisChangesRequestProps> = (props) => {
  const { t } = useLanguageProvider()
  const {
    sectionCode,
    generalProgress,
    changeRequestsProgress,
    isDraftStatus,
    restartApplication,
    resumeApplication,
    isRestarting,
    isThisSectionRestarting,
    hasRestartError,
  } = props
  if (!changeRequestsProgress) return null
  const { totalChangeRequests, doneChangeRequests } = changeRequestsProgress
  const totalRemainingUpdate = totalChangeRequests - doneChangeRequests || 0
  if (totalRemainingUpdate > 0) {
    if (hasRestartError) return <Message error title={t('ERROR_GENERIC')} />
    // Replaced rather than disabled, so a queued click can't land on it
    if (isThisSectionRestarting) return <LoadingSmall />
    return (
      <Button
        color="blue"
        disabled={isRestarting}
        content={`${t('LABEL_RESPONSE_UPDATE')} (${totalRemainingUpdate})`}
        onClick={() =>
          isDraftStatus
            ? resumeApplication({
                sectionCode,
                pageNumber: generalProgress?.firstStrictInvalidPage || 1,
              })
            : restartApplication({
                sectionCode,
                pageNumber: generalProgress?.firstStrictInvalidPage || 1,
              })
        }
      />
    )
  } else if (isDraftStatus) return <SectionEdit {...props} />

  return null
}

type ActionGeneralProps = ActionProps & {
  isStrictSection: boolean
  isBeforeStrict: boolean
}

// General is for Draft application - without changes requested (so not submitted yet)
const ActionGeneral: React.FC<ActionGeneralProps> = (props) => {
  const { t } = useLanguageProvider()
  const { sectionCode, generalProgress, isStrictSection, isBeforeStrict, resumeApplication } = props
  if (isStrictSection)
    return (
      <Button
        inverted
        color="blue"
        content={t('BUTTON_APPLICATION_RESUME')}
        onClick={() =>
          resumeApplication({
            sectionCode,
            pageNumber: generalProgress?.firstStrictInvalidPage || 1,
          })
        }
      />
    )

  if (generalProgress?.completed && isBeforeStrict) return <SectionEdit {...props} />

  return null
}

export default ApplicationSections
