import React from 'react'
import { Form, Icon, Segment } from 'semantic-ui-react'
import {
  ApplicationDetails,
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
import Markdown from '../../utils/helpers/semanticReactMarkdown'
import DecisionArea from '../Review/DecisionArea'
import SummaryInformationElement from './Elements/SummaryInformationElement'
import ApplicantResponseElement from './Elements/ApplicantResponseElement'
import ReviewDecisionElement from './Elements/ReviewDecisionElement'
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
            return (
              <div className="form-element-wrapper" key={`question_${element.code}`}>
                <div className="form-element">
                  <ApplicationViewWrapper {...props} />
                </div>
                {element.helpText && (
                  <div className="help-tips hide-on-mobile">
                    <div className="help-tips-content">
                      <Markdown text={element.helpText} />
                    </div>
                  </div>
                )}
              </div>
            )
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
              latestApplicationResponse,
              isNewApplicationResponse,
              isActiveReviewResponse,
            }) => {
              const canConsolidate =
                (isActiveReviewResponse as boolean) && !thisReviewLatestResponse?.decision
              const reviewButtonProps = {
                isActive: canConsolidate,
                isNewReview: !!isNewApplicationResponse,
                elementCode: element.code,
                updateQuery,
              }

              const summaryViewProps = getSummaryViewProps(element)

              const consolidationProps: ReviewElementProps = {
                applicationResponse: latestApplicationResponse,
                reviewResponse: thisReviewLatestResponse as ReviewResponse,
                originalReviewResponse: latestOriginalReviewResponse as ReviewResponse,
                isConsolidation,
                ExtraReviewAction: () =>
                  canConsolidate ? <ReviewButton {...reviewButtonProps} /> : null,
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
              latestApplicationResponse,
              isNewApplicationResponse,
              isActiveReviewResponse,
            }) => {
              const canReview =
                (isActiveReviewResponse as boolean) && !thisReviewLatestResponse?.decision
              const reviewButtonProps = {
                isActive: canReview,
                isNewReview: !!isNewApplicationResponse,
                elementCode: element.code,
                updateQuery,
              }

              const summaryViewProps = getSummaryViewProps(element)

              const reviewProps: ReviewElementProps = {
                applicationResponse: latestApplicationResponse,
                reviewResponse: thisReviewLatestResponse as ReviewResponse,
                isConsolidation,
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
                      // TODO: Show consolidator comment to Reviewer with button to Update
                      <ReviewApplicantResponse {...reviewProps} {...summaryViewProps} />
                    )}
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

type ConsolidateReviewDecisionProps = ReviewElementProps & SummaryViewWrapperProps
const ConsolidateReviewDecision: React.FC<ConsolidateReviewDecisionProps> = ({
  reviewResponse,
  isConsolidation,
  originalReviewResponse,
  ExtraReviewAction,
  ExtraEditReviewAction,
  ...otherProps
}) => (
  <div>
    <ApplicantResponseElement {...otherProps} />
    <ReviewDecisionElement
      isActiveReview={true}
      reviewResponse={reviewResponse}
      originalReviewResponse={originalReviewResponse}
      isConsolidation={isConsolidation}
      {...otherProps}
    >
      {ExtraEditReviewAction && <ExtraEditReviewAction />}
    </ReviewDecisionElement>
    <ReviewDecisionElement
      isActiveReview={false}
      reviewResponse={originalReviewResponse as ReviewResponse}
      isConsolidation={false}
      {...otherProps}
    >
      {ExtraReviewAction && <ExtraReviewAction />}
    </ReviewDecisionElement>
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
    <ReviewDecisionElement isActiveReview={true} reviewResponse={reviewResponse} {...otherProps}>
      {ExtraEditReviewAction && <ExtraEditReviewAction />}
    </ReviewDecisionElement>
  </div>
)

const UpdateIcon: React.FC<{ onClick: Function }> = ({ onClick }) => (
  <Icon className="clickable" name="pencil" size="large" color="blue" onClick={onClick} />
)

interface ReviewButtonProps {
  isActive: boolean
  isNewReview: boolean
  elementCode: string
  updateQuery: Function
}

const ReviewButton: React.FC<ReviewButtonProps> = ({
  isActive,
  isNewReview,
  elementCode,
  updateQuery,
}) =>
  isActive ? (
    <p className="link-style clickable" onClick={() => updateQuery({ openResponse: elementCode })}>
      <strong>
        {isNewReview ? strings.BUTTON_RE_REVIEW_RESPONSE : strings.BUTTON_REVIEW_RESPONSE}
      </strong>
    </p>
  ) : null

export default PageElements
