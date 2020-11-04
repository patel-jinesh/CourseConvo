import React, { useState } from "react";
import { Row, Col, AutoComplete, Input, Select, DatePicker, Form, Radio, InputNumber } from "antd";
import { courses } from "../../backend/database";
import { Record, Status, Term } from "../../data/types";
import { RootState } from "../../app/store";
import { connect, ConnectedProps } from "react-redux";
import { FormInstance } from "antd/lib/form/hooks/useForm";
import { RadioChangeEvent } from "antd/lib/radio";

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

type CourseCodeInputProps = {
    value?: { subject?: string, code?: string },
    onChange?: (value: { subject?: string, code?: string }) => void
}

const CourseCodeInput: React.FC<CourseCodeInputProps> = ({ value, onChange }) => {
    const triggerChange = (data: { subject?: string, code?: string }) => {
        if (onChange) onChange({ ...value, ...data });
    };

    return (
        <Input.Group compact>
            <AutoComplete
                style={{ width: '70%' }}
                placeholder="Subject"
                value={value?.subject}
                onChange={v => triggerChange({ subject: v.toUpperCase() })}
                filterOption={(i, o) => o?.value.indexOf(i.toUpperCase()) === 0}
                options={courses.map(c => c.identifier.subject).unique().map(v => ({ value: v }))}
            >
            </AutoComplete>
            <AutoComplete
                style={{ width: '30%' }}
                onChange={v => triggerChange({ code: v.toUpperCase() })}
                value={value?.code}
                filterOption={(i, o) => o?.value.indexOf(i.toUpperCase()) === 0}
                options={courses.filter(c => c.identifier.subject === value?.subject).map(c => ({ value: c.identifier.code }))}
                placeholder="Code"
            />
        </Input.Group>
    );
};

class AcademicRecordForm extends React.Component<Props, State>{
    render() {
        return (
            <Form layout="horizontal" labelCol={{ span: 8 }} labelAlign={"left"}>
                <Form.Item
                    name="identifer"
                    label="Course Code"
                    rules={[{ required: true, message: 'Please input the course!' }]}>
                    <CourseCodeInput />
                </Form.Item>
                <Form.Item name="semester" label="Semester" rules={[{ required: true, message: 'Please input the semester!' }]}>
                    <Input.Group compact>
                        <Form.Item
                            name={['semester', 'term']}
                            noStyle>
                            <Select style={{ width: "50%" }}>
                                <Option value={Term.FALL}>{Term.FALL}</Option>
                                <Option value={Term.WINTER}>{Term.WINTER}</Option>
                                <Option value={Term.SPRING}>{Term.SPRING}</Option>
                                <Option value={Term.SUMMER}>{Term.SUMMER}</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name={['semester', 'year']}
                            noStyle>
                            <DatePicker style={{ width: "50%" }} picker="year" />
                        </Form.Item>
                    </Input.Group>
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Status">
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
                                label="Grade Gender"
                                rules={[{ required: true }]}>
                                <InputNumber
                                    min={0}
                                    max={12}
                                />
                            </Form.Item>
                        ) : null;
                    }}
                </Form.Item>
            </Form>
        );
    }
}

export default connector(AcademicRecordForm);
