import React, { useState } from 'react'
import {
  Button,
  Dropdown,
  Header,
  Icon,
  Label,
  Image,
  Grid,
  GridRow,
  GridColumn,
} from 'semantic-ui-react'
import { useTemplateState } from '../../TemplateWrapper'
import DropdownIO from '../../../shared/DropdownIO'
import { useOperationState } from '../../../shared/OperationContext'
import FileViewer from '../../../../../formElementPlugins/fileUpload/src/SummaryView'
import { useFiles } from './useFiles'

export const FileSelector: React.FC<{}> = () => {
  const { template } = useTemplateState()
  const { updateTemplate } = useOperationState()
  const [menuSelection, setMenuSelection] = useState<number>()
  // const [menuFilter, setMenuFilter] = useState<DataViewFilter>('SUGGESTED')
  const [selectedDataViewJoinId, setSelectedDataViewJoinId] = useState<number>()
  const { fileDetails } = useFiles()

  // const menuOptions = menuItems.map(({ id, code, identifier, title }) => ({
  //   key: identifier,
  //   value: id,
  //   text:
  //     id === menuSelection ? (
  //       title
  //     ) : (
  //       <>
  //         {title}
  //         <br />
  //         <span className="smaller-text">Code: {code}</span>
  //         <br />
  //         <span className="smaller-text">ID: {identifier}</span>
  //       </>
  //     ),
  // }))

  // const addDataViewJoin = async () => {
  //   if (menuSelection) {
  //     setMenuSelection(undefined)
  //     await updateTemplate(template, {
  //       templateDataViewJoinsUsingId: { create: [{ dataViewId: menuSelection }] },
  //     })
  //   }
  // }

  // const addAllInMenu = () => {
  //   updateTemplate(template, {
  //     templateDataViewJoinsUsingId: {
  //       create: menuItems.map(({ id }) => ({ dataViewId: id })),
  //     },
  //   })
  // }

  // const deleteDataViewJoin = async () => {
  //   if (selectedDataViewJoinId) {
  //     await updateTemplate(template, {
  //       templateDataViewJoinsUsingId: { deleteById: [{ id: selectedDataViewJoinId }] },
  //     })
  //     setSelectedDataViewJoinId(undefined)
  //   }
  // }

  console.log('fileDetails', fileDetails)
  return (
    <>
      <Header as="h3">Files</Header>
      {template.canEdit && (
        <Grid divided>
          {fileDetails.map(
            ({
              unique_id,
              thumbnailUrl,
              original_filename,
              fileUrl,
              usedInAction,
              linkedInDatabase,
              missingFromDatabase,
            }) => (
              <GridRow columns={4} verticalAlign="middle">
                <GridColumn width={1}>
                  {!missingFromDatabase ? (
                    <Image src={thumbnailUrl} className="clickable" style={{ maxHeight: 40 }} />
                  ) : (
                    <Icon name="exclamation triangle" />
                  )}
                </GridColumn>
                <GridColumn width={5}>
                  {!missingFromDatabase ? original_filename : `Missing from database: ${unique_id}`}
                </GridColumn>
                {!missingFromDatabase ? (
                  <>
                    <GridColumn width={2}>
                      <Label content={usedInAction ? 'Used in Action' : 'Not used'} />
                    </GridColumn>
                    <GridColumn width={1}>{linkedInDatabase && <Icon name="linkify" />}</GridColumn>
                  </>
                ) : (
                  <GridColumn width={3}>Please fix...</GridColumn>
                )}
                <GridColumn width={2}>
                  <Button>Hang on</Button>
                </GridColumn>
              </GridRow>
            )
          )}
        </Grid>
      )}
    </>
  )
}
