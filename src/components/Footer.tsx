import React from 'react'
import { Segment, Container, Icon } from 'semantic-ui-react'

const Footer = () => (
    <Segment inverted>
        <Container textAlign="center">
            semantic-ui-react menu example with react-router-dom
            <Icon name="react" style={{ marginLeft: '5px' }} />
        </Container>
    </Segment>
)

export default Footer