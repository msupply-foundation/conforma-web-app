import React from 'react'
import { PageElements } from '.'
import { ElementStateNEW, ResponsesByCode } from '../../utils/types'

interface SectionProps {
  [key: string]: any
}

const SectionWrapper: React.FC<SectionProps> = ({ pages, responsesByCode, isReview }) => {
  console.log('pages', pages)
  return (
    <>
      {Object.values(pages).map((page: any) => (
        <PageElements
          key={`Page_${page.number}`}
          elements={page.state.map((elemState: any) => elemState.element)}
          responsesByCode={responsesByCode}
          isReview={isReview}
        />
      ))}
    </>
  )
}

export default SectionWrapper
