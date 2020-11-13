import { AutoComplete, Button, Form, Radio } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../app/store';

type ComponentProps = {}

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
            <Form layout="horizontal" labelCol={{ flex: '100px' }} labelAlign={"left"}>
                <Form.Item required name="type" label="Report Type">
                    <AutoComplete options={[{ value: "Bot account" }, { value: "Foul language" }]}></AutoComplete>
                </Form.Item>
                <Form.Item required name="context" label="Context">
                    <TextArea rows={4}></TextArea>
                </Form.Item>
                <Form.Item required name="severity" label="Severity">
                    <Radio.Group
                        options={["Severe", "High", "Medium", "Low"]}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </Form.Item>
                <Form.Item label=" " colon={false}>
                    <Button type='primary' htmlType='submit'>Submit</Button>
                </Form.Item>
            </Form>
        );
    }
}

export default connector(ReportForm);