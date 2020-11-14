import { AutoComplete, Button, Form, Radio, Space, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../app/store';

type ComponentProps = {
    onFinish?: () => void,
    onCancel?: () => void,
    user: string
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => ({});

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type State = ComponentState;
type Props = ReduxProps & ComponentProps;

class ReportForm extends React.Component<Props, State> {
    state: State = {}

    render() {
        return (
            <Form layout="horizontal" labelCol={{ flex: '100px' }} labelAlign={"left"} onFinish={this.props.onFinish}>
                <Form.Item label="Reporting">
                    {this.props.user}
                </Form.Item>
                <Form.Item rules={[{ required: true, message: "Please specify type" }]} name="type" label="Report Type">
                    <Select mode="tags" options={[{ value: "Bot account" }, { value: "Foul language" }]}></Select>
                </Form.Item>
                <Form.Item rules={[{ required: true, message: "Please provide context" }]} name="context" label="Context">
                    <TextArea rows={4}></TextArea>
                </Form.Item>
                <Form.Item rules={[{required: true, message: "Please specify severity"}]} name="severity" label="Severity">
                    <Radio.Group
                        options={["Severe", "High", "Medium", "Low"]}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </Form.Item>
                <Form.Item label=" " colon={false}>
                    <Space direction='horizontal'>
                        <Button type='primary' htmlType='submit'>Submit</Button>
                        <Button type='default' onClick={this.props.onCancel}>Cancel</Button>
                    </Space>
                </Form.Item>
            </Form>
        );
    }
}

export default connector(ReportForm);