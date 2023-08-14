import React, { useEffect } from 'react'
import { Dropdown, Label } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { AssignmentDetails, LevelDetails, Filters, FullStructure } from '../../../utils/types'

export const ALL_LEVELS = 0

type ReviewLevelProps = {
  filters: Filters | null
  setFilters: (filters: Filters) => void
  structure: FullStructure
}

const ReviewLevel: React.FC<ReviewLevelProps> = ({ structure, filters, setFilters }) => {
  const { t } = useLanguageProvider()

  useEffect(() => {
    setFilters({
      selectedLevel: ALL_LEVELS,
      currentStage: structure.info.current.stage.number, // Fixed with current for application
    })
  }, [])

  const changeFilters =
    (filterType: keyof Filters) =>
    (_: any, { value }: any) => {
      if (filters) setFilters({ ...filters, [filterType]: value })
    }

  const getLevelsOptions = (levels: LevelDetails[]) => {
    let levelsOptions: { value: number; key: number; text: string }[] = [
      ...levels.map(({ name, number }) => ({
        text: name,
        key: number,
        value: number,
      })),
    ]
    levelsOptions.push({
      value: ALL_LEVELS,
      key: ALL_LEVELS,
      text: t('REVIEW_FILTER_ALL_LEVELS'),
    })

    return levelsOptions
  }

  if (!filters) return null

  const stage = structure.stages.find(({ stage: { number } }) => number === filters.currentStage)

  if (!stage) return null

  return (
    <div className="section-single-row-box-container" id="review-filters-container">
      <div className="centered-flex-box-row">
        <Label className="uppercase-label" content={t('REVIEW_FILTER_SHOW_TASKS_FOR')} />
        <Dropdown
          className="reviewer-dropdown"
          options={getLevelsOptions(stage.levels)}
          value={filters?.selectedLevel}
          onChange={changeFilters('selectedLevel')}
        />
      </div>
    </div>
  )
}

export default ReviewLevel
