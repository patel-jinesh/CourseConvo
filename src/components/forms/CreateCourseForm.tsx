import React, { useState, RefObject } from "react";
import { Row, Col, AutoComplete, Input, Select, DatePicker, Form, Radio, InputNumber, Button, Space, Tooltip } from "antd";
import { Record, Status, Term } from "../../data/types";
import { RootState } from "../../app/store";
import { connect, ConnectedProps } from "react-redux";
import { FormInstance } from "antd/lib/form/hooks/useForm";
import { RadioChangeEvent } from "antd/lib/radio";
import { format } from "path";
import { add } from '../../features/courses/course';
import { courses } from "../../backend/database";
import { NamePath } from "antd/lib/form/interface";

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
    form: RefObject<FormInstance>,
}

type ComponentState = {}

const mapState = (state: RootState) => ({
    courses: Object.values(state.courses),
});

const mapDispatch = {
    add: add
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState;

class CreateCourseForm extends React.Component<Props, State>{
    onFinish = (values: any) => {

    }

    render() {
        return (
            <Form ref={this.props.form} fields={this.props.fields} onFieldsChange={this.props.onFieldsChange} onFinish={this.onFinish} layout="horizontal" labelCol={{ span: 8 }} labelAlign={"left"}>
                <Form.Item
                    label="Course Code"
                    shouldUpdate={true}
                    required>
                    {({ getFieldValue }) =>
                        <Input.Group compact>
                            <Form.Item
                                normalize={(v: string) => v.toUpperCase().replace(" ", "")}
                                name={['identifier', 'subject']}
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
                                    { pattern: /^[0-9][A-Z]([A-Z]|[0-9])[0-9]$/g, message: "Not a valid code!" }
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
                    }
                </Form.Item>
                <Form.Item label="Semester" required>
                    <Input.Group compact>
                        <Form.Item
                            name={['semester', 'term']}
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
                            name={['semester', 'year']}
                            rules={[{ required: true, message: 'Please input the Year!' }]}
                            noStyle>
                            <DatePicker style={{ width: "50%" }} picker="year" />
                        </Form.Item>
                    </Input.Group>
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
                <Form.Item shouldUpdate={true} label=" " colon={false}>
                    {({ getFieldsError, getFieldValue }) => {
                        let courseExists = courses.find(course => {
                            return course.identifier.subject === getFieldValue(["identifier", "subject"]) &&
                                course.identifier.code === getFieldValue(["identifier", "code"]) &&
                                course.semester.term === getFieldValue(["semester", "term"]) &&
                                course.semester.year === getFieldValue(["semester", "year"]).year()
                        }) !== undefined;

                        let button = (
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={
                                    courseExists && getFieldsError().map(v => v.errors.length !== 0).reduce((r, c) => (r || c), false)
                                }>
                                Submit
                            </Button>
                        );

                        if (courseExists)
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