import React from 'react'
import { Header, Icon, List } from 'semantic-ui-react'
import { SectionDetails } from '../../../utils/types'

interface SectionsListProps {
  sections: SectionDetails[]
}

const SectionsList: React.FC<SectionsListProps> = ({ sections }) => {
  return (
    <List
      celled
      relaxed="very"
      items={Object.entries(sections).map(([sectionCode, { title }]) => ({
        key: `list-item-${sectionCode}`,
        content: (
          <div className="line-vertical-box">
            <div className="left">
              <Icon name="circle outline" />
              <Header content={title} />
            </div>
            <div></div>
          </div>
        ),
      }))}
    />
  )
}

export default SectionsList
