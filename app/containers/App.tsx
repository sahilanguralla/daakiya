import React, {ReactNode, PureComponent, Fragment} from 'react';

interface Props {
  children: ReactNode;
}

export default class App extends PureComponent<Props> {
  render() {
    const {children} = this.props;
    return <Fragment>{children}</Fragment>;
  }
}
