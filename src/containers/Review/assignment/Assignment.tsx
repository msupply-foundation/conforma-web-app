import React, { useState } from 'react'
import { Button, Segment, Header } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import useUpdateReviewAssignment from '../../../utils/hooks/useUpdateReviewAssignment'
import { AssignmentDetails, FullStructure, SectionAssignee } from '../../../utils/types'
import AssignmentSectionRow from './AssignmentSectionRow'
import ReviewSectionRow from './ReviewSectionRow'

interface ReviewHomeProps {
  assignmentsByStage: AssignmentDetails[]
  assignmentsByUserAndStage: AssignmentDetails[]
  assignmentInPreviousStage: AssignmentDetails
  fullApplicationStructure: FullStructure
}

const Assignment: React.FC<ReviewHomeProps> = ({
  assignmentsByStage,
  assignmentsByUserAndStage,
  assignmentInPreviousStage,
  fullApplicationStructure,
}) => {
  const { strings } = useLanguageProvider()
  const { assignSectionsToUser } = useUpdateReviewAssignment(fullApplicationStructure)
  const [assignedSections, setAssignedSections] = useState<SectionAssignee>(
    Object.values(fullApplicationStructure.sections).reduce(
      (assignedSections, { details: { code } }) => ({ ...assignedSections, [code]: undefined }),
      {}
    )
  )

  const submitAssignments = () => {
    let groupedSectionsPerAssignment: {
      sectionCodes: string[]
      assignment: AssignmentDetails
    }[] = []

    Object.entries(assignedSections).forEach(([sectionCode, userId]) => {
      const found = groupedSectionsPerAssignment.find(
        ({ assignment: { reviewerId } }) => reviewerId === userId
      )
      if (found) found.sectionCodes.push(sectionCode)
      else {
        const assignment = assignmentsByStage.find(({ reviewer: { id } }) => id === userId)
        if (assignment)
          groupedSectionsPerAssignment.push({ sectionCodes: [sectionCode], assignment })
      }
    })
    groupedSectionsPerAssignment.forEach(({ sectionCodes, assignment }) =>
      assignSectionsToUser({ sectionCodes, assignment })
    )
  }

  return (
    <>
      {Object.values(fullApplicationStructure.sections).map(({ details: { id, title, code } }) => (
        <Segment className="stripes" key={id}>
          <Header className="section-title" as="h5" content={title} />
          <AssignmentSectionRow
            {...{
              assignments: assignmentsByStage,
              structure: fullApplicationStructure,
              sectionCode: code,
              assignedSectionsState: [assignedSections, setAssignedSections],
            }}
          />
          {assignmentsByUserAndStage.map((assignment) => (
            <ReviewSectionRow
              {...{
                key: assignment.id,
                sectionId: id,
                assignment,
                fullApplicationStructure,
                previousAssignment: assignmentInPreviousStage,
              }}
            />
          ))}
        </Segment>
      ))}
      <div style={{ marginTop: 10 }}>
        <Button primary content={strings.BUTTON_SUBMIT} compact onClick={submitAssignments} />
      </div>
    </>
  )
}

export default Assignment
