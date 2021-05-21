import React from 'react'
import { Header, Icon, List } from 'semantic-ui-react'
import { SectionDetails } from '../../utils/types'

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
          <div className="section-single-row-box-container">
            <div className="centered-flex-box-row flex-grow-1">
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
