import { gql } from '@apollo/client'

export default gql`
  query getReview($reviewerId: ID!, $applicationId: ID!) {
    reviews(condition: {reviewerId: $reviewerId, applicationId: $applicationId}) {
        nodes {
            id
        }
    }
  }
#     reviewAssignment(id: $reviewAssignmentId) {
#         id
#         reviewer {
#             id
#             firstName
#             lastName
#         }
#         reviews {
#             nodes {
#                 id
#                 reviewResponses {
#                     nodes {
#                         id
#                         decision
#                         comment
#                         applicationResponseId
#                     }
#                 }
#             }
#         }
#     }
# }
`