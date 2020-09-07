import { gql } from '@apollo/client'

export default gql`
    mutation updateApplicationById($id: Int!, $applicationPatch: ApplicationPatch!) {
        updateApplicationById(input: {id: $id, applicationPatch: $applicationPatch}) {
            application {
                id
                name
            }
        }
    }
`