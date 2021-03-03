import React from 'react'
import { Link } from 'react-router-dom'
import { ElementStateNEW, ResponsesByCode, SectionAndPage } from '../../utils/types'
import ApplicationViewWrapper from '../../formElementPlugins/ApplicationViewWrapperNEW'
import SummaryViewWrapperNEW from '../../formElementPlugins/SummaryViewWrapperNEW'
import { Form, Grid, Segment, Button } from 'semantic-ui-react'
import strings from '../../utils/constants'
import { TemplateElementCategory } from '../../utils/generated/graphql'

interface PageElementProps {
  elements: ElementStateNEW[]
  responsesByCode: ResponsesByCode
  isStrictPage?: boolean
  canEdit?: boolean
  isReview?: boolean
  isSummary?: boolean
  serial?: string
  sectionAndPage?: SectionAndPage
}

const PageElements: React.FC<PageElementProps> = ({
  elements,
  responsesByCode,
  isStrictPage,
  canEdit,
  isReview,
  isSummary,
  serial,
  sectionAndPage,
}) => {
  // Applicant Editable application
  return (
    <Form>
      <Segment.Group>
        {elements.map((element) => {
          const {
            code,
            category,
            pluginCode,
            parameters,
            isVisible,
            isRequired,
            isEditable,
            validationExpression,
            validationMessage,
          } = element
          const response = responsesByCode?.[code]
          const isValid = response?.isValid

          // Regular application view
          if (canEdit && !isReview && !isSummary)
            return (
              <ApplicationViewWrapper
                key={`question_${code}`}
                code={code}
                initialValue={response}
                pluginCode={pluginCode}
                parameters={parameters}
                isVisible={isVisible}
                isEditable={isEditable}
                isRequired={isRequired}
                isValid={isValid || true}
                isStrictPage={isStrictPage}
                validationExpression={validationExpression}
                validationMessage={validationMessage}
                allResponses={responsesByCode}
                currentResponse={response}
              />
            )
          // Summary Page
          if (isSummary) {
            const { sectionCode, pageNumber } = sectionAndPage as SectionAndPage
            return (
              <Segment key={`question_${code}`}>
                <Grid columns={2} verticalAlign="middle">
                  <Grid.Row>
                    <Grid.Column width={13}>
                      <SummaryViewWrapperNEW
                        element={element}
                        response={response}
                        allResponses={responsesByCode}
                      />
                    </Grid.Column>
                    <Grid.Column width={3}>
                      {category === TemplateElementCategory.Question && isEditable && canEdit && (
                        <Button
                          content={strings.BUTTON_SUMMARY_EDIT}
                          size="small"
                          as={Link}
                          to={`/application/${serial}/${sectionCode}/Page${pageNumber}`}
                        />
                      )}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Segment>
            )
          }
          // Review Page -- TO-DO
          if (isReview) return <p>Review Elements</p>
        })}
      </Segment.Group>
    </Form>
  )
}

export default PageElements
