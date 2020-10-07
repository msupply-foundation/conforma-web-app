import React from 'react'
import { Container, Header } from 'semantic-ui-react'

export interface ApplicationStepProps {
  sectionName?: string
  page?: string
}

const ApplicationStep: React.FC<ApplicationStepProps> = (props) => {
  const { sectionName, page } = props
  return (
    <Container>
      {/* {sections.map(section => ... )} */}
      <NextPageButton sectionName={sectionName} page={page} />
    </Container>
  )
}

type ButtonProps = { sectionName?: string; page?: string }

const NextPageButton: React.FC<ButtonProps> = (props) => {
  //   const history = useHistory()
  //   const handleClick = () => {
  //     history.push('page' + (Number(props.page) + 1))
  //   }
  //   if (!props.sectionName) {
  //     return <div></div>
  //   }
  const handleClick = () => console.log('Next page')

  return (
    <button type="submit" onClick={handleClick}>
      Next Page
    </button>
  )
}

export default ApplicationStep
