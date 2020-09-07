import { gql } from '@apollo/client'

export default gql`
    query getApplications {
        allApplications {
            nodes {
                id
                userId
                serial
                name
                outcome
            }
    }
}
`