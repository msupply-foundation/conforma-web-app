type TriggerQueryVariables = (
  | { serial: string }
  | { reviewAssignmentId: number }
  | { reviewId: number }
) & {
  getApplicationTriggers: boolean
  getReviewAssignmentTriggers: boolean
  getReviewTriggers: boolean
}

const test: TriggerQueryVariables = {
  serial: '200',
  getApplicationTriggers: true,
  getReviewAssignmentTriggers: false,
  getReviewTriggers: false,
}
