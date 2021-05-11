import React, { useState } from 'react'
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
import DecisionArea from '../Review/DecisionArea'
import SummaryInformationElement from './Elements/SummaryInformationElement'
import ApplicantResponseElement from './Elements/ApplicantResponseElement'
import ReviewDecisionElement from './Elements/ReviewDecisionElement'
// import ConsolidationDecisionElement from './Elements/ConsolidationDecisionElement'
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

  // Review & Consolidation
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
                ExtraUserAction: () => (canReview ? <ReviewButton {...reviewButtonProps} /> : null),
                ExtraEditAction: () =>
                  thisReviewLatestResponse?.status === ReviewResponseStatus.Draft ? (
                    <UpdateIcon
                      onClick={() =>
                        updateQuery({
                          openResponse: element.code,
                        })
                      }
                    />
                  ) : null,
                // originalReviewResponse: latestOriginalReviewResponse,
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

type ReviewApplicantResponseProps = ReviewElementProps & SummaryViewWrapperProps

const ReviewApplicantResponse: React.FC<ReviewApplicantResponseProps> = ({
  reviewResponse,
  ExtraUserAction,
  ExtraEditAction,
  ...otherProps
}) => (
  <div>
    <ApplicantResponseElement {...otherProps}>
      {ExtraUserAction && <ExtraUserAction />}
    </ApplicantResponseElement>
    <ReviewDecisionElement reviewResponse={reviewResponse} {...otherProps}>
      {ExtraEditAction && <ExtraEditAction />}
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
