import { camelCase } from 'lodash'
import React, { useReducer } from 'react'
import {
  LookUpTableImportCsvActions,
  LookUpTableImportCsvActionType,
  LookUpTableImportCsvType,
} from '../types'

const initialState: LookUpTableImportCsvType = {
  uploadModalOpen: false,
  file: null,
  tableName: '',
  submittable: false,
  submitting: false,
  errors: [],
  success: [],
}

const LookUpTableImportCsvContext = React.createContext<{
  state: LookUpTableImportCsvType
  dispatch: React.Dispatch<LookUpTableImportCsvActionType>
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

const LookUpTableImportCsvReducer = (
  state: LookUpTableImportCsvType,
  action: LookUpTableImportCsvActionType
): LookUpTableImportCsvType => {
  switch (action.type) {
    case LookUpTableImportCsvActions.UploadModalOpen:
      return {
        ...initialState,
        uploadModalOpen: true,
      }
    case LookUpTableImportCsvActions.UploadModalClose:
      return { ...state, uploadModalOpen: false }
    case LookUpTableImportCsvActions.ImportCSV:
      return { ...state, file: action.payload }
    case LookUpTableImportCsvActions.SetTableName: {
      const restrictCharacters = action.payload.replace(/[^A-z_]/gm, '')
      return { ...state, tableName: restrictCharacters }
    }
    case LookUpTableImportCsvActions.submittable:
      return { ...state, submittable: action.payload }
    case LookUpTableImportCsvActions.submitting:
      return { ...state, submitting: action.payload, submittable: false }
    case LookUpTableImportCsvActions.setErrorMessages:
      return { ...state, errors: action.payload, submitting: false }
    case LookUpTableImportCsvActions.setSuccessMessages:
      return {
        ...state,
        submitting: false,
        success: action.payload,
      }
    default:
      return state
  }
}

export { LookUpTableImportCsvContext, LookUpTableImportCsvProvider }
