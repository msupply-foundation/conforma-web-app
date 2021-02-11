import { ProgressStatus } from '../../types'

export enum PROGRESS_STATUS {
  NOT_VALID = 'NOT_VALID',
  VALID = 'VALID',
  INCOMPLETE = 'INCOMPLETE',
}

export const getCombinedStatus = (pages: ProgressStatus[] | undefined): ProgressStatus => {
  if (!pages) return PROGRESS_STATUS.VALID
  if (pages.some((status) => status === PROGRESS_STATUS.NOT_VALID)) return PROGRESS_STATUS.NOT_VALID
  if (pages.some((status) => status === PROGRESS_STATUS.INCOMPLETE))
    return PROGRESS_STATUS.INCOMPLETE
  return PROGRESS_STATUS.VALID
}
