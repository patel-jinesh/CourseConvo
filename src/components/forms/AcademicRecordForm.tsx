import { AutoComplete, Button, DatePicker, Form, Input, InputNumber, Radio, Select, Space } from "antd";
import { FormInstance } from "antd/lib/form/hooks/useForm";
import { NamePath } from "antd/lib/form/interface";
import moment from "moment";
import React, { RefObject } from "react";
import { connect, ConnectedProps } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { RootState } from "../../app/store";
import { USERID } from "../../backend/database";
import { FormType, Status, Term } from "../../data/types";
import { add as addCourse } from '../../features/courses/course';
import { add as addInstance } from '../../features/courses/instance';
import { add as addRecord, edit as editRecord } from '../../features/courses/record';
import { addForms } from "../../utilities/formUtils";

const { Option } = AutoComplete;

type ComponentProps = {
    recordID?: string;
    form?: RefObject<FormInstance>;
    onFinish?: () => void;
    onCancel?: () => void;
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => ({
    courses: state.courses,
    records: Object.values(state.records).filter(record => record.userID === USERID),
    instances: state.instances,
    record: props.recordID !== undefined ? state.records[props.recordID] : undefined,
    course: props.recordID !== undefined ? state.courses[state.instances[state.records[props.recordID].instanceID].courseID] : undefined,
    instance: props.recordID !== undefined ? state.instances[state.records[props.recordID].instanceID] : undefined
});

const mapDispatch = {
    editRecord: editRecord,
    addRecord: addRecord,
    addCourse: addCourse,
    addInstance: addInstance
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState;

class AcademicRecordForm extends React.Component<Props, State>{
    form = React.createRef<FormInstance>();

    onValuesChange = (_: any, values: any) => {
        let course = Object.values(this.props.courses).find(course =>
            course.code === values.code &&
            course.subject === values.subject)
        
        let instance = Object.values(this.props.instances).find(instance =>
            instance.courseID === course?.courseID &&
            instance.term === values.term &&
            instance.year === values.year?.year())

        if (course !== undefined && values.name !== course.name)
            this.form.current?.setFieldsValue({ name: course.name });
        if (instance !== undefined && values.instructor !== instance.instructor)
            this.form.current?.setFieldsValue({ instructor: instance.instructor });
    }

    onFinish = (values: any) => {
        let code = values.code;
        let subject = values.subject;
        let term = values.term;
        let year = values.year.year();
        let name = values.name;
        let instructor = values.instructor;

        let course = Object.values(this.props.courses).find(v =>
            v.code === code &&
            v.subject === subject)
        
        let instance = Object.values(this.props.instances).find(v =>
            v.courseID === course?.courseID &&
            v.term === term &&
            v.year === year);
        
        let courseID = course?.courseID ?? uuidv4();
        let instanceID = instance?.instanceID ?? uuidv4();
        
        if (course === undefined) {
            this.props.addCourse({
                courseID: courseID,
                name: name,
                subject: subject,
                code: code
            });
        }

        if (instance === undefined) {
            this.props.addInstance({
                term: term,
                year: year,
                instructor: instructor,
                courseID: courseID,
                instanceID: instanceID
            });
        }
        
        if (this.props.recordID !== undefined) {
            this.props.editRecord({
                recordID: this.props.recordID,
                instanceID: instanceID,
                grade: values.grade,
                status: values.status,
                userID: USERID
            });
        } else {
            this.props.addRecord({
                recordID: uuidv4(),
                instanceID: instanceID,
                grade: values.grade,
                status: values.status,
                userID: USERID
            });
        }

        if (this.props.onFinish)
            this.props.onFinish();
    }

    validateCourse = (getFieldValue : (name: NamePath) => any) => {
        let code = getFieldValue('code');
        let subject = getFieldValue('subject');
        let term = getFieldValue('term');
        let year = getFieldValue('year')?.year();

        let record = this.props.records.find(record => {
            let instance = this.props.instances[record.instanceID];
            let course = this.props.courses[instance.courseID];

            let matchCode = code === course.code;
            let matchSubject = subject === course.subject;
            let matchTerm = term === instance.term;
            let matchYear = year === instance.year;

            return matchCode && matchSubject && matchTerm && matchYear;
        });

        if (record !== undefined && record.recordID !== this.props.recordID)
            return Promise.reject("You already have a record for this course!")

        return Promise.resolve();
    }

    render() {
        let initialValues = {
            ...this.props.course,
            ...this.props.instance,
            ...this.props.record,
            year: this.props.instance?.year === undefined ? undefined : moment(`${this.props.instance?.year}`)
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
                                name='subject'
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
                                        Object.values(this.props.courses)
                                            .map(course => course.subject)
                                            .unique()
                                            .map(subject => ({ value: subject }))
                                    }>
                                </AutoComplete>
                            </Form.Item>
                            <Form.Item
                                normalize={(v: string) => v.toUpperCase().replace(" ", "").substr(0, 4)}
                                name='code'
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
                                        Object.values(this.props.courses)
                                            .filter(course => course.subject === getFieldValue('subject'))
                                            .map(course => course.code)
                                            .unique()
                                            .map(code => ({ value: code }))
                                    }
                                    placeholder="Code"
                                />
                            </Form.Item>
                            </Input.Group>
                            <Input.Group compact style={{marginTop: 5}}>
                                <Form.Item
                                    name='term'
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
                                    name='year'
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
                {addForms(Object.values(this.props.courses), Object.values(this.props.instances), [FormType.COURSE, FormType.INSTRUCTOR])}
                <Form.Item
                    name='status'
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
                                    name='grade'
                                    label="Grade"
                                    rules={[{ required: true, message: "Please enter your grade!" }]}>
                                    <InputNumber min={0} max={12} />
                                </Form.Item>
                            )
                        }
                    }}
                </Form.Item>
                <Form.Item shouldUpdate={true} label=" " colon={false}>
                    {({ getFieldsError }) => {
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
