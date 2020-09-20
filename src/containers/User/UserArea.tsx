import React from 'react'
import { Button, Container, Label, Segment } from 'semantic-ui-react';
import { useUserState } from './UserState' 

const UserArea: React.FC = () => {
    const { 
        userState: { user },
        setUserState
        } = useUserState();
    
    return (
        <Segment.Group vertical> 
            <Container>
                <Label>
                    The current user is: {user} 
                </Label>
            </Container>
            <Button basic
                color = 'green'
                onClick={() => setUserState({type: 'setCurrentUser', payload: { nextUser: 'Nicole' }}) }> 
                Nicole
            </Button>
            <Button basic
                color = 'orange' 
                onClick={() => setUserState({type: 'setCurrentUser', payload: { nextUser: 'Carl' }}) }> 
                Carl
            </Button>
            <Button basic
                onClick={() => setUserState({type: 'resetCurrentUser'}) }> 
                Reset
            </Button>
        </Segment.Group>
    )
}

export default UserArea