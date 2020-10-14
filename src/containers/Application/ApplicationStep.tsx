import React from 'react'
import { Container, Header, Segment } from 'semantic-ui-react'
import { useApplicationState } from '../../contexts/ApplicationState'
import { useRouter } from '../../utils/hooks/useRouter'

const ApplicationStep: React.FC = () => {
  const { applicationState, setApplicationState } = useApplicationState()
  const { pageNumber } = applicationState

  return (
    <Container>
      <Segment><Header content={'Test'} /></Segment>
      
      {/* {sections.map(section => ... )} */}
      <NextPageButton page={pageNumber as number} />
    </Container>
  )
}

type ButtonProps = { page?: number }

const NextPageButton: React.FC<ButtonProps> = (props) => {
    const { push } = useRouter()
    const handleClick = () => {
      push('page' + props.page + 1)
    }

  return (
    <button type="submit" onClick={handleClick}>
      Next Page
    </button>
  )
}

export default ApplicationStep
