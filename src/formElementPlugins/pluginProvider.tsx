import React from 'react'
import checkboxLocalisation from './checkbox/localisation.json'
import checkboxConfig from './checkbox/pluginConfig.json'
// import datePickerLocalisation from './datePicker/localisation.json'
import datePickerConfig from './datePicker/pluginConfig.json'
import dropdownChoiceConfig from './dropdownChoice/pluginConfig.json'
import dropdownChoiceLocalisation from './dropdownChoice/localisation.json'
import fileUploadLocalisation from './fileUpload/localisation.json'
import fileUploadConfig from './fileUpload/pluginConfig.json'
// import imageDisplayLocalisation from './imageDisplay/localisation.json'
import imageDisplayConfig from './imageDisplay/pluginConfig.json'
// import jsonEditLocalisation from './jsonEdit/localisation.json'
import jsonEditConfig from './jsonEdit/pluginConfig.json'
import listBuilderLocalisation from './listBuilder/localisation.json'
import listBuilderConfig from './listBuilder/pluginConfig.json'
// import longTextLocalisation from './longText/localisation.json'
import longTextConfig from './longText/pluginConfig.json'
import numberLocalisation from './number/localisation.json'
import numberConfig from './number/pluginConfig.json'
import passwordLocalisation from './password/localisation.json'
import passwordConfig from './password/pluginConfig.json'
import radioChoiceLocalisation from './radioChoice/localisation.json'
import radioChoiceConfig from './radioChoice/pluginConfig.json'
import searchLocalisation from './search/localisation.json'
import searchConfig from './search/pluginConfig.json'
import shortTextConfig from './shortText/pluginConfig.json'
// import textInfoLocalisation from './textInfo/localisation.json'
import textInfoConfig from './textInfo/pluginConfig.json'
import { PluginComponents, PluginConfig } from './types'

export const PluginProvider: Record<string, PluginComponents> = {
  checkbox: {
    localisation: checkboxLocalisation,
    config: checkboxConfig as PluginConfig,
    ApplicationView: React.lazy(() => import('./checkbox/src/ApplicationView')),
    SummaryView: React.lazy(() => import('./checkbox/src/SummaryView')),
  },
  datePicker: {
    localisation: {},
    config: datePickerConfig as PluginConfig,
    ApplicationView: React.lazy(() => import('./datePicker/src/ApplicationView')),
    SummaryView: React.lazy(() => import('./datePicker/src/SummaryView')),
  },
  dropdownChoice: {
    localisation: dropdownChoiceLocalisation,
    config: dropdownChoiceConfig as PluginConfig,
    ApplicationView: React.lazy(() => import('./dropdownChoice/src/ApplicationView')),
    SummaryView: React.lazy(() => import('./dropdownChoice/src/SummaryView')),
  },
  fileUpload: {
    localisation: fileUploadLocalisation,
    config: fileUploadConfig as PluginConfig,
    ApplicationView: React.lazy(() => import('./fileUpload/src/ApplicationView')),
    SummaryView: React.lazy(() => import('./fileUpload/src/SummaryView')),
  },
  imageDisplay: {
    localisation: {},
    config: imageDisplayConfig as PluginConfig,
    ApplicationView: React.lazy(() => import('./imageDisplay/src/ApplicationView')),
    SummaryView: React.lazy(() => import('./imageDisplay/src/SummaryView')),
  },
  jsonEdit: {
    localisation: {},
    config: jsonEditConfig as PluginConfig,
    ApplicationView: React.lazy(() => import('./jsonEdit/src/ApplicationView')),
    SummaryView: React.lazy(() => import('./jsonEdit/src/SummaryView')),
  },
  listBuilder: {
    localisation: listBuilderLocalisation,
    config: listBuilderConfig as PluginConfig,
    ApplicationView: React.lazy(() => import('./listBuilder/src/ApplicationView')),
    SummaryView: React.lazy(() => import('./listBuilder/src/SummaryView')),
  },
  longText: {
    localisation: {},
    config: longTextConfig as PluginConfig,
    ApplicationView: React.lazy(() => import('./longText/src/ApplicationView')),
    SummaryView: React.lazy(() => import('./longText/src/SummaryView')),
  },
  number: {
    localisation: numberLocalisation,
    config: numberConfig as PluginConfig,
    ApplicationView: React.lazy(() => import('./number/src/ApplicationView')),
    SummaryView: React.lazy(() => import('./number/src/SummaryView')),
  },
  password: {
    localisation: passwordLocalisation,
    config: passwordConfig as PluginConfig,
    ApplicationView: React.lazy(() => import('./password/src/ApplicationView')),
    SummaryView: React.lazy(() => import('./password/src/SummaryView')),
  },
  radioChoice: {
    localisation: radioChoiceLocalisation,
    config: radioChoiceConfig as PluginConfig,
    ApplicationView: React.lazy(() => import('./radioChoice/src/ApplicationView')),
    SummaryView: React.lazy(() => import('./radioChoice/src/SummaryView')),
  },
  search: {
    localisation: searchLocalisation,
    config: searchConfig as PluginConfig,
    ApplicationView: React.lazy(() => import('./search/src/ApplicationView')),
    SummaryView: React.lazy(() => import('./search/src/SummaryView')),
  },

  shortText: {
    localisation: {},
    config: shortTextConfig as PluginConfig,
    ApplicationView: React.lazy(() => import('./shortText/src/ApplicationView')),
    SummaryView: React.lazy(() => import('./shortText/src/SummaryView')),
  },
  textInfo: {
    localisation: {},
    config: textInfoConfig as PluginConfig,
    ApplicationView: React.lazy(() => import('./textInfo/src/ApplicationView')),
    SummaryView: React.lazy(() => import('./textInfo/src/SummaryView')),
  },
}
