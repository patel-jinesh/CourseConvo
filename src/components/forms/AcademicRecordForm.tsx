import { AutoComplete, Button, DatePicker, Form, Input, InputNumber, Radio, Select, Space } from "antd";
import { FormInstance } from "antd/lib/form/hooks/useForm";
import { NamePath } from "antd/lib/form/interface";
import moment from "moment";
import React, { RefObject } from "react";
import { connect, ConnectedProps } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { RootState } from "../../app/store";
import { USERID } from "../../backend/database";
import { Status, Term } from "../../data/types";
import { add as addCourse } from '../../features/courses/course';
import { add as addRecord, edit } from '../../features/courses/record';

const { Option } = AutoComplete;

type ComponentProps = {
    recordID?: string;
    form?: RefObject<FormInstance>;
    onFinish?: () => void;
    onCancel?: () => void;
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => ({
    courses: Object.values(state.courses),
    records: Object.values(state.records).filter(record => record.userID === USERID),
    record: props.recordID !== undefined ? state.records[props.recordID] : undefined,
    course: props.recordID !== undefined ? state.courses[state.records[props.recordID].courseID] : undefined
});

const mapDispatch = {
    edit: edit,
    addRecord: addRecord,
    addCourse: addCourse
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState;

class AcademicRecordForm extends React.Component<Props, State>{
    form = React.createRef<FormInstance>();

    onValuesChange = (_: any, values: any) => {
        let identifier = values.identifier;
        let semester = values.semester;

        let course = this.props.courses.find(v =>
            v.identifier.code === identifier?.code &&
            v.identifier.subject === identifier?.subject &&
            v.semester.term === semester?.term &&
            v.semester.year === semester?.year?.year())

        if (course !== undefined && (values.name !== course.name || values.instructor !== course.instructor))
            this.form.current?.setFieldsValue({ name: course.name, instructor: course.instructor })
    }


    onFinish = (values: any) => {
        let code = values.identifier.code;
        let subject = values.identifier.subject;
        let term = values.semester.term;
        let year = values.semester.year.year();
        let name = values.name;
        let instructor = values.instructor;

        let course = Object.values(this.props.courses).find(v =>
            v.identifier.code === code &&
            v.identifier.subject === subject &&
            v.semester.term === term &&
            v.semester.year === year);
        
        let courseID = this.props.record?.courseID ?? course?.courseID ?? uuidv4();

        if (this.props.record ?? course === undefined) {
            this.props.addCourse({
                courseID: courseID,
                name: name,
                instructor: instructor,
                identifier: {
                    subject: subject,
                    code: code
                },
                semester: {
                    term: term,
                    year: year
                }
            })
        }
        
        if (this.props.recordID !== undefined) {
            this.props.edit({
                recordID: this.props.recordID,
                courseID: courseID,
                grade: values.grade,
                status: values.status,
                userID: USERID
            });
        } else {
            this.props.addRecord({
                recordID: uuidv4(),
                courseID: courseID,
                grade: values.grade,
                status: values.status,
                userID: USERID
            });
        }

        if (this.props.onFinish)
            this.props.onFinish();
    }

    validateCourse = (getFieldValue : (name: NamePath) => any) => {
        let code = getFieldValue(['identifier', 'code']);
        let subject = getFieldValue(['identifier', 'subject']);
        let term = getFieldValue(['semester', 'term']);
        let year = getFieldValue(['semester', 'year'])?.year();

        let course = Object.values(this.props.courses).find(v =>
            v.identifier.code === code &&
            v.identifier.subject === subject &&
            v.semester.term === term &&
            v.semester.year === year);

        let record = this.props.records.find(record =>
            record.courseID === course?.courseID
        );

        if (record !== undefined && record.recordID !== this.props.recordID)
            return Promise.reject("You already have a record for this course!")

        return Promise.resolve();
    }

    render() {
        let initialValues = {
            name: this.props.course?.name,
            instructor: this.props.course?.instructor,
            identifier: {
                subject: this.props.course?.identifier.subject,
                code: this.props.course?.identifier.code
            },
            semester: {
                term: this.props.course?.semester.term,
                year: this.props.course?.semester.year === undefined ? undefined : moment(`${this.props.course?.semester.year}`)
            },
            status: this.props.record?.status,
            grade: this.props.record?.grade
        }

        return (
            <Form ref={this.form} initialValues={initialValues} onFinish={this.onFinish} layout="horizontal" labelCol={{ span: 8 }} labelAlign={"left"} onValuesChange={this.onValuesChange}>
                <Form.Item
                    label="Course"
                    shouldUpdate={true}
                    required>
                    {({ getFieldValue }) =>
                        <>
                        <Input.Group compact>
                            <Form.Item
                                normalize={(v: string) => v.toUpperCase().replace(" ", "")}
                                name={['identifier', 'subject']}
                                rules={[
                                    { required: true, message: 'Please input the subject!' },
                                    { pattern: /^[A-Z]+$/g, message: 'Not a valid subject!' },
                                    ({ getFieldValue }) => ({
                                        validator: () => this.validateCourse(getFieldValue),
                                    }),
                                ]}
                                noStyle>
                                <AutoComplete
                                    style={{ width: '70%' }}
                                    placeholder="Subject"
                                    filterOption={(i, o) => o?.value.indexOf(i.toUpperCase()) === 0}
                                    options={
                                        this.props.courses
                                            .map(c => c.identifier.subject)
                                            .unique()
                                            .map(v => ({ value: v }))
                                    }>
                                </AutoComplete>
                            </Form.Item>
                            <Form.Item
                                normalize={(v: string) => v.toUpperCase().replace(" ", "").substr(0, 4)}
                                name={['identifier', 'code']}
                                rules={[
                                    { required: true, message: 'Please input the code!' },
                                    { pattern: /^[0-9][A-Z]([A-Z]|[0-9])[0-9]$/g, message: "Not a valid code!" },
                                    ({ getFieldValue }) => ({
                                        validator: () => this.validateCourse(getFieldValue),
                                    }),
                                ]}
                                noStyle>
                                <AutoComplete
                                    style={{ width: '30%' }}
                                    filterOption={(i, o) => o?.value.indexOf(i.toUpperCase()) === 0}
                                    options={
                                        this.props.courses
                                            .filter(c => c.identifier.subject === getFieldValue(['identifier', 'subject']))
                                            .map(c => c.identifier.code)
                                            .unique()
                                            .map(code => ({ value: code }))
                                    }
                                    placeholder="Code"
                                />
                            </Form.Item>
                            </Input.Group>
                            <Input.Group compact style={{marginTop: 5}}>
                                <Form.Item
                                    name={['semester', 'term']}
                                    rules={[
                                        { required: true, message: 'Please input the Term!' },
                                        ({ getFieldValue }) => ({
                                            validator: () => this.validateCourse(getFieldValue),
                                        })
                                    ]}
                                    noStyle>
                                    <Select style={{ width: "50%" }} placeholder="Term">
                                        <Option value={Term.FALL}>{Term.FALL}</Option>
                                        <Option value={Term.WINTER}>{Term.WINTER}</Option>
                                        <Option value={Term.SPRING}>{Term.SPRING}</Option>
                                        <Option value={Term.SUMMER}>{Term.SUMMER}</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name={['semester', 'year']}
                                    rules={[
                                        { required: true, message: 'Please input the Year!' },
                                        ({ getFieldValue }) => ({
                                            validator: () => this.validateCourse(getFieldValue),
                                        }),
                                    ]}
                                    noStyle>
                                    <DatePicker style={{ width: "50%" }} picker="year" />
                                </Form.Item>
                            </Input.Group>
                            </>
                    }
                </Form.Item>
                <Form.Item
                    noStyle
                    dependencies={[['identifier', 'subject'], ['identifier', 'code'], ['semester', 'term'], ['semester', 'year']]}>
                    {
                        ({ getFieldValue }) => {
                            let identifier = getFieldValue('identifier');
                            let semester = getFieldValue('semester');

                            let course = this.props.courses.find(v =>
                                v.identifier.code === identifier?.code &&
                                v.identifier.subject === identifier?.subject &&
                                v.semester.term === semester?.term &&
                                v.semester.year === semester?.year?.year())

                            return (
                                <>
                                    <Form.Item
                                        name="name"
                                        label="Course Name"
                                        rules={[{ required: true, message: 'Please input the course name!' }]}
                                        required>
                                        <Input disabled={course !== undefined}></Input>
                                    </Form.Item>
                                    <Form.Item
                                        name="instructor"
                                        label="Instructor"
                                        rules={[{ required: true, message: "Please input the instructor name!" }]}
                                        required>
                                        <AutoComplete
                                            disabled={course !== undefined}
                                            filterOption={(i, o) => o?.value.toUpperCase().indexOf(i.toUpperCase()) === 0}
                                            options={
                                                this.props.courses
                                                    .map(course => course.instructor)
                                                    .unique()
                                                    .map(instructor => ({ value: instructor }))
                                            }
                                        />
                                    </Form.Item>
                                </>
                            )
                        }
                    }
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: "Please select one of the options!" }]}>
                    <Radio.Group>
                        <Radio.Button value={Status.IN_PROGRESS}>{Status.IN_PROGRESS}</Radio.Button>
                        <Radio.Button value={Status.TRANSFERRED}>{Status.TRANSFERRED}</Radio.Button>
                        <Radio.Button value={Status.TAKEN}>{Status.TAKEN}</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    noStyle
                    dependencies={['status']}>
                    {({ getFieldValue }) => {
                        if (getFieldValue('status') === Status.TAKEN) {
                            return (
                                <Form.Item
                                    name="grade"
                                    label="Grade"
                                    rules={[{ required: true, message: "Please enter your grade!" }]}>
                                    <InputNumber
                                        min={0}
                                        max={12}
                                    />
                                </Form.Item>
                            )
                        }
                    }}
                </Form.Item>
                <Form.Item shouldUpdate={true} label=" " colon={false}
                    rules={[
                        
                ]}>
                    {({ getFieldsError, resetFields }) => {
                        return (
                            <Space>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={
                                        getFieldsError().map(v => v.errors.length !== 0).reduce((r, c) => (r || c), false)
                                    }>
                                    Submit
                                </Button>
                                <Button
                                    htmlType="button"
                                    onClick={() => {
                                        if (this.props.onCancel)
                                            this.props.onCancel();
                                    }}>
                                    Cancel
                                </Button>
                            </Space>
                        )
                    }}
                </Form.Item>
            </Form>
        );
    }
}

export default connector(AcademicRecordForm);
