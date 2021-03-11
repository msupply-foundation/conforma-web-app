import React from 'react'
import { Message, Segment, Header } from 'semantic-ui-react'
import { Loading } from '../../components'
import strings from '../../utils/constants'
import useGetFullApplicationStructure from '../../utils/hooks/useGetFullApplicationStructure'
import { AssignmentDetailsNEW, FullStructure } from '../../utils/types'
import ReviewSectionAssignment from './ReviewSectionAssignment'

interface ReviewHomeProps {
  assignments: AssignmentDetailsNEW[]
  structure: FullStructure
}

const ReviewHome: React.FC<ReviewHomeProps> = ({ assignments, structure }) => {
  const { error, fullStructure: fullApplicationStructure } = useGetFullApplicationStructure({
    structure,
    firstRunValidation: false,
    shouldCalculateProgress: false,
  })

  if (error) return <Message error title={strings.ERROR_APPLICATION_OVERVIEW} list={[error]} />

  if (!fullApplicationStructure) return <Loading />

  // i think we would group by stage, and current stage would be the expanded one, for now using latest stage
  const currentStageAssignments = assignments.filter(
    (assignment) => assignment.stage.id === fullApplicationStructure.info.current?.stage.id
  )

  return (
    <>
      {fullApplicationStructure.sortedSections?.map(({ details: { id, title } }) => (
        <Segment key={id}>
          <Header>{title}</Header>
          {currentStageAssignments.map((assignment) => (
            <ReviewSectionAssignment
              {...{
                key: assignment.id,
                sectionId: id,
                assignment,
                fullApplicationStructure,
              }}
            />
          ))}
        </Segment>
      ))}
    </>
  )
}

export default ReviewHome
