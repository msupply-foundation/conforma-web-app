import React from 'react'
import { Header, Icon } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../../formElementPlugins'
import getSimplifiedTimeDifference from '../../../utils/dateAndTime/getSimplifiedTimeDifference'
import { ElementState, HistoryElement } from '../../../utils/types'

const HistoryResponseElement: React.FC<HistoryElement> = ({
  author = '',
  title,
  message,
  timeUpdated,
  // attentionRequired = false,
  reviewerComment,
  response,
  elementTypePluginCode,
  parameters,
}) => {
  return (
    <div className="response-element-content">
      <p className="secondary author-name">{author}</p>
      <div className="decision-container">
        <div className="comment-container">
          <Header
            as="h5"
            // icon={attentionRequired && <Icon name="exclamation circle" color="red" size="tiny" />}
            content={title}
          />
          <p className="secondary date-indicator">{getSimplifiedTimeDifference(timeUpdated)}</p>
        </div>
        {elementTypePluginCode ? (
          <SummaryViewWrapper
            element={
              {
                parameters,
                pluginCode: elementTypePluginCode,
                isRequired: true,
                isVisible: true,
              } as ElementState
            }
            response={response}
            allResponses={{}}
          />
        ) : (
          <p>{message}</p>
        )}
        {!!reviewerComment && (
          <div className="comment-container">
            <Icon name="comment alternate outline" color="grey" />
            <p className="secondary">{reviewerComment}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryResponseElement
