import { PageElements } from '../../components'
import { FullStructure } from '../../utils/types'

interface ReviewApplicationFormProps {
  structure: FullStructure
}

export const ReviewApplicationForm = ({ structure }: ReviewApplicationFormProps) => {
  console.log('structure', structure.reviewSections.Review.pages['1'].state)
  return (
    <PageElements
      canEdit={true}
      elements={structure.reviewSections.Review.pages['1'].state}
      responsesByCode={structure.responsesByCode}
      stages={structure.stages.map(({ stage }) => stage)}
      applicationData={structure.info}
    />
  )
}
