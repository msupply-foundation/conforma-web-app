import { ReviewResponse, ReviewResponseDecision, User } from '../../generated/graphql'
import { PageElements, ResponseFull, ReviewQuestionDecision, SectionsStructure } from '../../types'

interface UpdateSectionsReviewsProps {
  sectionsStructure: SectionsStructure
  reviewResponses: ReviewResponse[]
  reviewer: User
}
const updateSectionsReviews = ({
  sectionsStructure,
  reviewResponses,
  reviewer,
}: UpdateSectionsReviewsProps): SectionsStructure => {
  Object.entries(sectionsStructure).forEach(([code, { pages }]) => {
    let reviewInSection = false
    const reviewsByCode: { [code: string]: ReviewQuestionDecision | undefined } = {}
    Object.entries(pages).forEach(([name, { number, state }]) => {
      const pageWithReviews: PageElements = []
      state.forEach((elementsState) => {
        const { element, response } = elementsState
        if (response) {
          const reviewResponse = getReviewResponse(response, reviewResponses)
          reviewsByCode[element.code] = reviewResponse
          pageWithReviews.push({ ...elementsState, review: reviewResponse })
          if (reviewResponse) reviewInSection = true
        }
      })
      sectionsStructure[code].pages[name] = { number, state: pageWithReviews }
    })
    if (reviewInSection) {
      const { id, firstName, lastName } = reviewer

      const assigned = {
        id,
        firstName: firstName as string,
        lastName: lastName as string,
      }

      const questions = Object.keys(reviewsByCode)
      const reviews = Object.values(reviewsByCode).filter(
        (review) => review?.decision
      ) as ReviewQuestionDecision[]

      const progress = {
        total: questions.length,
        done: reviews.length,
        completed: questions.length === reviews.length,
        valid: !reviews.some(({ decision }) => decision === ReviewResponseDecision.Decline),
      }

      sectionsStructure[code] = {
        ...sectionsStructure[code],
        assigned,
        progress,
      }
    }
  })
  return sectionsStructure
}

const getReviewResponse = (response: ResponseFull | null, reviewResponses: ReviewResponse[]) => {
  const reviewResponse = response
    ? reviewResponses.find(({ applicationResponse }) => {
        return response.id === applicationResponse?.id
      })
    : undefined

  if (reviewResponse) {
    const { id, decision, comment } = reviewResponse
    return {
      id,
      decision: decision ? decision : undefined,
      comment: comment ? comment : '',
    }
  } else return undefined
}

export default updateSectionsReviews
