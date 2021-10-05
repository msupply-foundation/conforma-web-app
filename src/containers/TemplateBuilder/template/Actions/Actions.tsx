import React, { createContext, useContext } from 'react'
import { useEffect, useState } from 'react'
import { Header } from 'semantic-ui-react'
import { Loading } from '../../../../components'

import {
  ActionPlugin,
  TemplateAction,
  Trigger,
  useGetAllActionsQuery,
} from '../../../../utils/generated/graphql'
import { ApplicationDetails } from '../../../../utils/types'
import CheckboxIO from '../../shared/CheckboxIO'
import DropdownIO from '../../shared/DropdownIO'
import { EvaluationHeader } from '../../shared/Evaluation'
import { IconButton } from '../../shared/IconButton'
import { useOperationState } from '../../shared/OperationContext'
import TextIO from '../../shared/TextIO'
import { stringSort } from '../Permissions/PermissionNameInfo/PermissionNameInfo'
import { disabledMessage, useTemplateState } from '../TemplateWrapper'
import TriggerDisplay from './TriggerDisplay'
import { useFormStructureState } from '../Form/FormWrapper'
import { getRequest } from '../../../../utils/helpers/fetchMethods'
import config from '../../../../config'

type ActionsByCode = { [actionCode: string]: ActionPlugin }

type ActionContext = {
  allActionsByCode: ActionsByCode
  applicationData: any
  loading: boolean
}

const Context = createContext<ActionContext>({
  allActionsByCode: {},
  applicationData: {},
  loading: true,
})

const ActionsWrapper: React.FC = () => {
  const [state, setState] = useState<ActionContext>({
    allActionsByCode: {},
    applicationData: {},
    loading: true,
  })
  const { data } = useGetAllActionsQuery()
  const { configApplicationId } = useFormStructureState()

  useEffect(() => {
    const allActions = data?.actionPlugins?.nodes
    if (!allActions) return
    const allActionsByCode: ActionsByCode = {}

    allActions.forEach((actionPlugin) => {
      if (!actionPlugin) return
      allActionsByCode[String(actionPlugin?.code)] = actionPlugin as ActionPlugin
    })

    if (!configApplicationId) return
    const url = `${config.serverREST}/admin/get-application-data?applicationId=${configApplicationId}`
    getRequest(url).then((applicationData) => {
      console.log(applicationData)
      setState({ allActionsByCode, applicationData, loading: false })
    })
  }, [data, configApplicationId])

  console.log('state', state)

  if (state.loading) return <Loading />

  return (
    <Context.Provider value={state}>
      <Actions />
    </Context.Provider>
  )
}

export const useActionState = () => useContext(Context)

const Actions: React.FC = () => {
  const [selectedTrigger, setSelectedTrigger] = useState<Trigger | null>(null)
  const [usedTriggers, setUsedTrigger] = useState<Trigger[]>([])
  const {
    actions,
    template: { isDraft },
  } = useTemplateState()

  useEffect(() => {
    const newUsedTriggers = [...usedTriggers]
    actions.forEach((action) => {
      if (newUsedTriggers.includes(action?.trigger || Trigger.OnApplicationCreate)) return
      newUsedTriggers.push(action?.trigger || Trigger.OnApplicationCreate)
    })
    setUsedTrigger(newUsedTriggers.sort(stringSort))
  }, [])

  const allTriggers = Object.values(Trigger)
  const availableTriggers = allTriggers.filter((trigger) => !usedTriggers.includes(trigger))

  const addTrigger = () => {
    if (!selectedTrigger) return
    setUsedTrigger([...usedTriggers, selectedTrigger].sort(stringSort))
    setSelectedTrigger(null)
  }

  return (
    <div className="flew-column-start-start">
      <div className="flex-row-start-center">
        <Header as="h4" className="no-margin-no-padding">
          Triggers
        </Header>
        <DropdownIO
          title=""
          isPropUpdated={true}
          value={String(selectedTrigger)}
          disabled={!isDraft}
          placeholder={
            availableTriggers.length === 0 ? 'All triggers are in use' : 'Select  To Add'
          }
          disabledMessage={disabledMessage}
          setValue={(trigger) => {
            setSelectedTrigger(trigger as Trigger)
          }}
          options={availableTriggers}
        />
        {selectedTrigger && (
          <IconButton
            name="add square"
            onClick={addTrigger}
            disabled={!isDraft}
            disabledMessage={disabledMessage}
          />
        )}
      </div>

      {usedTriggers.map((trigger) => (
        <TriggerDisplay key={trigger} trigger={trigger} allTemplateActions={actions} />
      ))}
    </div>
  )
}

export default ActionsWrapper
