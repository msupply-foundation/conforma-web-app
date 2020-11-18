import { InMemoryCache } from '@apollo/client'
import { TemplateElementsConnection } from './utils/generated/graphql'

const cache = new InMemoryCache({
    typePolicies: {
      Application: {
        keyFields: ['serial']
      },
      TemplateSection: {
        fields: {
          totalPages: {
              read(_, { readField }) {
                // TODO: Move code to find number of pages per section (in useLoadTemplete) to here
                  const elementsConnection = readField('templateElementsBySectionId') as TemplateElementsConnection
                  return 0
              }
          }
        }
      }
    }
})

export default cache