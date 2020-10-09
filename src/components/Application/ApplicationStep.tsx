import React from 'react'
import { Container, Header } from 'semantic-ui-react'

export interface ApplicationStepProps {
  sectionCode?: string
  page?: string
}

const ApplicationStep: React.FC<ApplicationStepProps> = (props) => {
  const { sectionCode, page } = props
  return (
    <Container>
      {sectionCode && page ? (
        <Header content={`PAGE ${page} of SECTION ${sectionCode}`} />
      ) : (
        <Header content={`HOME page of the Application`} />
      )}
      {/* {sections.map(section => ... )} */}
      <NextPageButton sectionCode={sectionCode} page={page} />
    </Container>
  )
}

type ButtonProps = { sectionCode?: string; page?: string }

const NextPageButton: React.FC<ButtonProps> = (props) => {
  //   const history = useHistory()
  //   const handleClick = () => {
  //     history.push('page' + (Number(props.page) + 1))
  //   }
  //   if (!props.sectionCode) {
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
