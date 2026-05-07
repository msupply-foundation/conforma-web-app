import { PageElements } from '../../components'
import { ReviewStatus } from '../../utils/generated/graphql'
import { AssignmentDetails, FullStructure } from '../../utils/types'

interface ReviewApplicationFormProps {
  structure: FullStructure
  reviewAssignment: AssignmentDetails
}

export const ReviewApplicationForm = ({
  structure,
  reviewAssignment,
}: ReviewApplicationFormProps) => {
  // For now we will only handle one section and one page in that section,
  // since it's all got to be displayed in the same area of the UI
  const sectionName = Object.keys(structure.reviewSections)?.[0]
  if (!sectionName) return null

  const isActiveReview =
    reviewAssignment?.review?.current.reviewStatus === ReviewStatus.Draft
  const elements = structure.reviewSections[sectionName].pages['1'].state

  // When not in an active review, mark all elements as non-editable
  const displayElements = isActiveReview
    ? elements
    : elements.map((el) => ({
        ...el,
        element: { ...el.element, isEditable: false },
      }))

  return (
    <PageElements
      canEdit={true}
      elements={displayElements}
      responsesByCode={structure.responsesByCode ?? {}}
      stages={structure.stages.map(({ stage }) => stage)}
      applicationData={structure.info}
    />
  )
}
