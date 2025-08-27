import * as React from 'react';

// eslint-disable-next-line react/jsx-no-useless-fragment
const mock = (props: { children: React.ReactElement }): React.ReactElement => <>{props.children}</>;

export default mock;
