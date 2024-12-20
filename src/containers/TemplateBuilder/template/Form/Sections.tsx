import React from 'react'
import { Button, Header, Label } from 'semantic-ui-react'
import { IconButton } from '../../shared/IconButton'

import { useOperationState } from '../../shared/OperationContext'
import { getRandomNumber } from '../../shared/OperationContextHelpers'
import { useConfirmationState } from '../../shared/ConfirmationContext'
import TextIO from '../../shared/TextIO'
import { disabledMessage, useTemplateState } from '../TemplateWrapper'

import { useApplicationOperationState, useFullApplicationState } from '../ApplicationWrapper'
import { useFormState } from './Form'
import { useFormStructureState } from './FormWrapper'

const Sections: React.FC = () => {
  const { resetApplication } = useApplicationOperationState()
  const { moveStructure } = useFormStructureState()
  const { updateTemplate } = useOperationState()
  const { structure } = useFullApplicationState()
  const { setSelectedSectionId, selectedSectionId, setSelectedPageNumber } = useFormState()
  const { template } = useTemplateState()
  const { isDraft } = template

  const createNewSection = () =>
    updateTemplate(template, {
      templateSectionsUsingId: {
        create: [
          {
            index: moveStructure.lastSectionIndex + 1,
            title: 'New Section',
            code: `newSection_${getRandomNumber()}`,
          },
        ],
      },
    })

  return (
    <div className="config-container-outline" style={{ minWidth: 700 }}>
      <div className="flex-row-start-center full-width-container">
        <Header className="no-margin-no-padding" as="h3">
          Sections
        </Header>{' '}
        <IconButton
          disabled={!isDraft}
          disabledMessage={disabledMessage}
          name="add square"
          size="large"
          onClick={createNewSection}
        />
        <div className="flex-row-end">
          <Button inverted primary onClick={resetApplication}>
            Reset Application
          </Button>
        </div>
      </div>
      <div className="spacer-10" />
      <div className="flex-row-start-center">
        <div className="flex-row-start-center-wrap flex-grow-1 flex-gap-10">
          {Object.values(structure.sections).map((section) => (
            <Label
              key={section.details.id}
              onClick={() => {
                setSelectedSectionId(section.details.id)
                setSelectedPageNumber(1)
              }}
              className={`clickable ${
                section.details.id === selectedSectionId ? 'builder-selected ' : ''
              }`}
            >
              {section.details.title}
            </Label>
          ))}
        </div>
      </div>
      <div className="spacer-20" />
      <Section />
    </div>
  )
}

const Section: React.FC = () => {
  const { selectedSectionId, unselect } = useFormState()
  const { updateTemplate, updateTemplateSection, updateApplication } = useOperationState()
  const { askForConfirmation } = useConfirmationState()
  const { structure } = useFullApplicationState()
  const { template, sections } = useTemplateState()
  const { canEdit } = template
  const { moveStructure } = useFormStructureState()

  if (selectedSectionId === -1) return null

  const selectedSection = Object.values(structure.sections).find(
    (section) => section.details.id === selectedSectionId
  )

  if (!selectedSection) return null

  const currentSection = moveStructure.sections[selectedSectionId]
  const canMoveForward = currentSection.index !== moveStructure.firstSectionIndex
  const canMoveBackward = currentSection.index !== moveStructure.lastSectionIndex

  const swapSections = (fromId: number, fromIndex: number, toId: number, toIndex: number) => {
    const currentUpdateById = {
      patch: { index: toIndex },
      id: fromId,
    }

    const previousUpdateById = {
      patch: { index: fromIndex },
      id: toId,
    }

    updateTemplate(template, {
      templateSectionsUsingId: { updateById: [currentUpdateById, previousUpdateById] },
    })
  }

  const moveSectionForward = () => {
    if (!currentSection.previousSection) return
    swapSections(
      currentSection.id,
      currentSection.index,
      currentSection.previousSection.id,
      currentSection.previousSection.index
    )
  }

  const moveSectionBackward = () => {
    if (!currentSection.nextSection) return
    swapSections(
      currentSection.id,
      currentSection.index,
      currentSection.nextSection.id,
      currentSection.nextSection.index
    )
  }

  const deleteSection = async () => {
    if (!(await askForConfirmation('Are you sure you want to delete this section'))) return
    const applicationResponseIds = Object.values(selectedSection.pages)
      .map((page) => page.state)
      .flat()
      .filter((pageElement) => !!pageElement?.latestApplicationResponse?.id)
      .map((pageElement) => pageElement.latestApplicationResponse.id)

    const elementsInSection =
      sections.find((section) => section.id === currentSection.id)?.templateElementsBySectionId
        ?.nodes || []

    if (applicationResponseIds.length > 0) {
      const result = await updateApplication(structure.info.serial, {
        applicationResponsesUsingId: {
          deleteById: applicationResponseIds.map((id) => ({ id })),
        },
      })

      if (!result) return
    }

    if (elementsInSection.length > 0) {
      const result = await updateTemplateSection(currentSection.id, {
        templateElementsUsingId: {
          deleteById: elementsInSection.map((element) => ({
            id: element?.id || 0,
          })),
        },
      })
      if (!result) return
    }

    await updateTemplate(template, {
      templateSectionsUsingId: {
        deleteById: [{ id: currentSection.id || 0 }],
      },
    })
    unselect()
  }

  return (
    <div key={selectedSectionId} className="flex-row-start-center-wrap">
      <IconButton
        disabled={!canEdit}
        disabledMessage={disabledMessage}
        name="angle up"
        onClick={moveSectionForward}
        hidden={!canMoveForward}
        toolTip="Move up"
      />
      <IconButton
        disabled={!canEdit}
        disabledMessage={disabledMessage}
        name="angle down"
        onClick={moveSectionBackward}
        hidden={!canMoveBackward}
        toolTip="Move to down"
      />

      <div className="long">
        <TextIO
          title="title"
          text={selectedSection.details.title}
          disabled={!canEdit}
          disabledMessage={disabledMessage}
          setText={(text) => {
            updateTemplate(template, {
              templateSectionsUsingId: {
                updateById: [{ id: selectedSectionId, patch: { title: text } }],
              },
            })
          }}
        />
      </div>
      <TextIO
        title="code"
        text={selectedSection.details.code}
        disabled={!canEdit}
        disabledMessage={disabledMessage}
        setText={(text) => {
          updateTemplate(template, {
            templateSectionsUsingId: {
              updateById: [{ id: selectedSectionId, patch: { code: text } }],
            },
          })
        }}
      />
      <IconButton
        disabled={!canEdit}
        disabledMessage={disabledMessage}
        name="window close"
        onClick={deleteSection}
      />
    </div>
  )
}

export default Sections
