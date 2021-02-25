import React from 'react'
import { Button, Grid, Icon, List, Progress } from 'semantic-ui-react'
import { Progress as ProgressType, SectionAndPage, SectionsStructureNEW } from '../../utils/types'
import strings from '../../utils/constants'

interface SectionsProgressProps {
  canEdit: boolean
  changes?: { state: boolean; label: string }
  sections: SectionsStructureNEW
  resumeApplication: (location: SectionAndPage) => void
}

interface SectionActionProps {
  sectionCode: string
  invalidPage?: number
  progress?: ProgressType
}

const SectionsProgress: React.FC<SectionsProgressProps> = ({
  canEdit,
  changes = { state: false, label: '' },
  sections,
  resumeApplication,
}) => {
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

  const SectionAction: React.FC<SectionActionProps> = ({ sectionCode, invalidPage, progress }) => {
    return (
      <Grid.Column style={{ minWidth: 100, padding: 0 }} width={2}>
        {canEdit ? (
          sectionCode === firstIncomplete?.sectionCode ? (
            <Button color="blue" onClick={() => resumeApplication(firstIncomplete)}>
              {strings.BUTTON_APPLICATION_RESUME}
            </Button>
          ) : progress?.completed ? (
            <Icon name="pencil square" color="blue" style={{ minWidth: 100 }} />
          ) : null
        ) : changes.state && invalidPage ? (
          <Button
            color="blue"
            onClick={() => resumeApplication({ sectionCode, pageName: `Page ${invalidPage}` })}
          >
            {changes.label}
          </Button>
        ) : null}
      </Grid.Column>
    )
  }

  // TODO: Use correct firstIncomplete sections
  const firstIncomplete: SectionAndPage = { sectionCode: 'S1', pageNumber: 1 }

  return (
    <List
      divided
      relaxed="very"
      items={Object.entries(sections).map(([sectionCode, { details, invalidPage, progress }]) => ({
        key: `list-item-${sectionCode}`,
        icon: progress ? getIndicator(progress) : null,
        header: (
          <Grid stackable style={{ minHeight: 50 }}>
            <Grid.Column style={{ minWidth: 100 }} floated="left" width={4}>
              <p>{details.title}</p>
            </Grid.Column>
            {canEdit && progress && <SectionProgress {...progress} />}
            {<SectionAction {...{ sectionCode, invalidPage, progress }} />}
          </Grid>
        ),
      }))}
    />
  )
}

export default SectionsProgress
