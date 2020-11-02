import { Layout, Menu, PageHeader, Table, Drawer, Button, Dropdown, Checkbox, Space } from 'antd';
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
import { remove } from '../features/courses/record'
import Column from 'antd/lib/table/Column';
import { Record } from '../data/types'

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

declare global {
    interface Array<T> {
        unique(): Array<T>;
    }
}

Array.prototype.unique = function () {
    return [...new Set(this)];
};

type ComponentProps = {}
type ComponentState = {
    drawerOpen: boolean,
    visible: boolean
}

const mapState = (state: RootState) => ({
    courses: state.courses,
    data: Object.values(state.records)
});

const mapDispatch = {
    remove: remove,
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState

class CourseHistory extends React.Component<Props, State> {
    state: State = {
        drawerOpen: false,
        visible: false
    }

    extractSubject = (record: Record) => this.props.courses[record.courseID].identifier.subject;
    extractCode = (record: Record) => this.props.courses[record.courseID].identifier.code;
    extractName = (record: Record) => this.props.courses[record.courseID].name;
    extractTerm = (record: Record) => this.props.courses[record.courseID].semester.term;
    extractYear = (record: Record) => this.props.courses[record.courseID].semester.year;
    extractSemester = (record: Record) => `${this.extractTerm(record)} ${this.extractYear(record)}`;
    extractInstructor = (record: Record) => this.props.courses[record.courseID].instructor;
    extractGrade = (record: Record) => `${record.grade ?? "-"}`;
    extractStatus = (record: Record) => record.status;

    renderCode = (_: any, record: Record) => `${this.extractSubject(record)} ${this.extractCode(record)}`;
    renderName = (_: any, record: Record) => `${this.extractName(record)}`;
    renderSemester = (_: any, record: Record) => `${this.extractSemester(record)}`;
    renderInstructor = (_: any, record: Record) => `${this.extractInstructor(record)}`;
    renderGrade = (_: any, record: Record) => `${this.extractGrade(record)}`;
    renderStatus = (_: any, record: Record) => `${this.extractStatus(record)}`;

    filtering = (filter: (record: Record) => string) => {
        return {
            filters: this.props.data.map(record =>
                filter(record),
            ).unique().map(value => ({
                text: value,
                value: value
            })),
            onFilter: (value: any, record: Record) =>
                filter(record) === value
        }
    }

    computeFilters = (extract: (record: Record) => string) => this.props.data.map(record =>
        extract(record),
    ).unique().map(value => ({
        text: value,
        value: value
    }));

    onFilter = (value: any, record: Record, extract: (record: Record) => string) =>
        extract(record) === value;

    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible width={300}>
                    <Menu theme="dark" defaultSelectedKeys={['2']} mode="inline">
                        <Menu.Item key="2" icon={<DesktopOutlined />}>
                            Course History
                        </Menu.Item>
                        <SubMenu key="sub1" icon={<UserOutlined />} title="User">
                            <Menu.Item key="3">Tom</Menu.Item>
                            <Menu.Item key="4">Bill</Menu.Item>
                            <Menu.Item key="5">Alex</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
                            <Menu.Item key="6">Team 1</Menu.Item>
                            <Menu.Item key="8">Team 2</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="9" icon={<FileOutlined />}>
                            Files
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <PageHeader
                        className="site-page-header"
                        backIcon={false}
                        title="Your Course History"
                    />
                    <Content style={{ padding: 24 }}>
                        <Table dataSource={this.props.data} pagination={false} rowKey="recordID">
                            <Column title="Code" render={this.renderCode} {...this.filtering(this.extractSubject)} />
                            <Column title="Name" render={this.renderName} />
                            <Column title="Instructor" render={this.renderInstructor} />
                            <Column title="Semester" render={this.renderSemester} {...this.filtering(this.extractSemester)} />
                            <Column title="Grade" render={this.renderGrade} {...this.filtering(this.extractGrade)} />
                            <Column title="Status" render={this.renderStatus} {...this.filtering(this.extractStatus)} />
                            <Column align="right" render={(t, r : Record) => (
                                <Space>
                                    <Button type={"text"} shape={"circle"} icon={<EditOutlined />}></Button>
                                    <Button onClick={(e) => { this.props.remove(r.recordID); }} type={"text"} shape={"circle"} icon={<DeleteOutlined />}></Button>
                                </Space>
                            )} />
                        </Table>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>CourseConvo ©2020 Created by JAMS</Footer>
                    <Drawer
                        title="Basic Drawer"
                        placement="right"
                        visible={this.state.drawerOpen}
                        onClose={() => this.setState({ drawerOpen: false })}>
                        <Drawer
                            title="Basic Drawer"
                            placement="right"
                            visible={this.state.drawerOpen}
                            onClose={() => this.setState({ drawerOpen: false })}>
                        </Drawer>
                    </Drawer>
                    <Button type="primary"
                        onClick={() => { this.setState({ drawerOpen: true }) }}
                        style={{ transition: "0.3s cubic-bezier(0.7, 0.3, 0.1, 1)", position: "absolute", bottom: 10, right: !this.state.drawerOpen ? 10 : 265 }}>
                        Open
                    </Button>
                </Layout>
            </Layout>
        );
    }
}

export default connector(CourseHistory);