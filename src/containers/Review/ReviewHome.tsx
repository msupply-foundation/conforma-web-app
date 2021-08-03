import React from 'react'
import { Segment, Header } from 'semantic-ui-react'
import { AssignmentDetails, FullStructure } from '../../utils/types'
import AssignmentSectionRow from './AssignmentSectionRow'
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
}) => (
  <>
    {Object.values(fullApplicationStructure.sections).map(({ details: { id, title, code } }) => (
      <Segment className="stripes" key={id}>
        <Header className="section-title" as="h5" content={title} />
        <AssignmentSectionRow
          {...{
            assignments: assignmentsByStage,
            structure: fullApplicationStructure,
            sectionCode: code,
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
  </>
)

export default ReviewHome
