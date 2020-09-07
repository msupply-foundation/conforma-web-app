import React from 'react';
import { Icon, Header, Segment } from 'semantic-ui-react';

const NoMatch = () => {
  return (
    <Segment>
      <Icon name="minus circle" size="big" />
      <strong>Page not found!</strong>
    </Segment>
  );
};

export default NoMatch;