import { gql } from '@apollo/client'

export default gql`
  query getApplication($serial: String!) {
    applicationBySerial(serial: $serial) {
      ...Application
      template {
        ...templateFragment
        templateSections(orderBy: INDEX_ASC) {
          nodes {
            ...Section
            templateElementsBySectionId(orderBy: INDEX_ASC) {
              nodes {
                ...elementFragment
              }
            }
          }
        }
        templateStages {
          nodes {
            ...TemplateStage
          }
        }
        # Count PREVIEW actions so we know whether to show the option to Preview
        templateActions(condition: { trigger: ON_PREVIEW }) {
          totalCount
        }
      }
      user {
        ...User
      }
      org {
        ...Organisation
      }
      # Get scheduled events so we can extend deadlines
      triggerSchedules {
        nodes {
          id
          timeScheduled
          eventCode
          isActive
        }
      }
    }
    applicationStageStatusLatests(condition: { serial: $serial }) {
      nodes {
        ...Stage
      }
    }
  }
`
