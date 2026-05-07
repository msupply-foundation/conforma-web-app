import { Header, Label } from 'semantic-ui-react'

interface LegendProps {
  hasInaccessible: boolean
  hasTemplateElements: boolean
  hasOutput: boolean
  outputText: string
}

export const Legend: React.FC<LegendProps> = ({
  hasInaccessible,
  hasTemplateElements,
  hasOutput,
  outputText,
}) => {
  return (
    <div>
      {(hasInaccessible || hasTemplateElements || hasOutput) && (
        <Header as="h4" style={{ marginBottom: 5, marginTop: 10 }}>
          Legend
        </Header>
      )}
      <div className="flex-row" style={{ gap: 10 }}>
        {hasInaccessible && (
          <Label
            key="legend-inaccessible"
            className="entity-trim-inaccessible"
            content="Applicant does NOT have permission to view, but is used in form elements"
            style={{ maxWidth: 250 }}
          />
        )}
        {hasTemplateElements && (
          <Label
            key="legend-form"
            className="entity-trim-elements"
            content="Used in Form elements"
          />
        )}
        {hasOutput && (
          <Label key="legend-output" className="entity-trim-output" content={outputText} />
        )}
      </div>
    </div>
  )
}
