import { AutoComplete, Button, DatePicker, Form, Input, Select, Tooltip } from "antd";
import { FormInstance } from "antd/lib/form/hooks/useForm";
import { NamePath } from "antd/lib/form/interface";
import React, { RefObject } from "react";
import { connect, ConnectedProps } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { RootState } from "../../app/store";
import { FormType, Term } from "../../data/types";
import { add as addCourse } from '../../features/courses/course';
import { add as addInstance } from '../../features/courses/instance';
import moment from "moment";
import { addDateForm, addForms, addTermForm } from "../../utilities/formUtils";

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
    onFinish?: (values: any) => void,
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

class CreateCourseForm extends React.Component<Props, State> {
    form = this.props.form ?? React.createRef<FormInstance>();

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

        if (this.props.onFinish)
            this.props.onFinish({
                ...values,
                year: values.year.year()
            });
    }

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
        
        if (this.props.onValuesChange)
            this.props.onValuesChange(_, values);
    }

    render() {
        let initialValues = {
            ...(this.props.initialValues ?? {}),
            year: this.props.initialValues?.year !== undefined ? moment(`${this.props.initialValues.year}`) : undefined
        }

        return (
            <Form name='create' initialValues={initialValues} ref={this.form} fields={this.props.fields} onFieldsChange={this.props.onFieldsChange} onValuesChange={this.onValuesChange} onFinish={this.onFinish} layout="horizontal" labelCol={{ span: 8 }} labelAlign={"left"}>
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
                        {addTermForm("50", "middle")}
                        {addDateForm("50", "middle")}
                    </Input.Group>
                </Form.Item>
                {addForms(Object.values(this.props.courses), Object.values(this.props.instances), [FormType.COURSE, FormType.INSTRUCTOR])}
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