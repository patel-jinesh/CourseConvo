import { AutoComplete, Button, DatePicker, Form, Input, InputNumber, Radio, Select, Space } from "antd";
import { FormInstance } from "antd/lib/form/hooks/useForm";
import React, { RefObject } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../app/store";
import { Status, Term } from "../../data/types";

const { Option } = AutoComplete;

type ComponentProps = {
    form: RefObject<FormInstance>;
    onFinish: (values: any) => void,
    onCancel: () => void,
}

type ComponentState = {}

const mapState = (state: RootState) => ({
    courses: Object.values(state.courses),
});

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState;

class AcademicRecordForm extends React.Component<Props, State>{
    onValuesChange = (_: any, values: any) => {
        let identifier = values.identifier;
        let semester = values.semester;

        let course = this.props.courses.find(v =>
            v.identifier.code === identifier?.code &&
            v.identifier.subject === identifier?.subject &&
            v.semester.term === semester?.term &&
            v.semester.year === semester?.year?.year())

        if (course !== undefined && (values.name !== course.name || values.instructor !== course.instructor))
            this.props.form.current?.setFieldsValue({ name: course.name, instructor: course.instructor })
    }

    render() {
        return (
            <Form ref={this.props.form} onFinish={this.props.onFinish} layout="horizontal" labelCol={{ span: 8 }} labelAlign={"left"} onValuesChange={this.onValuesChange}>
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
                <Form.Item shouldUpdate={true} label=" " colon={false}>
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
                                    onClick={() => { resetFields(); this.props.onCancel(); }}>
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
