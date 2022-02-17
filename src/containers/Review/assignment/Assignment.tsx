import React, { useEffect } from 'react'
import { Message } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useReviewStructureState } from '../../../contexts/ReviewStructuresState'
import useGetReviewStructureForSections from '../../../utils/hooks/useGetReviewStructureForSection'
import { AssignmentDetails, FullStructure } from '../../../utils/types'
interface ReviewHomeProps {
  assignment: AssignmentDetails
  structure: FullStructure
}

// Component only used to update the context with reviewStructuresState (run one instance of hook)
const Assignment: React.FC<ReviewHomeProps> = ({ assignment, structure }) => {
  const { reviewStructuresState, setReviewStructures } = useReviewStructureState()
  const { strings } = useLanguageProvider()

  const shouldUpdate = !Object.keys(reviewStructuresState).some(
    (key) => Number(key) === assignment.id
  )

  const { reviewStructure, error } = useGetReviewStructureForSections({
    reviewAssignment: assignment,
    reviewStructure: structure,
    awaitMode: !shouldUpdate,
  })

  useEffect(() => {
    if (reviewStructure && shouldUpdate) {
      setReviewStructures({
        type: 'addReviewStructure',
        reviewStructure,
        assignment,
      })
    }
  }, [reviewStructure])

  if (error) return <Message error title={strings.ERROR_GENERIC} list={[error]} />

  return null
}

export default Assignment
