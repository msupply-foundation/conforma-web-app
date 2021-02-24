import React from 'react'
import { ElementStateNEW, ResponsesByCode } from '../../utils/types'
import ApplicationViewWrapper from '../../formElementPlugins/ApplicationViewWrapperNEW'
import SummaryViewWrapper from '../../formElementPlugins/SummaryViewWrapper'
import { Button, Grid, Header, Message, Segment, Sticky, Form } from 'semantic-ui-react'

interface PageElementProps {
  elements: ElementStateNEW[]
  responsesByCode: ResponsesByCode
  isStrictPage?: boolean
  isEditable?: boolean
  isReview?: boolean
}

const PageElements: React.FC<PageElementProps> = ({
  elements,
  responsesByCode,
  isStrictPage,
  isEditable,
  isReview,
}) => {
  if (isEditable && !isReview)
    // Applicant Editable application
    return (
      <Form>
        {elements.map((element) => {
          const {
            code,
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
        })}
      </Form>
    )
  //   if (!isEditable && !isReview)
  //     // Summary View
  //     return (
  //       <Form>
  //         {elements.map((element) => {
  //           const {
  //             code,
  //             pluginCode,
  //             parameters,
  //             isVisible,
  //             isRequired,
  //             isEditable,
  //             validationExpression,
  //             validationMessage,
  //           } = element
  //           const response = responsesByCode?.[code]
  //           const isValid = response?.isValid
  //           return (
  //             <SummaryViewWrapper
  //               key={`question_${code}`}
  //               code={code}
  //               initialValue={response}
  //               pluginCode={pluginCode}
  //               parameters={parameters}
  //               isVisible={isVisible}
  //               isEditable={isEditable}
  //               isRequired={isRequired}
  //               isValid={isValid || true}
  //               isStrictPage={true}
  //               validationExpression={validationExpression}
  //               validationMessage={validationMessage}
  //               allResponses={responsesByCode}
  //               currentResponse={response}
  //             />
  //           )
  //         })}
  //       </Form>
  //     )
  // Review Page
  else return <p> Nothing to see here</p>
}

export default PageElements
