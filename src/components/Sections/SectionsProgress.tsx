import React from 'react'
import { Button, Grid, Icon, List, Progress } from 'semantic-ui-react'
import { Progress as ProgressType, SectionsStructureNEW } from '../../utils/types'

interface SectionsProgressProps {
  sections: SectionsStructureNEW
}

const SectionsProgress: React.FC<SectionsProgressProps> = ({ sections }) => {
  const getIndicator = ({ completed, valid }: ProgressType) => {
    return completed ? (
      <Icon name={valid ? 'check circle' : 'exclamation circle'} color={valid ? 'green' : 'red'} />
    ) : (
      <Icon name="circle outline" />
    )
  }

  const getProgress = ({ doneRequired, doneNonRequired, totalSum, valid }: ProgressType) => {
    const totalDone = doneRequired + doneNonRequired
    return (
      <Progress
        style={{ width: 200 }}
        percent={(100 * totalDone) / totalSum}
        size="tiny"
        success={valid}
        error={!valid}
      />
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
          <Grid stackable>
            <Grid.Column style={{ minWidth: 100 }} floated="left" width={4}>
              <p>{details.title}</p>
            </Grid.Column>
            <Grid.Column style={{ minWidth: 200 }} floated="right" width={4}>
              {progress && progress.totalSum > 0 && getProgress(progress)}
            </Grid.Column>
            <Grid.Column style={{ minWidth: 100 }} width={2}>
              TODO: RESUME BUTTON
            </Grid.Column>
          </Grid>
        ),
      }))}
    />
  )
}

export default SectionsProgress

// Object.entries(sections).map(([sectionCode, { details, progress }]) => (
{
  /* <Grid.Column width={2}>
        TODO: RESUME BUTTON
        { {resumeApplication && progress && sectionCode === firstIncomplete && (
            <Button
            color="blue"
            onClick={() =>
                resumeApplication({ sectionCode, page: progress.linkedPage })
            }
            >
            {strings.BUTTON_APPLICATION_RESUME}
            </Button>
        )} }
        </Grid.Column>
)*/
}
