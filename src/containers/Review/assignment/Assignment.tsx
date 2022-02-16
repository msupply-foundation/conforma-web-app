import React from 'react'
import { Message } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useReviewStructureState } from '../../../contexts/ReviewStructuresState'
import useGetReviewStructureForSectionsAsync from '../../../utils/hooks/useGetReviewStructureForSection'
import { AssignmentDetails, FullStructure } from '../../../utils/types'
interface ReviewHomeProps {
  assignment: AssignmentDetails
  structure: FullStructure
}

// Component only used to update the contxt with reviewStructuresState (run one instance of hook)
const Assignment: React.FC<ReviewHomeProps> = ({ assignment, structure }) => {
  const { setReviewStructures } = useReviewStructureState()
  const { strings } = useLanguageProvider()

  console.log('Start ASSIGNMENT for', assignment.id)

  const { fullReviewStructure, error } = useGetReviewStructureForSectionsAsync({
    reviewAssignment: assignment,
    fullReviewStructure: structure,
  })

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />

  if (fullReviewStructure) {
    // console.log('Update reviewState with new reviewStructure', fullReviewStructure)

    setReviewStructures({
      type: 'addReviewStructure',
      reviewStructure: fullReviewStructure,
      assignment,
    })
  }

  return null
}

export default Assignment
