import { DateTime, Duration } from 'luxon'
import { useLanguageProvider } from '../../contexts/Localisation'

type DisplayOptions = {
  condition: (duration: Duration) => boolean
  display: (duration: Duration) => React.ReactNode
}

const useDisplayOptions = () => {
  const { t } = useLanguageProvider()

  const displayOptions: DisplayOptions[] = [
    {
      condition: (duration) => duration.as('day') <= 1,
      display: () => t('DATE_TODAY'),
    },
    {
      condition: (duration) => duration.as('day') <= 2,
      display: () => t('DATE_YESTERDAY'),
    },
    {
      condition: (duration) => duration.as('day') <= 8,
      display: (duration) => `${Math.floor(duration.as('days'))} ${t('DATE_DAYS_AGO')}`,
    },
    {
      condition: (duration) => duration.as('week') < 2,
      display: () => t('DATE_LAST_WEEK'),
    },
    {
      condition: (duration) => duration.as('week') <= 4,
      display: (duration) => `${Math.floor(duration.as('week'))} ${t('DATE_WEEKS_AGO')}`,
    },
    {
      condition: (duration) => duration.as('month') < 2,
      display: () => t('DATE_LAST_MONTH'),
    },
    {
      condition: (duration) => duration.as('month') <= 12,
      display: (duration) => `${Math.floor(duration.as('month'))} ${t('DATE_MONTHS_AGO')}`,
    },
    {
      condition: (duration) => duration.as('year') <= 2,
      display: () => t('DATE_LAST_YEAR'),
    },
    {
      condition: (duration) => duration.as('year') > 2,
      display: (duration) => `${Math.floor(duration.as('year'))} ${t('DATE_YEARS_AGO')}`,
    },
  ]

  return displayOptions
}

const getSimplifiedTimeDifference = (date: Date | undefined) => {
  const displayOptions = useDisplayOptions()
  if (!date) return ''

  const duration = DateTime.local().diff(DateTime.fromISO(`${date}`))

  const displayOption = displayOptions.find((displayOption) => displayOption.condition(duration))

  if (!displayOption) return ''

  return displayOption.display(duration)
}

export default getSimplifiedTimeDifference
