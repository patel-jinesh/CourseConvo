import { AutoComplete, Button, DatePicker, Form, Input, Select, Tooltip } from "antd";
import { FormInstance } from "antd/lib/form/hooks/useForm";
import { NamePath } from "antd/lib/form/interface";
import React, { RefObject } from "react";
import { connect, ConnectedProps } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { RootState } from "../../app/store";
import { courses } from "../../backend/database";
import { Term } from "../../data/types";
import { add as addCourse } from '../../features/courses/course';
import { add as addInstance } from '../../features/courses/instance';

const { Option } = AutoComplete;

interface FieldData {
    name: NamePath;
    value?: any;
    touched?: boolean;
    validating?: boolean;
    errors?: string[];
}

type ComponentProps = {
    fields?: FieldData[],
    onFieldsChange?: (changed: FieldData[], all: FieldData[]) => void,
    onValuesChange?: (changed: FieldData[], all: FieldData[]) => void,
    initialValues?: any,
    form?: RefObject<FormInstance>,
}

type ComponentState = {}

const mapState = (state: RootState) => ({
    courses: state.courses,
    instances: state.instances,
});

const mapDispatch = {
    addCourse: addCourse,
    addInstance: addInstance,
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState;

class CreateCourseForm extends React.Component<Props, State>{
    onFinish = (values: any) => {
        let courseID = uuidv4();
        let instanceID = uuidv4();

        this.props.addCourse({
            courseID: courseID,
            name: values.name,
            code: values.code,
            subject: values.subject
        });
        
        this.props.addInstance({
            instanceID: instanceID,
            courseID: courseID,
            instructor: values.instructor,
            term: values.term,
            year: values.year.year()
        });
    }

    render() {
        console.log(this.props.initialValues);

        return (
            <Form name='create' initialValues={this.props.initialValues} ref={this.props.form} fields={this.props.fields} onFieldsChange={this.props.onFieldsChange} onValuesChange={this.props.onValuesChange} onFinish={this.onFinish} layout="horizontal" labelCol={{ span: 8 }} labelAlign={"left"}>
                <Form.Item
                    label="Course Code"
                    shouldUpdate={true}
                    required>
                    {({ getFieldValue }) =>
                        <Input.Group compact>
                            <Form.Item
                                normalize={(v: string) => v !== "" ? v.toUpperCase().replace(" ", "") : undefined}
                                name='subject'
                                rules={[
                                    { required: true, message: 'Please input the subject!' },
                                    { pattern: /^[A-Z]+$/g, message: 'Not a valid subject!' }]
                                }
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
                                normalize={(v: string) => v !== "" ? v.toUpperCase().replace(" ", "").substr(0, 4) : undefined}
                                name='code'
                                rules={[
                                    { required: true, message: 'Please input the code!' },
                                    { pattern: /^[0-9][A-Z]([A-Z]|[0-9])[0-9]$/g, message: "Not a valid code!" }
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
                    }
                </Form.Item>
                <Form.Item label="Semester" required>
                    <Input.Group compact>
                        <Form.Item
                            name='term'
                            rules={[{ required: true, message: 'Please input the Term!' }]}
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
                            rules={[{ required: true, message: 'Please input the Year!' }]}
                            noStyle>
                            <DatePicker style={{ width: "50%" }} picker="year" />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>
                <Form.Item
                    noStyle
                    dependencies={[['subject'], ['code'], ['term'], ['year']]}>
                    {
                        ({ getFieldValue }) => {
                            let subject = getFieldValue('subject');
                            let code = getFieldValue('code');
                            let term = getFieldValue('term');
                            let year = getFieldValue('year')?.year();

                            let course = Object.values(this.props.courses).find(course =>
                                course.code === code &&
                                course.subject === subject);

                            let instance = Object.values(this.props.instances).find(instance =>
                                instance.courseID === course?.courseID &&
                                instance.term === term &&
                                instance.year === year);

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
                                            disabled={instance !== undefined}
                                            filterOption={(i, o) => o?.value.toUpperCase().indexOf(i.toUpperCase()) === 0}
                                            options={
                                                Object.values(this.props.instances)
                                                    .map(instance => instance.instructor)
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
                <Form.Item shouldUpdate={true} label=" " colon={false}>
                    {({ getFieldsError, getFieldValue }) => {
                        let course = Object.values(this.props.courses).find(course =>
                            course.subject === getFieldValue('subject') &&
                            course.code === getFieldValue('code'));
                        
                        let instance = Object.values(this.props.instances).find(instance =>
                            instance.courseID === course?.courseID &&
                            instance.year === getFieldValue('year')?.year() &&
                            instance.term === getFieldValue('term'));

                        let button = (
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={
                                    (instance !== undefined) && getFieldsError().map(v => v.errors.length !== 0).reduce((r, c) => (r || c), false)
                                }>
                                Submit
                            </Button>
                        );

                        if (instance !== undefined)
                            return (
                                <Tooltip title="This course exists">
                                    {button}
                                </Tooltip>
                            )

                        return button;
                    }}
                </Form.Item>
            </Form>
        );
    }
}

export default connector(CreateCourseForm);