import React, { useReducer } from 'react'
import { LookUpTableImportCsvReducer } from '.'
import { LookUpTableImportCsvType } from '../types'

const initialState: LookUpTableImportCsvType = {
  uploadModalOpen: false,
  file: null,
  tableName: '',
  submittable: false,
  submitting: false,
  errors: [],
  success: false,
}

const LookUpTableImportCsvContext = React.createContext<{
  state: LookUpTableImportCsvType
  dispatch: React.Dispatch<any>
}>({
  state: initialState,
  dispatch: () => null,
})

const LookUpTableImportCsvProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(LookUpTableImportCsvReducer, initialState)

  return (
    <LookUpTableImportCsvContext.Provider value={{ state, dispatch }}>
      {children}
    </LookUpTableImportCsvContext.Provider>
  )
}

export { LookUpTableImportCsvContext, LookUpTableImportCsvProvider }
