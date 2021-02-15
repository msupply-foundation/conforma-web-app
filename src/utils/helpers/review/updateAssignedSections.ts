import { User } from '../../generated/graphql'
import { ReviewQuestion, SectionsStructure } from '../../types'

interface UpdateAssignedSections {
  sectionsStructure: SectionsStructure
  assignedQuestions: ReviewQuestion[]
  reviewer: User
}

const updateAssignedSections = ({
  sectionsStructure,
  assignedQuestions,
  reviewer,
}: UpdateAssignedSections) => {
  Object.entries(sectionsStructure).forEach(([code, { details }]) => {
    const assignmentsInSection = assignedQuestions.filter(
      ({ sectionIndex }) => sectionIndex === details.index
    )
    if (assignmentsInSection.length > 0) {
      const { id, firstName, lastName } = reviewer
      sectionsStructure[code].assigned = {
        id,
        firstName: firstName as string,
        lastName: lastName as string,
      }
    }
  })
  return sectionsStructure
}

export default updateAssignedSections
