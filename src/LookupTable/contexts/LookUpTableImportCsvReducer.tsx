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
      return {
        ...state,
        uploadModalOpen: true,
        file: null,
        tableName: '',
        submittable: false,
        submitting: false,
        errors: [],
        success: [],
      }
    case LookUpTableImportCsvActions.UploadModalClose:
      return { ...state, uploadModalOpen: false }
    case LookUpTableImportCsvActions.ImportCSV:
      return { ...state, file: action.payload }
    case LookUpTableImportCsvActions.SetTableName:
      return { ...state, tableName: action.payload }
    case LookUpTableImportCsvActions.submittable:
      return { ...state, submittable: action.payload }
    case LookUpTableImportCsvActions.submitting:
      return { ...state, submitting: action.payload, submittable: false }
    case LookUpTableImportCsvActions.setErrorMessages:
      return { ...state, errors: action.payload, submitting: false }
    case LookUpTableImportCsvActions.setSuccessMessages:
      return {
        ...state,
        success: action.payload,
        errors: [],
        submitting: false,
        submittable: false,
      }
    default:
      return state
  }
}

export default LookUpTableImportCsvReducer
