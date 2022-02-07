import React, { useState } from 'react'
import { DateTime } from 'luxon'
import {
  Container,
  Accordion,
  Icon,
  List,
  Table,
  TableHeader,
  TableHeaderCell,
} from 'semantic-ui-react'
import { TimelineEvent, TimelineStage } from '../../../utils/hooks/useTimeline/types'
import { Stage } from '../../../components/Review'
import Markdown from '../../../utils/helpers/semanticReactMarkdown'
import { EventType } from '../../../utils/generated/graphql'

export const ReviewTable: React.FC<{
  reviews: any
}> = ({ reviews }) => {
  return (
    <Table stackable>
      <Table.Header>
        <Table.HeaderCell>Type</Table.HeaderCell>
        <Table.HeaderCell>Sections</Table.HeaderCell>
        <Table.HeaderCell>Reviewer</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell>Decision</Table.HeaderCell>
      </Table.Header>
    </Table>
  )
}
