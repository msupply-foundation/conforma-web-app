import React from 'react'
import { Container, Header } from 'semantic-ui-react'
import { useRouter } from '../../utils/hooks/useRouter'

export interface ApplicationStepProps {
  sectionCode: string
  page: string
}

const ApplicationStep: React.FC<ApplicationStepProps> = (props) => {
  const { sectionCode, page } = props
  return (
    <Container>
      <Header content={`PAGE ${page} of SECTION ${sectionCode}`} />
      {/* {sections.map(section => ... )} */}
      <NextPageButton sectionCode={sectionCode} page={page} />
    </Container>
  )
}

type ButtonProps = { sectionCode?: string; page?: string }

const NextPageButton: React.FC<ButtonProps> = (props) => {
    const { push } = useRouter()
    const handleClick = () => {
      push('page' + (Number(props.page) + 1))
    }
    if (!props.sectionCode) {
      return <div></div>
    }

  return (
    <button type="submit" onClick={handleClick}>
      Next Page
    </button>
  )
}

export default ApplicationStep
