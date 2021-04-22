import React from 'react'
import { Button, Header, Icon, List, Progress } from 'semantic-ui-react'
import {
  ChangeRequestsProgress,
  FullStructure,
  ApplicationProgress,
  SectionAndPage,
} from '../../utils/types'
import strings from '../../utils/constants'
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

  const handleRestartClick = async ({ sectionCode, pageNumber }: SectionAndPage) => {
    await restartApplication(fullStructure)
    push(`/application/${serial}/${sectionCode}/Page${pageNumber}`)
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
      divided
      relaxed="very"
      items={Object.entries(sections).map(
        ([sectionCode, { details, progress, changeRequestsProgress }]) => {
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

          return {
            key: `list-item-${sectionCode}`,
            content: (
              <div className="line-vertical-box">
                <div className="left">
                  {progress ? getIndicator(progress) : null}
                  <Header content={details.title} />
                </div>
                {(isDraftStatus || isChangeRequest) && progress && (
                  <SectionProgress {...progress} />
                )}
                <div className="actions-box">
                  {isChangeRequest ? (
                    <ActionisChangesRequest
                      {...sectionActionProps}
                      isDraftStatus={isDraftStatus}
                      restartApplication={handleRestartClick}
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
        }
      )}
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
      name="pencil square"
      color="blue"
      onClick={() => resumeApplication({ sectionCode, pageNumber: 1 })}
    />
  )
}

const SectionProgress: React.FC<ApplicationProgress> = ({
  doneRequired,
  doneNonRequired,
  totalSum,
  valid,
}) => {
  const totalDone = doneRequired + doneNonRequired
  return totalDone > 0 && totalSum > 0 ? (
    <div className="progress-box">
      <Progress
        className="progress"
        percent={(100 * totalDone) / totalSum}
        size="tiny"
        success={valid}
        error={!valid}
      />
    </div>
  ) : null
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
}

const ActionisChangesRequest: React.FC<ActionisChangesRequestProps> = (props) => {
  const {
    sectionCode,
    generalProgress,
    changeRequestsProgress,
    isDraftStatus,
    restartApplication,
    resumeApplication,
  } = props
  if (!changeRequestsProgress) return null
  const { totalChangeRequests, doneChangeRequests } = changeRequestsProgress
  const totalRemainingUpdate = totalChangeRequests - doneChangeRequests || 0
  if (totalRemainingUpdate > 0)
    return (
      <Button
        color="blue"
        content={`${strings.LABEL_APPLICATION_UPDATE} (${totalRemainingUpdate})`}
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
  else if (isDraftStatus) return <SectionEdit {...props} />

  return null
}

type ActionGeneralProps = ActionProps & {
  isStrictSection: boolean
  isBeforeStrict: boolean
}

// General is for Draft application - without changes requested (so not submitted yet)
const ActionGeneral: React.FC<ActionGeneralProps> = (props) => {
  const { sectionCode, generalProgress, isStrictSection, isBeforeStrict, resumeApplication } = props
  if (isStrictSection)
    return (
      <Button
        inverted
        color="blue"
        content={strings.BUTTON_APPLICATION_RESUME}
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
