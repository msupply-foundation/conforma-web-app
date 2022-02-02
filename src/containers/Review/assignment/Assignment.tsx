import React, { useState } from 'react'
import { Button, Segment, Header } from 'semantic-ui-react'
import { AssignmentDetails, FullStructure } from '../../../utils/types'
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
  const [shouldAssign, setShouldAssign] = useState<number>(0)
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
              shouldAssignState: [shouldAssign, setShouldAssign],
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
      <Button />
    </>
  )
}

export default Assignment
