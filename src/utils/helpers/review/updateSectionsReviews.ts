import { ReviewResponse, User } from '../../generated/graphql'
import { PageElements, ResponseFull, SectionsStructure } from '../../types'

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
  Object.entries(sectionsStructure).forEach(([code, section]) => {
    let reviewInSection = false
    Object.entries(section.pages).forEach(([number, page]) => {
      const pageWithReviews: PageElements = []
      page.forEach((elementsState) => {
        const { response } = elementsState
        const reviewResponse = response ? getReviewResponse(response, reviewResponses) : undefined
        pageWithReviews.push({ ...elementsState, review: reviewResponse })
        if (reviewResponse) reviewInSection = true
      })
      sectionsStructure[code].pages[number] = pageWithReviews
    })
    if (reviewInSection) {
      const { id, firstName, lastName } = reviewer
      sectionsStructure[code].assigned = {
        id,
        firstName: firstName as string,
        lastName: lastName as string,
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
