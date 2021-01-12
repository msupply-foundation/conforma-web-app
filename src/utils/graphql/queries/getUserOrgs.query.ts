import { gql } from '@apollo/client'

export default gql`
  query getUserOrgs($id: Int!) {
    user(id: $id) {
      userOrganisations {
        nodes {
          organistion {
            address
            id
            licenceNumber
            name
          }
        }
      }
    }
  }
`
