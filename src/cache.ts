import { InMemoryCache } from '@apollo/client'
import { TemplateElementsConnection } from './utils/generated/graphql'

const cache = new InMemoryCache({
  typePolicies: {
    Application: {
      keyFields: ['serial'],
    },
    TemplateSection: {
      fields: {
        totalPages: {
          read(_, { readField }) {
            // TODO: Move code to find number of pages per section (in useLoadTemplate) to here
            readField('templateElementsBySectionId') as TemplateElementsConnection
            return 0
          },
        },
      },
    },
  },
})

export default cache
