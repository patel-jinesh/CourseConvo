import { Slider, Comment, Tooltip, Rate, Descriptions, Button, List, Form, Select, Input, AutoComplete, Radio, Layout, Row, Col, Divider, DatePicker, Switch, Space, InputNumber } from 'antd';
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
        
        console.log(values);

        if (this.props.breakdownID)
            this.props.editBreakdown({
                ...this.props.breakdowns[this.props.breakdownID],
                breakdownID: this.props.breakdownID,
                userID: USERID,
            });
        else
            this.props.addBreakdown({
                instanceID: instanceID,
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
            <Form ref={this.form} name="review" layout="horizontal" labelCol={{ flex: '130px' }} labelAlign={"left"} onFinish={this.onFinish}>
                <Form.Item label="Semester" required>
                    <Input.Group compact>
                        {addTermForm("50", "middle")}
                        {addDateForm("50", "middle")}
                    </Input.Group>
                </Form.Item>
                {addForms(Object.values(this.props.courses), Object.values(this.props.instances), [FormType.INSTRUCTOR])}
                {addRadioGroup("lecture", 'Lecture Type', Lecture)}
                <Form.List name="assessments">
                    {(fields, { add, remove }) => (
                        <>
                            <Form.Item label=" " colon={false}>
                            {fields.map(field => (
                                <Input.Group compact key={field.key}>
                                    <Form.Item
                                        {...field}
                                        label="Type"
                                        key="Type"
                                        style={{ width: '40%' }}
                                        name={[field.name, 'type']}
                                        fieldKey={[field.fieldKey, 'type']}
                                        rules={[{ required: true, message: 'Missing assessment' }]}
                                    >
                                        <Select placeholder="Assessment" style={{ width: '100%' }}
                                            options={Object.values(Assessments)
                                                .map(assessment => ({ value: assessment }))}>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        {...field}
                                        key="Weight"
                                        label="Weight"
                                        style={{ width: '30%' }}
                                        name={[field.name, 'weight']}
                                        fieldKey={[field.fieldKey, 'weight']}
                                        tooltip="The total weight for this type of assessment."
                                        rules={[{ required: true, message: 'Missing weight' }]}>
                                        <InputNumber style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item
                                        {...field}
                                        key="Count"
                                        label="Count"
                                        style={{ width: '20%' }}
                                        name={[field.name, 'count']}
                                        fieldKey={[field.fieldKey, 'count']}
                                        rules={[{ required: true, message: 'Missing count' }]}
                                    >
                                        <InputNumber style={{ width: '100%' }} />
                                    </Form.Item>
                                    <Form.Item label=" " colon={false} style={{ marginLeft: 15 }}>
                                        <MinusCircleOutlined onClick={() => remove(field.name)} />
                                    </Form.Item>
                                </Input.Group>
                            ))}
                            </Form.Item>

                            <Form.Item label=" " colon={false}>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                    Add Assessment
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
                <Form.Item shouldUpdate={true} label=" " colon={false}>
                    {({ getFieldsError, getFieldValue }) => {
                        let assessments = getFieldValue('assessments');

                        let sum : number | undefined = 0;

                        if (assessments)
                            for (let assessment of assessments) {
                                if (assessment?.weight)
                                    sum += assessment.weight
                                else {
                                    sum = undefined;
                                    break;
                                }
                            }
                        
                        let valid = sum === undefined || sum !== 100;
                        
                        let button = <Button
                            type="primary"
                            htmlType="submit"
                            disabled={valid || getFieldsError().map(v => v.errors.length !== 0).reduce((r, c) => (r || c), false)}>
                            Submit
                        </Button>

                        return (
                            <Space>
                                {valid ? <Tooltip title="Your weight's dont add to 100%">{button}</Tooltip> : button}
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