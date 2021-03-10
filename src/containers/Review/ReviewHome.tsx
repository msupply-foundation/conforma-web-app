import React from 'react'
import { Message, Segment, Header } from 'semantic-ui-react'
import { Loading } from '../../components'
import strings from '../../utils/constants'
import useGetFullApplicationStructure from '../../utils/hooks/useGetFullApplicationStructure'
import { AssignmentDetailsNEW, FullStructure } from '../../utils/types'
import ReviewSectionAssignment from './ReviewSectionAssignment'

interface ReviewHomeProps {
  assignments: AssignmentDetailsNEW[]
  structure: FullStructure
}

const ReviewHome: React.FC<ReviewHomeProps> = ({ assignments, structure }) => {
  const { error, fullStructure: fullApplicationStructure } = useGetFullApplicationStructure({
    structure,
    firstRunValidation: false,
    shouldCalculateProgress: false,
  })

  if (error) return <Message error title={strings.ERROR_APPLICATION_OVERVIEW} list={[error]} />

  if (!fullApplicationStructure) return <Loading />

  return (
    <>
      {fullApplicationStructure.sortedSections?.map((section) => (
        <Segment key={section.details.id}>
          <Header>{section.details.title}</Header>
          {assignments.map((assignment) => (
            <ReviewSectionAssignment
              {...{
                key: assignment.id,
                sectionId: section.details.id,
                assignment,
                fullApplicationStructure,
              }}
            />
          ))}
        </Segment>
      ))}
    </>
  )
}

export default ReviewHome
