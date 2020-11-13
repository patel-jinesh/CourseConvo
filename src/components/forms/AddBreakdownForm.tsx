import { Slider, Comment, Tooltip, Rate, Descriptions, Button, List, Form, Select, Input, AutoComplete, Radio, Layout, Row, Col, Divider, DatePicker, Switch, Space } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../app/store';
import moment from 'moment';
import { add as addBreakdown, edit as editBreakdown } from '../../features/courses/breakdown';
import { add as addInstance } from '../../features/courses/instance';
import { USERID } from '../../backend/database';
import TextArea from 'antd/lib/input/TextArea';
import CreateCourseForm from './CreateCourseForm';
import { Assessments, FormType, Lecture, Term } from '../../data/types';
import { v4 as uuidv4 } from 'uuid';
import { addDateForm, addForms, addRadioGroup, addTermForm } from "../../utilities/formUtils";
import { FormInstance } from 'antd/lib/form';

const { Option } = Select;

type ComponentProps = {
    initialValues?: any
    onFinish?: () => void;
    onCancel?: () => void;
    courseID: string;
    breakdownID?: any;
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => ({
    courses: state.courses,
    instances: state.instances,
    breakdowns: state.breakdowns
});

const mapDispatch = {
    addBreakdown: addBreakdown,
    addInstance: addInstance,
    editBreakdown: editBreakdown
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type State = ComponentState;
type Props = ReduxProps & ComponentProps;

class AddBreakdownForm extends React.Component<Props, State> {
    state: State = {}

    form: React.RefObject<FormInstance> = React.createRef<FormInstance>();

    onValuesChange = (_: any, values: any) => {
        let course = Object.values(this.props.courses).find(course =>
            course.code === values.code &&
            course.subject === values.subject)

        let instance = Object.values(this.props.instances).find(instance =>
            instance.courseID === (this.props.courseID ?? course?.courseID) &&
            instance.term === values.term &&
            instance.year === values.year?.year())

        if (instance !== undefined && values.instructor !== instance.instructor)
            this.form.current?.setFieldsValue({ instructor: instance.instructor });
    }

    onFinish = (values: any) => {
        let instance = Object.values(this.props.instances).find(instance => instance.term === values.term && instance.year === values.year?.year())

        let instanceID = instance?.instanceID ?? uuidv4();

        if (instance === undefined)
            this.props.addInstance({
                instanceID: instanceID,
                instructor: values.instructor,
                term: values.term,
                year: values.year?.year(),
                courseID: this.props.courseID
            });

        if (this.props.breakdownID)
            this.props.editBreakdown({
                ...this.props.breakdowns[this.props.breakdownID],
                breakdownID: this.props.breakdownID,
                userID: USERID,
            });
        else
            this.props.addBreakdown({
                instanceID: instanceID,
                breakdownID: this.props.breakdownID,
                userID: USERID,
                marks: [{
                    type: values.assessment,
                    weight: values.weight,
                    count: values.count
                }],
                isAnonymous: false
            });


        if (this.props.onFinish) 
            this.props.onFinish();
    }

    render() {
        return (
            <Form ref={this.form} name="review" layout="horizontal" labelCol={{ flex: '100px' }} labelAlign={"left"} onFinish={this.onFinish}>
                <Form.Item label="Semester" required>
                    <Input.Group compact>
                        {addTermForm("50", "middle")}
                        {addDateForm("50", "middle")}
                    </Input.Group>
                </Form.Item>
                {addForms(Object.values(this.props.courses), Object.values(this.props.instances), [FormType.INSTRUCTOR])}
                {addRadioGroup(Lecture)}
                <Form.List name="assessments">
                    {(fields, { add, remove }) => (
                    <>
                        {fields.map(field => (
                        <Space key={field.key} align="baseline">
                            <Form.Item
                            noStyle
                            shouldUpdate={(prevValues, curValues) =>
                                prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                            }
                            >
                            {() => (
                                <Form.Item
                                {...field}
                                label="Type"
                                name={[field.name, 'assessment']}
                                fieldKey={[field.fieldKey, 'assessment']}
                                rules={[{ required: true, message: 'Missing assessment' }]}
                                >
                                <Select style={{ width: 130 }} placeholder="Assessment">
                                    {Object.keys(Assessments)
                                    .map (item => (
                                    <Option key={item} value={item}>
                                        {Assessments[item]}
                                    </Option>
                                    ))}
                                </Select>
                                </Form.Item>
                            )}
                            </Form.Item>
                            <Form name = "count" layout="vertical">
                            <Form.Item
                            {...field}
                            label="Count"
                            name="count"
                            fieldKey={[field.fieldKey, 'count']}
                            rules={[{ required: true, message: 'Missing count' }]}
                            >
                                <Input />
                            </Form.Item>
                            </Form>
                            <Form name = "count" layout="vertical">
                            <Form.Item
                            {...field}
                            label="Weight"
                            name={[field.name, 'weight']}
                            fieldKey={[field.fieldKey, 'weight']}
                            rules={[{ required: true, message: 'Missing weight' }]}
                            >
                                <Input />
                            </Form.Item>
                            </Form>

                            <MinusCircleOutlined onClick={() => remove(field.name)} />
                        </Space>
                        ))}

                        <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add Assessment
                        </Button>
                        </Form.Item>
                    </>
                    )}
                </Form.List>
                <Form.Item shouldUpdate={true} label=" " colon={false}>
                    {({ getFieldsError }) => {
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
                                    onClick={() => {
                                        if (this.props.onCancel)
                                            this.props.onCancel();
                                    }}>
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

export default connector(AddBreakdownForm);