// Use this type so Typescript will allow to access Luxon DateTime constants by index
// e.g.
// const dateParameter: DateTimeConstant = "DATE_MED"
// console.log(DateTime.toLocaleString(DateTime[dateParameter]))

export type DateTimeConstant =
  | 'DATE_SHORT'
  | 'DATE_MED'
  | 'DATE_MED_WITH_WEEKDAY'
  | 'DATE_FULL'
  | 'DATE_HUGE'
  | 'TIME_SIMPLE'
  | 'TIME_WITH_SECONDS'
  | 'TIME_WITH_SHORT_OFFSET'
  | 'TIME_WITH_LONG_OFFSET'
  | 'TIME_24_SIMPLE'
  | 'TIME_24_WITH_SECONDS'
  | 'TIME_24_WITH_SHORT_OFFSET'
  | 'TIME_24_WITH_LONG_OFFSET'
  | 'DATETIME_SHORT'
  | 'DATETIME_SHORT_WITH_SECONDS'
  | 'DATETIME_MED'
  | 'DATETIME_MED_WITH_SECONDS'
  | 'DATETIME_MED_WITH_WEEKDAY'
  | 'DATETIME_FULL'
  | 'DATETIME_FULL_WITH_SECONDS'
  | 'DATETIME_HUGE'
  | 'DATETIME_HUGE_WITH_SECONDS'
