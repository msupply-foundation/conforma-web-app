import React, { useEffect, useState } from 'react'
import { ElementBaseNEW, ElementStateNEW, FullStructure, ResponsesByCode } from '../../utils/types'
import useGetFullApplicationStructure from '../../utils/hooks/useGetFullApplicationStructure'
import { ApplicationStatus } from '../../utils/generated/graphql'
import { useApplicationState } from '../../contexts/ApplicationState'
import ApplicationViewWrapper from '../../formElementPlugins/ApplicationViewWrapperNEW'
import { useUserState } from '../../contexts/UserState'
import { useRouter } from '../../utils/hooks/useRouter'
import { Loading, NoMatch } from '../../components'
import strings from '../../utils/constants'
import messages from '../../utils/messages'
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
              isStrictPage={true}
              validationExpression={validationExpression}
              validationMessage={validationMessage}
              allResponses={responsesByCode}
              currentResponse={response}
            />
          )
        })}
      </Form>
    )
  // Summary Page
  // Review Page
  else return <p> Nothing to see here</p>
}

export default PageElements
