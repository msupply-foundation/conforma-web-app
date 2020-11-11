import { gql } from '@apollo/client'

export default gql`
  mutation createSection($applicationId: Int!, $templateSectionId: Int!) {
    createApplicationSection(
      input: {
        applicationSection: { applicationId: $applicationId, templateSectionId: $templateSectionId }
      }
    ) {
      applicationSection {
        id
        applicationId
        templateSection {
          ...Section
          templateElementsBySectionId {
            nodes {
              ...Element
            }
          }
        }
      }
    }
  }
`
