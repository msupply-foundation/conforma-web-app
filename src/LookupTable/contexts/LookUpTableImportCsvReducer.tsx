import {
  LookUpTableImportCsvActions,
  LookUpTableImportCsvActionType,
  LookUpTableImportCsvType,
} from '../types'

const LookUpTableImportCsvReducer = (
  state: LookUpTableImportCsvType,
  action: LookUpTableImportCsvActionType
): LookUpTableImportCsvType => {
  switch (action.type) {
    case LookUpTableImportCsvActions.UploadModalOpen:
      return { ...state, uploadModalOpen: true }
    case LookUpTableImportCsvActions.UploadModalClose:
      return { ...state, uploadModalOpen: false }
    case LookUpTableImportCsvActions.ImportCSV:
      return { ...state, file: action.payload }
    case LookUpTableImportCsvActions.SetTableName:
      return { ...state, tableName: action.payload }
    default:
      return state
  }
}

export default LookUpTableImportCsvReducer
