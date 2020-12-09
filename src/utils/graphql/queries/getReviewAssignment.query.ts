import { gql } from '@apollo/client'

export default gql`
    query getReviewAssignment($reviewerId: Int!, $applicationId: Int!, $stageId: Int!) {
        reviewAssignments(
            condition: {
                reviewerId: $reviewerId, 
                applicationId: $applicationId
                stageId: $stageId
            }) {
            nodes {
                id
                reviews {
                    nodes {
                        status
                        trigger
                    }
                }
                reviewQuestionAssignments {
                    nodes {
                        templateElement {
                            code
                            section {
                                index
                                title
                            }
                        }
                    }
                }
            }
        }
    }
`