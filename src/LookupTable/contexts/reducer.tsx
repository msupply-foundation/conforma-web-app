enum Types {
  UploadModalOpen = 'OPEN_MODAL',
  UploadModalClose = 'CLOSE_MODAL',
  ImportCSV = 'SET_FILE',
  SetTableName = 'SET_TABLE_NAME',
}

type LookUpTableListType = {
  uploadModalOpen: boolean
  file: File | null
  tableName: string | null
}

type LookUpTableListActions =
  | { type: 'OPEN_MODAL' }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_FILE'; payload: File }
  | { type: 'SET_TABLE_NAME'; payload: string }

const LookUpTableUploadModalReducer = (
  state: LookUpTableListType,
  action: LookUpTableListActions
): LookUpTableListType => {
  console.log('state', state)
  console.log('action', action)
  switch (action.type) {
    case Types.UploadModalOpen:
      return { ...state, uploadModalOpen: true }
    case Types.UploadModalClose:
      return { ...state, uploadModalOpen: false }
    case Types.ImportCSV:
      return { ...state, file: action.payload }
    case Types.SetTableName:
      return { ...state, tableName: action.payload }
    default:
      return state
  }
}

export { Types, LookUpTableListActions, LookUpTableListType, LookUpTableUploadModalReducer }
