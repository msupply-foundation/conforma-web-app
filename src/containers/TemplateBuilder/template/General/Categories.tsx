import React, { useState } from 'react'
import { Icon, Header } from 'semantic-ui-react'
import { Loading } from '../../../../components'
import { useGetTemplateCategoriesQuery, UiLocation } from '../../../../utils/generated/graphql'
import ButtonWithFallback from '../../shared/ButtonWidthFallback'
import CheckboxIO from '../../shared/CheckboxIO'
import DropdownIO from '../../shared/DropdownIO'
import { useOperationState } from '../../shared/OperationContext'
import TextIO, { iconLink } from '../../shared/TextIO'
import { useTemplateState } from '../TemplateWrapper'
import { useLanguageProvider } from '../../../../contexts/Localisation'

const useCategoryInfo = () => {
  const { t } = useLanguageProvider()

  const noCategory = {
    title: t('TEMPLATE_NO_CATEGORY'),
    id: -1,
    code: '',
    icon: '',
    uiLocation: [],
  }

  const newCategory = {
    code: t('TEMPLATE_NEW_CODE'),
    icon: t('DEFAULT_TEMPLATE_CATEGORY_ICON'),
    title: t('TEMPLATE_NEW_TITLE'),
    uiLocation: [UiLocation.List],
  }

  const uiLocationOptions: { key: UiLocation; locationName: string }[] = [
    { key: UiLocation.List, locationName: t('TEMPLATE_UI_MENU') },
    { key: UiLocation.Dashboard, locationName: t('TEMPLATE_UI_DASHBOARD') },
    { key: UiLocation.User, locationName: t('TEMPLATE_UI_USER') },
    { key: UiLocation.Management, locationName: t('TEMPLATE_UI_MANAGE') },
    { key: UiLocation.Admin, locationName: t('TEMPLATE_UI_ADMIN') },
  ]

  return { noCategory, newCategory, uiLocationOptions }
}

type CategoryUpdate = {
  code: string
  id?: number
  icon: string | null
  title: string | null
  uiLocation: UiLocation[]
}

const Category: React.FC<{}> = () => {
  const { t } = useLanguageProvider()
  const { noCategory, newCategory, uiLocationOptions } = useCategoryInfo()
  const { category, template } = useTemplateState()
  const { updateTemplate } = useOperationState()
  const [updateState, setUpdateState] = useState<CategoryUpdate | null>(null)
  const { data: templateCategoriesData, refetch: refetchCategories } =
    useGetTemplateCategoriesQuery()

  if (!templateCategoriesData?.templateCategories?.nodes) return <Loading />

  const categories = templateCategoriesData?.templateCategories?.nodes || []
  const selectedCategory =
    categories.find((_category) => _category?.id === category?.id) || noCategory

  const categoryOptions = [...categories, noCategory]

  const renderAddEdit = () => {
    if (updateState) return null
    const canRenderEdit = selectedCategory.id !== noCategory.id
    if (!template.canEdit) return null
    return (
      <>
        <Icon className="clickable" name="add square" onClick={() => setUpdateState(newCategory)} />
        {canRenderEdit && (
          <Icon
            className="clickable"
            name="edit"
            onClick={() => {
              setUpdateState({
                code: selectedCategory?.code || '',
                icon: selectedCategory?.icon || '',
                id: selectedCategory?.id,
                title: selectedCategory?.title || '',
                uiLocation: (selectedCategory?.uiLocation || []) as UiLocation[],
              })
            }}
          />
        )}
      </>
    )
  }

  const addCategory = async () => {
    if (
      await updateTemplate(template, {
        templateCategoryToTemplateCategoryId: {
          create: updateState,
        },
      })
    )
      refetchCategories()
    setUpdateState(null)
  }

  const editCategory = async () => {
    if (updateState === null) return
    if (
      await updateTemplate(template, {
        templateCategoryToTemplateCategoryId: {
          updateById: {
            patch: updateState,
            id: updateState.id || 0,
          },
        },
      })
    )
      setUpdateState(null)
  }

  const updateUiLocationArray = (location: UiLocation, value: boolean): UiLocation[] => {
    const newLocations = (updateState?.uiLocation || []).filter((loc) => loc !== location)
    if (value) newLocations.push(location)
    return newLocations
  }

  return (
    <>
      <div className="flex-row-start-center">
        <DropdownIO
          value={selectedCategory.id}
          title={t('TEMPLATE_CATEGORIES')}
          options={categoryOptions}
          disabled={!!updateState || !template.canEdit}
          getKey={'id'}
          getValue={'id'}
          getText={'title'}
          setValue={(value) => {
            updateTemplate(template, { templateCategoryId: value === -1 ? null : Number(value) })
          }}
          minLabelWidth={100}
          labelTextAlign="right"
          additionalStyles={{ marginBottom: 0 }}
        />

        {renderAddEdit()}
      </div>
      {updateState && (
        <div className="template-builder-category-input">
          <Header as="h5">{`${
            updateState.id ? t('TEMPLATE_BUTTON_EDIT_CATEGORY') : t('TEMPLATE_BUTTON_ADD_CATEGORY')
          }`}</Header>
          <TextIO
            text={updateState.code}
            title={t('TEMPLATE_CODE')}
            setText={(text) => setUpdateState({ ...updateState, code: text ?? '' })}
          />
          <TextIO
            text={updateState?.title || ''}
            title={t('TEMPLATE_TITLE')}
            setText={(value: string | null) => setUpdateState({ ...updateState, title: value })}
          />
          <TextIO
            text={updateState?.icon || ''}
            title={t('TEMPLATE_ICON')}
            link={iconLink}
            icon={updateState.icon ?? undefined}
            setText={(value: string | null) =>
              setUpdateState({ ...updateState, icon: value || null })
            }
          />
          <div>
            <p>{t('TEMPLATE_APPEARS_IN')}:</p>
            {uiLocationOptions.map(({ key, locationName }) => (
              <CheckboxIO
                key={key}
                value={updateState.uiLocation.includes(key)}
                title={locationName}
                setValue={(value: boolean) =>
                  setUpdateState({
                    ...updateState,
                    uiLocation: updateUiLocationArray(key, value),
                  })
                }
              />
            ))}
          </div>
          <div className="spacer-20" />
          <div className="flex-row">
            <ButtonWithFallback
              title={updateState.id ? t('BUTTON_SAVE') : t('TEMPLATE_BUTTON_ADD')}
              onClick={updateState.id ? editCategory : addCategory}
            />
            <ButtonWithFallback title={t('OPTION_CANCEL')} onClick={() => setUpdateState(null)} />
          </div>
        </div>
      )}
    </>
  )
}

export default Category
