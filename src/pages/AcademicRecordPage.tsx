import { Layout, Menu, PageHeader, Table, Drawer, Button, Space, Form, Input, Tooltip, Select, Col, Row, DatePicker, AutoComplete, Radio, InputNumber, Modal, Statistic, Card, Switch, notification } from 'antd';
import {
    DesktopOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    ArrowUpOutlined
} from '@ant-design/icons';
import React from 'react';
import { RootState } from '../app/store';
import { ConnectedProps, connect } from 'react-redux';
import { remove, add as addRecord, edit } from '../features/courses/record'
import { add as addCourse } from '../features/courses/course'
import Column from 'antd/lib/table/Column';
import { Record, Course, Term, Status } from '../data/types'
import AcademicRecordForm from '../components/forms/AcademicRecordForm';
import { v4 as uuidv4 } from 'uuid'
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';


const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;

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
    visible: boolean,
    editing: boolean,
    recordID?: string
}

const mapState = (state: RootState) => ({
    courses: state.courses,
    data: Object.values(state.records)
});

const mapDispatch = {
    addCourse: addCourse,
    addRecord: addRecord,
    edit: edit,
    remove: remove,
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState

class AcademicRecordPage extends React.Component<Props, State> {
    state: State = {
        visible: false,
        editing: true,
    }

    form = React.createRef<FormInstance>();

    extractSubject = (record: Record) => this.props.courses[record.courseID].identifier.subject;
    extractCourseCode = (record: Record) => `${this.extractSubject(record)} ${this.extractCode(record)}`;
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
    renderActions = (_: any, record: Record) => (
        <Space>
            <Tooltip title="Edit this record">
                <Button
                    type='text'
                    shape='circle'
                    icon={<EditOutlined />}
                    onClick={_ => this.onEdit(record)} />
            </Tooltip>
            <Tooltip title="Delete this record">
                <Button
                    danger
                    type='text'
                    shape='circle'
                    icon={<DeleteOutlined />}
                    onClick={_ => this.onDelete(record.recordID)} />
            </Tooltip>
        </Space>
    );

    sortGrade = (a: Record, b: Record) => (a.grade ?? -1) - (b.grade ?? -1);
    sortStatus = (a: Record, b: Record) => a.status.localeCompare(b.status);
    sortCourseCode = (a: Record, b: Record) => this.extractCourseCode(a).localeCompare(this.extractCourseCode(b));
    sortSemester = (a: Record, b: Record) => {
        if (this.extractYear(a) === this.extractYear(b)) {
            let map = {
                [Term.FALL]: 0,
                [Term.WINTER]: 1,
                [Term.SPRING]: 2,
                [Term.SUMMER]: 3,
            }

            return map[this.extractTerm(a)] - map[this.extractTerm(b)];
        }

        return this.extractYear(a) - this.extractYear(b);
    }

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


    onFinish = (values: any) => {
        let course = Object.values(this.props.courses).find(v =>
            v.identifier.code === values?.identifier?.code &&
            v.identifier.subject === values?.identifier?.subject &&
            v.semester.term === values?.semester?.term &&
            v.semester.year === values?.semester?.year?.year());

        let record = this.props.data.find(r => r.courseID === course?.courseID);

        let courseID = course?.courseID ?? uuidv4();

        if (course === undefined) {
            this.props.addCourse({
                courseID: courseID,
                identifier: { ...values.identifier },
                instructor: values.instructor,
                name: values.name,
                semester: {
                    term: values.semester.term,
                    year: values.semester.year.year()
                }
            });
        }

        if (record !== undefined) {
            const key = `open${Date.now()}`;
            const btn = (
                <Button danger type="text" size="small" onClick={
                    () => {
                        this.props.edit({
                            recordID: record!.recordID,
                            courseID: record!.courseID,
                            grade: values.grade,
                            status: values.status
                        });
                        notification.close(key);
                    }
                }>
                    Overwrite
                </Button>
            );
            notification.warn({
                message: 'Course Record exists!',
                description:
                    `The academic record you just created for ${course?.identifier.subject} ${course?.identifier.code} ${course?.semester.term} ${course?.semester.year} exists. Would you like to overwrite the current record?`,
                btn,
                key,
                placement: 'bottomLeft'
            });
        } else if (this.state.recordID !== undefined && this.state.editing) {
            this.props.edit({
                recordID: this.state.recordID,
                courseID: courseID,
                grade: values.grade,
                status: values.status
            });
        } else {
            this.props.addRecord({
                recordID: uuidv4(),
                courseID: courseID,
                grade: values.grade,
                status: values.status
            });
        }

        this.setState({ visible: false, editing: false, recordID: undefined })
    }

    onEdit = (record: Record) => {
        this.form.current?.setFieldsValue({
            name: this.props.courses[record.courseID].name,
            instructor: this.props.courses[record.courseID].instructor,
            identifier: this.props.courses[record.courseID].identifier,
            semester: {
                term: this.props.courses[record.courseID].semester.term,
                year: moment(`${this.props.courses[record.courseID].semester.year}`),
            },
            status: record.status,
            grade: record.grade
        });
        this.setState({ recordID: record.recordID, editing: true, visible: true });
    }

    onAdd = () => {
        this.form.current?.resetFields();
        this.setState({ visible: true })
    }

    onDelete = (recordID: string) => {
        this.props.remove(recordID);
    }

    render() {
        return (
            <PageHeader
                style={{ minWidth: 896, width: "100%" }}
                backIcon={false}
                title="Your Academic Record">
                <Content style={{ padding: 24 }}>
                    <Card style={{ marginBottom: 25 }} title={"Academic Report"}>
                        <Card.Grid hoverable={false}>
                            <Statistic
                                title="GPA"
                                value={
                                    this.props.data.length > 0
                                        ? (this.props.data
                                            .filter(r => r.status === Status.TAKEN)
                                            .map(r => Number(this.extractCode(r).match(/\d+$/g)![0]![0]) * r.grade!)
                                            .reduce((p, c) => p + c)
                                            /
                                            this.props.data
                                                .filter(r => r.status === Status.TAKEN)
                                                .map(r => Number(this.extractCode(r).match(/\d+$/g)![0]![0]))
                                                .reduce((p, c) => p + c) / 3)
                                        : "N/A"
                                }
                                precision={2}
                                suffix="/ 4"
                            />
                        </Card.Grid>
                        <Card.Grid hoverable={false}>
                            <Statistic
                                title="Courses In Progress"
                                value={this.props.data.filter(r => r.status === Status.IN_PROGRESS).length}
                            />
                        </Card.Grid>
                        <Card.Grid hoverable={false}>
                            <Statistic
                                title="Courses Completed"
                                value={this.props.data.filter(r => r.status !== Status.IN_PROGRESS).length}
                            />
                        </Card.Grid>
                        <Card.Grid hoverable={false}>
                            <Statistic
                                title="Average courses per semester"
                                value={
                                    this.props.data.length > 0
                                        ? (Object.values(this.props.data
                                            .reduce<{ [semester: string]: number }>(
                                                (p, r) => {
                                                    let semester = this.extractSemester(r)
                                                    if (!(semester in p))
                                                        return { ...p, [semester]: 1 }
                                                    return { ...p, [semester]: p[semester] + 1 }
                                                }, {}))
                                            .map((v, i, a) => v / a.length)
                                            .reduce((p, c) => p + c))
                                        : 0
                                }
                            />
                        </Card.Grid>
                        <Card.Grid hoverable={false}>
                            <Statistic
                                title="Lowest grade"
                                valueStyle={{ color: "#F00" }}
                                value={
                                    this.props.data
                                        .map(r => r.grade)
                                        .reduce(
                                            (p, c) => {
                                                if (p === undefined)
                                                    return c;
                                                if (c === undefined)
                                                    return p;
                                                return p < c ? p : c;
                                            }, undefined)
                                }
                            />
                        </Card.Grid>
                        <Card.Grid hoverable={false}>
                            <Statistic
                                title="Highest grade"
                                valueStyle={{ color: "#0F0" }}
                                value={
                                    this.props.data
                                        .map(r => r.grade)
                                        .reduce(
                                            (p, c) => {
                                                if (p === undefined)
                                                    return c;
                                                if (c === undefined)
                                                    return p;
                                                return p > c ? p : c;
                                            }, undefined)
                                }
                            />
                        </Card.Grid>
                    </Card>
                    <Table dataSource={this.props.data} pagination={false} rowKey="recordID">
                        <Column title="Code"
                            render={this.renderCode}
                            sorter={this.sortCourseCode}
                            {...this.filtering(this.extractSubject)} />
                        <Column
                            title="Name"
                            ellipsis
                            render={this.renderName} />
                        <Column
                            title="Instructor"
                            ellipsis
                            render={this.renderInstructor} />
                        <Column
                            title="Semester"
                            render={this.renderSemester}
                            sorter={this.sortSemester}
                            {...this.filtering(this.extractSemester)} />
                        <Column
                            title="Grade"
                            render={this.renderGrade}
                            sorter={this.sortGrade}
                            {...this.filtering(this.extractGrade)} />
                        <Column
                            title="Status"
                            render={this.renderStatus}
                            sorter={this.sortStatus}
                            {...this.filtering(this.extractStatus)} />
                        <Column
                            title={
                                <Button
                                    type="primary"
                                    onClick={this.onAdd}
                                    icon={<PlusOutlined />}>
                                    Add
                                </Button>
                            }
                            align="right"
                            render={this.renderActions} />
                    </Table>
                </Content>
                <Drawer
                    forceRender
                    onClose={() => this.setState({ visible: false })}
                    title="Create a new account"
                    width={467}
                    visible={this.state.visible}>
                    <AcademicRecordForm form={this.form} onFinish={this.onFinish} onCancel={() => this.setState({ recordID: undefined, editing: false, visible: false })} />
                </Drawer>
            </PageHeader>
        );
    }
}

export default connector(AcademicRecordPage);