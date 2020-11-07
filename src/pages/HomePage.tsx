import { PageHeader } from 'antd';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../app/store';

type ComponentProps = {}
type ComponentState = {}

const mapState = (state: RootState) => ({});

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState

class HomePage extends React.Component<Props, State> {
    render() {
        return (
            <PageHeader
                title="Home">
            </PageHeader>
        );
    }
}

export default connector(HomePage);