import React from 'react'
import { Form, Icon, Segment } from 'semantic-ui-react'
import {
  ApplicationDetails,
  ConsolidationElementProps,
  ElementState,
  PageElement,
  ResponseElementProps,
  ResponsesByCode,
  ReviewElementProps,
  SectionAndPage,
} from '../../utils/types'
import { ApplicationViewWrapper } from '../../formElementPlugins'
import {
  ApplicationViewWrapperProps,
  SummaryViewWrapperProps,
} from '../../formElementPlugins/types'
import {
  ReviewResponse,
  ReviewResponseStatus,
  TemplateElementCategory,
} from '../../utils/generated/graphql'
import DecisionArea from '../Review/DecisionArea'
import SummaryInformationElement from './Elements/SummaryInformationElement'
import ApplicantResponseElement from './Elements/ApplicantResponseElement'
import ReviewDecisionElement from './Elements/ReviewDecisionElement'
import ConsolidationDecisionElement from './Elements/ConsolidationDecisionElement'
import { useRouter } from '../../utils/hooks/useRouter'
import strings from '../../utils/constants'

interface PageElementProps {
  elements: PageElement[]
  responsesByCode: ResponsesByCode
  applicationData: ApplicationDetails
  canEdit: boolean
  isConsolidation?: boolean
  isReview?: boolean
  isStrictPage?: boolean
  isSummary?: boolean
  isUpdating?: boolean
  serial?: string
  sectionAndPage?: SectionAndPage
}

const PageElements: React.FC<PageElementProps> = ({
  elements,
  responsesByCode,
  applicationData,
  canEdit = false,
  isConsolidation = false,
  isReview = false,
  isStrictPage = false,
  isSummary = false,
  isUpdating = false,
  serial,
  sectionAndPage,
}) => {
  const {
    push,
    query: { openResponse },
    updateQuery,
  } = useRouter()
  const visibleElements = elements.filter(({ element }) => element.isVisible)

  // Editable Application page
  if (canEdit && !isReview && !isSummary)
    return (
      <Form className="form-area">
        {visibleElements.map(
          ({ element, isChangeRequest, isChanged, previousApplicationResponse }) => {
            const currentReview = previousApplicationResponse?.reviewResponses.nodes[0]
            const changesRequired =
              isChangeRequest || isChanged
                ? {
                    isChangeRequest: isChangeRequest as boolean,
                    isChanged: isChanged as boolean,
                    reviewerComment: currentReview?.comment || '',
                  }
                : undefined

            const props: ApplicationViewWrapperProps = {
              element,
              isStrictPage,
              changesRequired,
              allResponses: responsesByCode,
              applicationData,
              currentResponse: responsesByCode?.[element.code],
            }
            // Wrapper displays response & changes requested warning for LOQ re-submission
            return <ApplicationViewWrapper key={`question_${element.code}`} {...props} />
          }
        )}
      </Form>
    )

  const getSummaryViewProps = (element: ElementState) => ({
    element,
    response: responsesByCode?.[element.code],
    allResponses: responsesByCode,
    applicationData,
  })

  // Summary Page
  if (isSummary) {
    const { sectionCode, pageNumber } = sectionAndPage as SectionAndPage
    return (
      <Form>
        {visibleElements.map((state) => {
          const { element, isChanged, isChangeRequest, latestApplicationResponse } = state

          const isResponseUpdated = !!isChangeRequest || !!isChanged
          const canApplicantEdit = canEdit && isUpdating ? isResponseUpdated : true
          const summaryViewProps = getSummaryViewProps(element)
          const props: ResponseElementProps = {
            applicationResponse: latestApplicationResponse,
            isResponseUpdated,
          }

          return (
            <div key={`question_${element.id}`}>
              <Segment basic className="summary-page-element">
                {element.category !== TemplateElementCategory.Question ? (
                  <SummaryInformationElement {...summaryViewProps} />
                ) : (
                  <ApplicantResponseElement {...props} {...summaryViewProps}>
                    {canApplicantEdit && (
                      <UpdateIcon
                        onClick={() =>
                          push(`/application/${serial}/${sectionCode}/Page${pageNumber}`)
                        }
                      />
                    )}
                  </ApplicantResponseElement>
                )}
              </Segment>
            </div>
          )
        })}
      </Form>
    )
  }
  // Consolidation
  if (isConsolidation) {
    return (
      <div>
        <Form>
          {visibleElements.map(
            ({
              element,
              thisReviewLatestResponse,
              latestOriginalReviewResponse,
              isNewApplicationResponse,
              isPendingReview,
              latestApplicationResponse,
            }) => {
              // TODO: Replace with isPendingReview
              const canConsolidate = canEdit && !thisReviewLatestResponse?.decision
              const reviewButtonProps = {
                canEdit: canConsolidate,
                isPendingReview,
                isNewReview: !!isNewApplicationResponse,
                elementCode: element.code,
                updateQuery,
              }

              const summaryViewProps = getSummaryViewProps(element)

              const consolidationProps: ConsolidationElementProps = {
                applicationResponse: latestApplicationResponse,
                reviewResponse: thisReviewLatestResponse as ReviewResponse,
                originalReviewResponse: latestOriginalReviewResponse as ReviewResponse,
                ExtraConsolidateAction: () =>
                  canConsolidate ? <ReviewButton {...reviewButtonProps} /> : null,
                ExtraEditConsolidationAction: () =>
                  thisReviewLatestResponse?.status === ReviewResponseStatus.Draft ? (
                    <UpdateIcon
                      onClick={() =>
                        updateQuery({
                          openResponse: element.code,
                        })
                      }
                    />
                  ) : null,
              }

              const toggleDecision = openResponse === element.code

              return (
                <div key={`${element.code}ReviewContainer`}>
                  <Segment basic key={`question_${element.id}`} className="summary-page-element">
                    {element.category === TemplateElementCategory.Information ? (
                      <SummaryInformationElement {...summaryViewProps} />
                    ) : (
                      <ConsolidateReviewDecision {...consolidationProps} {...summaryViewProps} />
                    )}
                  </Segment>
                  {toggleDecision && <DecisionArea {...consolidationProps} {...summaryViewProps} />}
                </div>
              )
            }
          )}
        </Form>
      </div>
    )
  }

  // Review
  if (isReview) {
    return (
      <div>
        <Form>
          {visibleElements.map(
            ({
              element,
              thisReviewLatestResponse,
              latestOriginalReviewResponse,
              isNewApplicationResponse,
              isPendingReview,
              latestApplicationResponse,
            }) => {
              // TODO: Replace with isPendingReview
              const canReview = canEdit && !thisReviewLatestResponse?.decision
              const reviewButtonProps = {
                canEdit: canReview,
                isPendingReview,
                isNewReview: !!isNewApplicationResponse,
                elementCode: element.code,
                updateQuery,
              }

              const summaryViewProps = getSummaryViewProps(element)

              const reviewProps: ReviewElementProps = {
                applicationResponse: latestApplicationResponse,
                reviewResponse: thisReviewLatestResponse as ReviewResponse,
                ExtraReviewAction: () =>
                  canReview ? <ReviewButton {...reviewButtonProps} /> : null,
                ExtraEditReviewAction: () =>
                  thisReviewLatestResponse?.status === ReviewResponseStatus.Draft ? (
                    <UpdateIcon
                      onClick={() =>
                        updateQuery({
                          openResponse: element.code,
                        })
                      }
                    />
                  ) : null,
              }

              const toggleDecision = openResponse === element.code

              return (
                <div key={`${element.code}ReviewContainer`}>
                  <Segment basic key={`question_${element.id}`} className="summary-page-element">
                    {element.category === TemplateElementCategory.Information ? (
                      <SummaryInformationElement {...summaryViewProps} />
                    ) : (
                      <ReviewApplicantResponse {...reviewProps} {...summaryViewProps} />
                    )}
                    {/* {thisReviewLatestResponse && isConsolidation && (
                      <ConsolidationDecisionElement {...props} />
                    )} */}
                  </Segment>
                  {toggleDecision && <DecisionArea {...reviewProps} {...summaryViewProps} />}
                </div>
              )
            }
          )}
        </Form>
      </div>
    )
  }

  return null
}

// TODO: For now just use isConsolitadion = true to test this...
type ConsolidateReviewDecisionProps = ConsolidationElementProps & SummaryViewWrapperProps
const ConsolidateReviewDecision: React.FC<ConsolidateReviewDecisionProps> = ({
  reviewResponse,
  originalReviewResponse,
  ExtraConsolidateAction,
  ExtraEditConsolidationAction,
  ...otherProps
}) => (
  <div>
    <ApplicantResponseElement {...otherProps} />
    <ReviewDecisionElement reviewResponse={originalReviewResponse} {...otherProps}>
      {ExtraConsolidateAction && <ExtraConsolidateAction />}
    </ReviewDecisionElement>
    <ConsolidationDecisionElement
      reviewResponse={reviewResponse}
      originalReviewResponse={originalReviewResponse}
    >
      {ExtraEditConsolidationAction && <ExtraEditConsolidationAction />}
    </ConsolidationDecisionElement>
  </div>
)

type ReviewApplicantResponseProps = ReviewElementProps & SummaryViewWrapperProps

const ReviewApplicantResponse: React.FC<ReviewApplicantResponseProps> = ({
  reviewResponse,
  ExtraReviewAction,
  ExtraEditReviewAction,
  ...otherProps
}) => (
  <div>
    <ApplicantResponseElement {...otherProps}>
      {ExtraReviewAction && <ExtraReviewAction />}
    </ApplicantResponseElement>
    <ReviewDecisionElement reviewResponse={reviewResponse} {...otherProps}>
      {ExtraEditReviewAction && <ExtraEditReviewAction />}
    </ReviewDecisionElement>
  </div>
)

const UpdateIcon: React.FC<{ onClick: Function }> = ({ onClick }) => (
  <Icon className="clickable" name="pencil" size="large" color="blue" onClick={onClick} />
)

interface ReviewButtonProps {
  canEdit: boolean
  isPendingReview?: boolean // Fix: isPendingReview not set when review doesn't have a decision
  isNewReview: boolean
  elementCode: string
  updateQuery: Function
}

const ReviewButton: React.FC<ReviewButtonProps> = ({
  isPendingReview = false,
  canEdit,
  isNewReview,
  elementCode,
  updateQuery,
}) =>
  // TODO: Replace check for isPendingReview when that is fixed to return only for reviable responses...
  canEdit ? (
    <p className="link-style clickable" onClick={() => updateQuery({ openResponse: elementCode })}>
      <strong>
        {isNewReview ? strings.BUTTON_RE_REVIEW_RESPONSE : strings.BUTTON_REVIEW_RESPONSE}
      </strong>
    </p>
  ) : null

export default PageElements
