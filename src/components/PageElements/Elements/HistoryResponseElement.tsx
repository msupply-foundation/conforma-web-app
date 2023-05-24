import React from 'react'
import { Header, Icon } from 'semantic-ui-react'
import { SummaryViewWrapper } from '../../../formElementPlugins'
import getSimplifiedTimeDifference from '../../../utils/dateAndTime/getSimplifiedTimeDifference'
import { useLanguageProvider } from '../../../contexts/Localisation'
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
  const { t } = useLanguageProvider()
  return (
    <div className="response-element-content">
      <p className="secondary author-name">{author}</p>
      <div className="decision-container">
        {message ? (
          <>
            <div className="comment-container">
              <Header
                as="h5"
                // icon={attentionRequired && <Icon name="exclamation circle" color="red" size="tiny" />}
                content={title}
              />
              <p className="secondary date-indicator">{getSimplifiedTimeDifference(timeUpdated)}</p>
            </div>
            {elementTypePluginCode && response.evaluatedParameters ? (
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
                // Not passing any other responses, as these elements will be using
                // pre-evaluated parameters, not doing new evaluations
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
          </>
        ) : (
          <p>
            <em>{t('REVIEW_HISTORY_NO_RESPONSE')}</em>
          </p>
        )}
      </div>
    </div>
  )
}

export default HistoryResponseElement
