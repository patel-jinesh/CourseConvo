import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Button, DatePicker, Form, Input, Select } from "antd";
import { FormInstance } from "antd/lib/form/hooks/useForm";
import { NamePath } from "antd/lib/form/interface";
import React, { RefObject } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../app/store";
import { Term } from "../../data/types";

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
    onValuesChange?: (changed: any, all: any) => void,
    onSearch: (values: any) => void;
    form?: RefObject<FormInstance>,
}

type ComponentState = {}

const mapState = (state: RootState) => ({
    courses: state.courses,
});

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState;

class CreateCourseForm extends React.Component<Props, State>{
    onValuesChange = (changed: any, all: any) => {
        this.props.onSearch({
                subject: all.subject,
                code: all.code,
                year: all.year?.year(),
                term: all.term
        });

        if (this.props.onValuesChange)
            this.props.onValuesChange(changed, all);
    }

    render() {
        return (
            <Form name="search" ref={this.props.form} fields={this.props.fields} onFieldsChange={this.props.onFieldsChange} onValuesChange={this.onValuesChange} layout='horizontal'>
                <Form.Item
                    noStyle
                    shouldUpdate={true}>
                    {({ getFieldValue }) =>
                        <Input.Group
                            style={{ display: 'flex' }}
                            compact>
                            <Form.Item
                                normalize={(v: string) => v !== "" ? v.toUpperCase().replace(/[ \d]/g, "") : undefined}
                                name='subject'
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
                                    { pattern: /^[0-9][A-Z]([A-Z]|[0-9])[0-9]$/g, message: "Not a valid code!" }
                                ]}
                                noStyle>
                                <AutoComplete
                                    style={{ flex: 0.2 }}
                                    size='large'
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
                            <Form.Item >
                                <Input.Group compact>
                                    <Form.Item
                                        name='term'
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
                                        name='year'
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