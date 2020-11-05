import { Layout, Menu, PageHeader, Table, Drawer, Button, Space, Form, Input, Tooltip, Select, Col, Row, DatePicker, AutoComplete } from 'antd';
import {
    DesktopOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined
} from '@ant-design/icons';
import React from 'react';
import { RootState } from '../app/store';
import { ConnectedProps, connect } from 'react-redux';
import { remove, add, edit } from '../features/courses/record'
import Column from 'antd/lib/table/Column';
import { Record } from '../data/types'
import  AcademicRecordForm from '../components/forms/AcademicRecordForm';

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

declare global {
    interface Array<T> {
        unique(): Array<T>;
    }
}

Object(Array).prototype.unique = function () {
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

class AcademicRecordPage extends React.Component<Props, State> {
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

    render() {
        return (
            <PageHeader
                style={{width: "100%"}}
                backIcon={false}
                title="Your Academic Record"
            >
                <Content style={{ padding: 24 }}>
                    <Table dataSource={this.props.data} pagination={false} rowKey="recordID">
                        <Column title="Code" render={this.renderCode} {...this.filtering(this.extractSubject)} />
                        <Column title="Name" render={this.renderName} />
                        <Column title="Instructor" render={this.renderInstructor} />
                        <Column title="Semester" render={this.renderSemester} {...this.filtering(this.extractSemester)} />
                        <Column title="Grade" render={this.renderGrade} {...this.filtering(this.extractGrade)} />
                        <Column title="Status" render={this.renderStatus} {...this.filtering(this.extractStatus)} />
                        <Column title={<Button type="primary" onClick={() => { this.setState({ drawerOpen: true }) }} icon={<PlusOutlined/>}>Add</Button>} align="right" render={(_, r: Record) => (
                            <Space>
                                <Button type={"text"} shape={"circle"} icon={<EditOutlined />}></Button>
                                <Button danger onClick={(e) => { this.props.remove(r.recordID); }} type={"text"} shape={"circle"} icon={<DeleteOutlined />}></Button>
                            </Space>
                        )} />
                    </Table>
                </Content>
                <Footer style={{ textAlign: 'center' }}>CourseConvo ©2020 Created by JAMS</Footer>
                <Drawer
                    title="Add Academic Record"
                    placement="right"
                    width={467}
                    visible={this.state.drawerOpen}
                    onClose={() => this.setState({ drawerOpen: false })}>
                    <Drawer
                        title="Basic Drawer"
                        placement="right"
                        onClose={() => this.setState({ drawerOpen: false })}>
                    </Drawer>
                    <AcademicRecordForm/>
                </Drawer>
            </PageHeader>
        );
    }
}

export default connector(AcademicRecordPage);