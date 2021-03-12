import React from 'react'
import { Message, Segment } from 'semantic-ui-react'
import { NoMatch, Loading } from '../../components'
import strings from '../../utils/constants'
import useGetFullReviewStructure from '../../utils/hooks/useGetFullReviewStructure'
import { AssignmentDetailsNEW, FullStructure } from '../../utils/types'

// Component renders a line for review assignment within a section
// to be used in ReviewHome and Expansions
const ReviewSectionAssignment: React.FC<{
  sectionId: number
  assignment: AssignmentDetailsNEW
  fullApplicationStructure: FullStructure
}> = ({ sectionId, assignment, fullApplicationStructure }) => {
  const { fullReviewStructure, error } = useGetFullReviewStructure({
    reviewAssignmentId: assignment.id,
    fullApplicationStructure,
    filteredSectionIds: [sectionId],
  })

  if (error) return <Message error title={strings.ERROR_APPLICATION_OVERVIEW} list={[error]} />
  if (!fullReviewStructure) return <Loading />

  const info = {
    level: assignment.level,
    // action: 'to be implemented',
    // progress is just an example (would depend)
    progress: fullReviewStructure.sortedSections?.find(
      (section) => section.details.id === sectionId
    )?.reviewProgress,
    // reviewer: 'to be implemented'
  }

  return (
    <Segment>
      <pre>{JSON.stringify(info, null, '  ')}</pre>
    </Segment>
  )
}

export default ReviewSectionAssignment
