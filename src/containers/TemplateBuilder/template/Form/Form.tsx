import React, { createContext, useContext, useEffect, useState } from 'react'
import { Loading } from '../../../../components'

import Elements from './Elements'
import { useFormStructureState } from './FormWrapper'

import Pages from './Pages'
import Sections from './Sections'

type SetSelectedSectionId = (templateSectionId: number) => void
type SetSelectedPageNumber = (selectedPageNumber: number) => void

type FormState = {
  selectedSectionId: number
  selectedPageNumber: number
  setSelectedSectionId: SetSelectedSectionId
  setSelectedPageNumber: SetSelectedPageNumber
  unselect: () => void
}

const contextNotDefined = () => {
  throw new Error('form state context not defiend')
}
const defaultFormState: FormState = {
  selectedSectionId: -1,
  selectedPageNumber: 1,
  setSelectedSectionId: contextNotDefined,
  setSelectedPageNumber: contextNotDefined,
  unselect: contextNotDefined,
}
const FormContext = createContext<FormState>(defaultFormState)

const Form: React.FC = () => {
  const { moveStructure } = useFormStructureState()
  const [state, setState] = useState<FormState>(defaultFormState)

  useEffect(() => {
    setState({
      // Select first section on refresh if none is loaded
      selectedSectionId:
        Object.values(moveStructure.sections).find(
          ({ index }) => index === moveStructure.firstSectionIndex
        )?.id ?? -1,
      selectedPageNumber: 1,
      setSelectedPageNumber: (selectedPageNumber) =>
        setState((state) => ({ ...state, selectedPageNumber })),
      setSelectedSectionId: (selectedSectionId) =>
        setState((state) => ({ ...state, selectedSectionId })),
      unselect: () =>
        setState((state) => ({ ...state, selectedPageNumber: -1, selectedSectionId: -1 })),
    })
  }, [])

  if (!state) return <Loading />

  return (
    <FormContext.Provider value={state}>
      <div className="flex-column-start-stretch">
        <Sections />
        <Pages />
        <Elements />
      </div>
    </FormContext.Provider>
  )
}

export const useFormState = () => useContext(FormContext)

export default Form
