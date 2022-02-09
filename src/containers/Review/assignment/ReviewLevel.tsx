import React, { useEffect } from 'react'
import { Dropdown, Label } from 'semantic-ui-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { AssignmentDetails, LevelDetails, Filters, FullStructure } from '../../../utils/types'

export const ALL_LEVELS = 0

type ReviewLevelProps = {
  filters: Filters | null
  setFilters: (filters: Filters) => void
  structure: FullStructure
  assignments: AssignmentDetails[]
}

const ReviewLevel: React.FC<ReviewLevelProps> = ({
  assignments,
  structure,
  filters,
  setFilters,
}) => {
  const { strings } = useLanguageProvider()
  const { getLevelsOptions } = useHelpers()

  useEffect(() => {
    setFilters({
      selectedLevel: ALL_LEVELS,
      selectedStage: structure.info.current.stage.number,
    })
  }, [])

  const changeFilters =
    (filterType: keyof Filters) =>
    (_: any, { value }: any) => {
      if (filters) setFilters({ ...filters, [filterType]: value })
    }

  if (!filters) return null

  const stage = structure.stages.find(({ stage: { number } }) => number === filters.selectedStage)

  if (!stage) return null

  return (
    <div className="section-single-row-box-container" id="review-filters-container">
      <div className="centered-flex-box-row">
        <Label className="simple-label" content={strings.REVIEW_FILTER_SHOW_TASKS_FOR} />
        <Dropdown
          className="reviewer-dropdown"
          options={getLevelsOptions(stage.levels, assignments)}
          value={filters?.selectedLevel}
          onChange={changeFilters('selectedLevel')}
        />
      </div>
    </div>
  )
}

const useHelpers = () => {
  const { strings } = useLanguageProvider()

  const getLevelsOptions = (levels: LevelDetails[], assignments: AssignmentDetails[]) => {
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
      text: strings.REVIEW_FILTER_ALL_LEVELS,
    })

    return levelsOptions
  }

  return { getLevelsOptions }
}

export default ReviewLevel
