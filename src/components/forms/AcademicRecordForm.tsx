import React, { useState } from "react";
import { Row, Col, AutoComplete, Input, Select, DatePicker, Form, Radio, InputNumber, Button } from "antd";
import { courses } from "../../backend/database";
import { Record, Status, Term } from "../../data/types";
import { RootState } from "../../app/store";
import { connect, ConnectedProps } from "react-redux";
import { FormInstance } from "antd/lib/form/hooks/useForm";
import { RadioChangeEvent } from "antd/lib/radio";
import { format } from "path";

const { Option } = AutoComplete;

type ComponentProps = {}
type ComponentState = {}

const mapState = (state: RootState) => ({
    courses: state.courses,
});

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState;

class AcademicRecordForm extends React.Component<Props, State>{
    form = React.createRef<FormInstance>();

    validateCourseCode = (value: any) => {
        if (value?.subject === undefined || value?.code === undefined)
            return false;
        if (!/[A-Z]+/g.test(value.subject) || !/[0-9A-Z]{4}/g.test(value.code))
            return false;

        return true;
    }

    validateSemester = (fields: any) => {
        if (fields?.semester?.term === undefined || fields?.semester?.year === undefined)
            return false;

        return true;
    }

    validateStatus = (fields: any) => {
        if (fields?.status === undefined)
            return false;

        return true;
    }

    validateGrade = (fields: any) => {
        if (fields?.status !== Status.TAKEN)
            return true;

        return fields.grade !== undefined;
    }

    onFinish = (values: any) => {

    }

    render() {
        return (
            <Form onFinish={this.onFinish} layout="horizontal" ref={this.form} labelCol={{ span: 8 }} labelAlign={"left"}>
                <Form.Item
                    label="Course Code"
                    shouldUpdate={true}
                    required>
                    {
                        ({ getFieldValue }) => {
                            return (
                                <>
                                    <Input.Group compact>
                                        <Form.Item
                                            name={['identifier', 'subject']}
                                            rules={[{ required: true, message: 'Please input the subject!' }]}
                                            noStyle>
                                            <AutoComplete
                                                style={{ width: '70%' }}
                                                placeholder="Subject"
                                                filterOption={(i, o) => o?.value.indexOf(i.toUpperCase()) === 0}
                                                options={courses.map(c => c.identifier.subject).unique().map(v => ({ value: v }))}
                                            >
                                            </AutoComplete>
                                        </Form.Item>
                                        <Form.Item
                                            name={['identifier', 'code']}
                                            dependencies={['identifier', 'subject']}
                                            rules={[{ required: true, message: 'Please input the code!' }]}
                                            noStyle>
                                            <AutoComplete
                                                style={{ width: '30%' }}
                                                filterOption={(i, o) => o?.value.indexOf(i.toUpperCase()) === 0}
                                                options={courses.filter(c => c.identifier.subject === getFieldValue(['identifier', 'subject'])).map(c => c.identifier.code).unique().map(code => ({ value: code }))}
                                                placeholder="Code"
                                            />
                                        </Form.Item>
                                    </Input.Group>
                                </>
                            )
                        }
                    }
                </Form.Item>
                <Form.Item name="semester" label="Semester" required>
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
                    shouldUpdate={
                        (p, c) =>
                            p?.identifier?.code === c?.identifier?.code &&
                            p?.identifier?.subject === c?.identifier?.subject &&
                            p?.semester?.term === c?.semester?.term &&
                            p?.semester?.year === c?.semester?.year?.year() !== undefined
                    }>
                    {
                        ({ getFieldValue, setFieldsValue }) => {
                            let identifier = getFieldValue('identifier');
                            let semester = getFieldValue('semester');

                            let course = courses.find(v =>
                                v.identifier.code === identifier?.code &&
                                v.identifier.subject === identifier?.subject &&
                                v.semester.term === semester?.term &&
                                v.semester.year === semester?.year?.year())

                            if (course !== undefined && (getFieldValue(['name']) !== course.name || getFieldValue(['instructor']) !== course.instructor))
                                setFieldsValue({ name: course.name, instructor: course.instructor })

                            return (
                                <>
                                    <Form.Item
                                        name="name"
                                        label="Course Name"
                                        rules={[{ required: true }]}>
                                        <Input defaultValue={course?.name} disabled={course !== undefined}></Input>
                                    </Form.Item>
                                    <Form.Item
                                        name="instructor"
                                        label="Instructor"
                                        rules={[{ required: true }]}>
                                        <Input disabled={course !== undefined}></Input>
                                    </Form.Item>
                                </>
                            )
                        }
                    }
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true }]}>
                    <Radio.Group>
                        <Radio.Button value={Status.IN_PROGRESS}>{Status.IN_PROGRESS}</Radio.Button>
                        <Radio.Button value={Status.TRANSFERRED}>{Status.TRANSFERRED}</Radio.Button>
                        <Radio.Button value={Status.TAKEN}>{Status.TAKEN}</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    noStyle
                    shouldUpdate={(prev, curr) => prev.status !== curr.status}>
                    {({ getFieldValue }) => {
                        return getFieldValue('status') === Status.TAKEN ? (
                            <Form.Item
                                name="grade"
                                label="Grade"
                                rules={[{ required: true }]}>
                                <InputNumber
                                    min={0}
                                    max={12}
                                />
                            </Form.Item>
                        ) : null;
                    }}
                </Form.Item>
                <Form.Item shouldUpdate={true}>
                    {() => {
                        return <Button
                            type="primary"
                            htmlType="submit"
                            disabled={
                                this.form.current?.getFieldsError().map(v => v.errors.length !== 0).reduce((r, c) => (r || c), false)
                            }
                        >
                            Log in
                        </Button>
                    }}
                </Form.Item>
            </Form>
        );
    }
}

export default connector(AcademicRecordForm);
