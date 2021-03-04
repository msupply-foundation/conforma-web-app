import React from 'react'
import { Button, Grid, Icon, List, Progress } from 'semantic-ui-react'
import { Progress as ProgressType, SectionAndPage, SectionsStructureNEW } from '../../utils/types'
import strings from '../../utils/constants'

interface SectionsProgressProps {
  canEdit: boolean
  changes?: { state: boolean; label: string }
  firstStrictInvalidPage: SectionAndPage | null
  sections: SectionsStructureNEW
  resumeApplication: (location: SectionAndPage) => void
}

interface SectionActionProps {
  sectionCode: string
  firstStrictInvalidPage: SectionAndPage | null
  progress?: ProgressType
}

const SectionsProgress: React.FC<SectionsProgressProps> = ({
  canEdit,
  changes = { state: false, label: '' },
  firstStrictInvalidPage,
  sections,
  resumeApplication,
}) => {
  let isBeforeStrict = false

  const getIndicator = ({ completed, valid }: ProgressType) => {
    return completed ? (
      <Icon name={valid ? 'check circle' : 'exclamation circle'} color={valid ? 'green' : 'red'} />
    ) : (
      <Icon name="circle outline" />
    )
  }

  const SectionProgress: React.FC<ProgressType> = ({
    doneRequired,
    doneNonRequired,
    totalSum,
    valid,
  }) => {
    const totalDone = doneRequired + doneNonRequired
    return totalDone > 0 && totalSum > 0 ? (
      <Grid.Column style={{ width: 200, paddingRight: '5%' }} floated="right" width={4}>
        <Progress
          style={{ width: 200 }}
          percent={(100 * totalDone) / totalSum}
          size="tiny"
          success={valid}
          error={!valid}
        />
      </Grid.Column>
    ) : null
  }

  const SectionAction: React.FC<SectionActionProps> = ({
    sectionCode,
    firstStrictInvalidPage,
    progress,
  }) => {
    const isStrictSection = sectionCode === firstStrictInvalidPage?.sectionCode
    isBeforeStrict = isBeforeStrict ? firstStrictInvalidPage === null || !isStrictSection : false

    return (
      <Grid.Column style={{ minWidth: 100, padding: 0 }} verticalAlign="middle" width={2}>
        {canEdit ? (
          isStrictSection ? (
            <Button
              color="blue"
              onClick={() =>
                resumeApplication({
                  sectionCode,
                  pageNumber: firstStrictInvalidPage?.pageNumber || 1,
                })
              }
            >
              {strings.BUTTON_APPLICATION_RESUME}
            </Button>
          ) : progress?.completed && isBeforeStrict ? (
            <Icon
              name="pencil square"
              color="blue"
              style={{ minWidth: 100 }}
              onClick={() => resumeApplication({ sectionCode, pageNumber: 1 })}
            />
          ) : null
        ) : changes.state && isStrictSection ? (
          <Button
            color="blue"
            onClick={() =>
              resumeApplication({
                sectionCode,
                pageNumber: firstStrictInvalidPage?.pageNumber || 1,
              })
            }
          >
            {changes.label}
          </Button>
        ) : null}
      </Grid.Column>
    )
  }

  return (
    <List
      divided
      relaxed="very"
      items={Object.entries(sections).map(([sectionCode, { details, progress }]) => ({
        key: `list-item-${sectionCode}`,
        icon: progress ? getIndicator(progress) : null,
        header: (
          <Grid stackable style={{ minHeight: 50 }}>
            <Grid.Column style={{ minWidth: 100 }} floated="left" width={4}>
              <p>{details.title}</p>
            </Grid.Column>
            {canEdit && progress && <SectionProgress {...progress} />}
            {<SectionAction {...{ sectionCode, firstStrictInvalidPage, progress }} />}
          </Grid>
        ),
      }))}
    />
  )
}

export default SectionsProgress
