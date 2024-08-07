import { gql } from '@apollo/client'

export default gql`
  fragment TemplateStage on TemplateStage {
    number
    title
    id
    description
    colour
    templateStageReviewLevelsByStageId {
      nodes {
        name
        number
        description
        singleReviewerAllSections
      }
    }
  }
`
