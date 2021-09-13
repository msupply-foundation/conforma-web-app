import React, { useState } from 'react'
import { Segment, Header } from 'semantic-ui-react'
import { AssignmentDetails, FullStructure } from '../../utils/types'
import AssignmentSectionRow from '../Assign/AssignmentSectionRow'
import ReviewSectionRow from './ReviewSectionRow'

interface ReviewHomeProps {
  assignmentsByStage: AssignmentDetails[]
  assignmentsByUserAndStage: AssignmentDetails[]
  assignmentInPreviousStage: AssignmentDetails
  fullApplicationStructure: FullStructure
}

const ReviewHome: React.FC<ReviewHomeProps> = ({
  assignmentsByStage,
  assignmentsByUserAndStage,
  assignmentInPreviousStage,
  fullApplicationStructure,
}) => {
  const [shouldAssign, setShouldAssign] = useState<number | boolean>(false)
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
                shouldAssignState: [shouldAssign, setShouldAssign],
              }}
            />
          ))}
        </Segment>
      ))}
    </>
  )
}

export default ReviewHome
