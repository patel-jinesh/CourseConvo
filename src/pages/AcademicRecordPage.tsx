import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Drawer, Layout, PageHeader, Space, Statistic, Table, Tooltip } from 'antd';
import Column from 'antd/lib/table/Column';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../app/store';
import { USERID } from '../backend/database';
import AcademicRecordForm from '../components/forms/AcademicRecordForm';
import { Record, Status, Term } from '../data/types';
import { add as addCourse } from '../features/courses/course';
import { add as addRecord, edit, remove } from '../features/courses/record';

const { Content } = Layout;

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
    recordID?: string
}

const mapState = (state: RootState) => ({
    courses: state.courses,
    records: Object.values(state.records).filter(record => record.userID === USERID)
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
    }

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
            filters: this.props.records.map(record =>
                filter(record),
            ).unique().map(value => ({
                text: value,
                value: value
            })),
            onFilter: (value: any, record: Record) =>
                filter(record) === value
        }
    }

    onEdit = (record: Record) => {
        this.setState({ recordID: record.recordID, visible: true });
    }

    onAdd = () => {
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
                                    this.props.records.filter(r => r.status === Status.TAKEN).length > 0
                                        ? (this.props.records
                                            .filter(r => r.status === Status.TAKEN)
                                            .map(r => Number(this.extractCode(r).match(/\d+$/g)![0]![0]) * r.grade!)
                                            .reduce((p, c) => p + c)
                                            /
                                            this.props.records
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
                                value={this.props.records.filter(r => r.status === Status.IN_PROGRESS).length}
                            />
                        </Card.Grid>
                        <Card.Grid hoverable={false}>
                            <Statistic
                                title="Courses Completed"
                                value={this.props.records.filter(r => r.status !== Status.IN_PROGRESS).length}
                            />
                        </Card.Grid>
                        <Card.Grid hoverable={false}>
                            <Statistic
                                title="Average courses per semester"
                                value={
                                    this.props.records.length > 0
                                        ? (Object.values(this.props.records
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
                                    this.props.records
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
                                    this.props.records
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
                    <Table dataSource={this.props.records} pagination={false} rowKey="recordID">
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
                    destroyOnClose
                    onClose={() => this.setState({ visible: false, recordID: undefined })}
                    title="Create a new account"
                    width={467}
                    visible={this.state.visible}>
                    <AcademicRecordForm
                        key={this.state.recordID ?? "add"}
                        recordID={this.state.recordID}
                        onFinish={() => this.setState({visible: false, recordID: undefined})}
                        onCancel={() => this.setState({ visible: false, recordID: undefined })} />
                </Drawer>
            </PageHeader>
        );
    }
}

export default connector(AcademicRecordPage);