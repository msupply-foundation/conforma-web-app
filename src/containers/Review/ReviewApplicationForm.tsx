import { PageElements } from '../../components'
import { FullStructure } from '../../utils/types'

interface ReviewApplicationFormProps {
  structure: FullStructure
}

export const ReviewApplicationForm = ({ structure }: ReviewApplicationFormProps) => {
  // For now we will only handle one section and one page in that section,
  // since it's all got to be displayed in the same area of the UI
  const sectionName = Object.keys(structure.reviewSections)[0]
  console.log('structure', structure.reviewSections[sectionName].pages['1'].state)
  return (
    <PageElements
      canEdit={true}
      elements={structure.reviewSections[sectionName].pages['1'].state}
      responsesByCode={structure.responsesByCode ?? {}}
      stages={structure.stages.map(({ stage }) => stage)}
      applicationData={structure.info}
    />
  )
}
