import { Layout, Menu, PageHeader, Table, Drawer, Button, Space, Form, Input, Tooltip, Select, Col, Row, DatePicker, AutoComplete } from 'antd';
import {
    DesktopOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import React from 'react';
import { RootState } from '../app/store';
import { ConnectedProps, connect } from 'react-redux';
import { remove, add, edit } from '../features/courses/record'
import Column from 'antd/lib/table/Column';
import { Record } from '../data/types'

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

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