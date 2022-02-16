import React from 'react'
import { Message } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useReviewStructureState } from '../../../contexts/ReviewStructuresState'
import useGetReviewStructureForSections from '../../../utils/hooks/useGetReviewStructureForSection'
import { AssignmentDetails, FullStructure } from '../../../utils/types'
interface ReviewHomeProps {
  assignment: AssignmentDetails
  structure: FullStructure
}

// Component only used to update the contxt with reviewStructuresState (run one instance of hook)
const Assignment: React.FC<ReviewHomeProps> = ({ assignment, structure }) => {
  const {
    reviewStructuresState: { syncToken, structures },
    setReviewStructures,
  } = useReviewStructureState()
  const { strings } = useLanguageProvider()

  const shouldUpdate = !Object.keys(structures).some((key) => Number(key) === assignment.id)

  const { fullReviewStructure, error } = useGetReviewStructureForSections({
    reviewAssignment: assignment,
    fullReviewStructure: structure,
    awaitMode: !shouldUpdate,
  })

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />

  if (fullReviewStructure && shouldUpdate) {
    // Token required because this was running on loop trying to set the Assignments many times
    if (shouldUpdate && !syncToken) {
      setReviewStructures({ type: 'getSyncToken' })

      setReviewStructures({
        type: 'addReviewStructure',
        reviewStructure: fullReviewStructure,
        assignment,
      })

      setReviewStructures({ type: 'releaseSyncToken' })
    }
  }

  return null
}

export default Assignment
