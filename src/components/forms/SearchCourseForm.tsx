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
import {
    SearchOutlined,
} from '@ant-design/icons';
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
            <Form ref={this.props.form} fields={this.props.fields} onFieldsChange={this.props.onFieldsChange} layout='horizontal'>
                <Form.Item
                    noStyle
                    shouldUpdate={true}>
                    {({ getFieldValue }) =>
                        <Input.Group
                            style={{ display: 'flex' }}
                            compact>
                            <Form.Item
                                normalize={(v: string) => v.toUpperCase().replace(/[ \d]/g, "")}
                                name={['identifier', 'subject']}
                                rules={[
                                    { pattern: /^[A-Z]+$/g, message: 'Not a valid subject!' }]
                                }
                                noStyle>
                                <AutoComplete
                                    style={{ flex: 0.8 }}
                                    size='large'
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
                                    { pattern: /^[0-9][A-Z]([A-Z]|[0-9])[0-9]$/g, message: "Not a valid code!" }
                                ]}
                                noStyle>
                                <AutoComplete
                                    style={{ flex: 0.2 }}
                                    size='large'
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
                            <Form.Item >
                                <Input.Group compact>
                                    <Form.Item
                                        name={['semester', 'term']}
                                        rules={[{ required: true, message: 'Please input the Term!' }]}
                                        noStyle>
                                        <Select style={{ width: 110 }} size='large' placeholder="Term">
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
                                        <DatePicker size='large' picker="year" />
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>
                            <Form.Item>
                                <Button style={{ marginLeft: '5px' }} size='large' type='primary' icon={<SearchOutlined />} />
                            </Form.Item>
                        </Input.Group>
                    }
                </Form.Item>
            </Form>
        );
    }
}

export default connector(CreateCourseForm);