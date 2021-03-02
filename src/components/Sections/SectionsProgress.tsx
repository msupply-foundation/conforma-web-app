import React from 'react'
import { Button, Grid, Icon, List, Progress } from 'semantic-ui-react'
import { Progress as ProgressType, SectionAndPage, SectionsStructureNEW } from '../../utils/types'
import strings from '../../utils/constants'

interface SectionsProgressProps {
  sections: SectionsStructureNEW
  resumeApplication: (location: SectionAndPage) => void
}

const SectionsProgress: React.FC<SectionsProgressProps> = ({ sections, resumeApplication }) => {
  const getIndicator = ({ completed, valid }: ProgressType) => {
    return completed ? (
      <Icon name={valid ? 'check circle' : 'exclamation circle'} color={valid ? 'green' : 'red'} />
    ) : (
      <Icon name="circle outline" />
    )
  }

  const getProgress = ({ doneRequired, doneNonRequired, totalSum, valid }: ProgressType) => {
    const totalDone = doneRequired + doneNonRequired
    return totalDone > 0 && totalSum > 0 ? (
      <Progress
        style={{ width: 200 }}
        percent={(100 * totalDone) / totalSum}
        size="tiny"
        success={valid}
        error={!valid}
      />
    ) : null
  }

  // TODO: Use correct firstIncomplete sections
  const firstIncomplete: SectionAndPage = { sectionCode: 'S1', pageNumber: 1 }

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
            <Grid.Column style={{ width: 200, paddingRight: '5%' }} floated="right" width={4}>
              {progress && getProgress(progress)}
            </Grid.Column>
            <Grid.Column style={{ minWidth: 100, padding: 0 }} width={2}>
              {firstIncomplete && sectionCode === firstIncomplete.sectionCode && (
                <Button color="blue" onClick={() => resumeApplication(firstIncomplete)}>
                  {strings.BUTTON_APPLICATION_RESUME}
                </Button>
              )}
            </Grid.Column>
          </Grid>
        ),
      }))}
    />
  )
}

export default SectionsProgress
