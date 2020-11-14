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
import { Assessments, FormType, Lecture, Mark, Term } from '../../data/types';
import { v4 as uuidv4 } from 'uuid';
import { addDateForm, addForms, addRadioGroup, addTermForm } from "../../utilities/formUtils";
import { FormInstance } from 'antd/lib/form';

const { Option } = Select;

type ComponentProps = {
    onFinish?: () => void;
    onCancel?: () => void;
    courseID: string;
    breakdownID?: any;
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => ({
    courses: state.courses,
    instances: state.instances,
    breakdowns: state.breakdowns,
    breakdown: props.breakdownID !== undefined ? state.breakdowns[props.breakdownID] : undefined,
    course: props.breakdownID !== undefined ? state.courses[props.courseID] : undefined,
    instance: props.breakdownID !== undefined ? state.instances[state.breakdowns[props.breakdownID].instanceID] : undefined
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
        if (instance !== undefined && values.lecture !== instance.lecture)
            this.form.current?.setFieldsValue({ lecture: instance.lecture });
    }

    onFinish = (values: any) => {
        let instance = Object.values(this.props.instances).find(instance => instance.courseID === this.props.courseID && instance.term === values.term && instance.year === values.year?.year())
        let instanceID = instance?.instanceID ?? uuidv4();

        if (instance === undefined)
            this.props.addInstance({
                lecture: values.lecture,
                instanceID: instanceID,
                instructor: values.instructor,
                term: values.term,
                year: values.year?.year(),
                courseID: this.props.courseID
            });

        if (this.props.breakdownID)
            this.props.editBreakdown({
                ...this.props.instance,
                ...values,
                year: undefined,
                breakdownID: this.props.breakdownID,
                userID: USERID,
                marks: values.assessments,
                isAnonymous: false
            });
        else
            this.props.addBreakdown({
                ...values,
                year: undefined,
                instanceID: instanceID,
                userID: USERID,
                marks: values.assessments,
                isAnonymous: false
            });

        if (this.props.onFinish)
            this.props.onFinish();
    }

    validateAssessments = (getFieldValue: any) => {
        let assessments = getFieldValue('assessments');
        let seen = {
            [Assessments.ASSIGNMENTS]: false,
            [Assessments.EXAMS]: false,
            [Assessments.LABS]: false,
            [Assessments.MIDTERMS]: false,
            [Assessments.OTHER]: false,
            [Assessments.PROJECTS]: false,
            [Assessments.QUIZZES]: false,
        };

        let sum: number | undefined = 0;
        let same = false;

        if (assessments)
            for (let assessment of assessments) {
                if (assessment?.type)
                    if (!seen[assessment?.type as Assessments])
                        seen[assessment?.type as Assessments] = true;
                    else
                        return Promise.reject(`You have more than 1 of '${assessment}'!`)
                if (assessment?.weight)
                    sum += assessment.weight
                else
                    return Promise.reject(`Your assessments don't sum to 100%!`)
            }

        return Promise.resolve();
    }

    render() {
        let initialValues = {
            ...this.props.course,
            ...this.props.instance,
            ...this.props.breakdown,
            year: this.props.instance?.year === undefined ? undefined : moment(`${this.props.instance?.year}`),
            assessments: this.props.breakdown?.marks ?? [[undefined, undefined, undefined]]
        }

        return (
            <Form ref={this.form} name="review" initialValues={initialValues} layout="horizontal" labelCol={{ flex: '130px' }} labelAlign={"left"} onFinish={this.onFinish} onValuesChange={this.onValuesChange}>
                <Form.Item label="Semester" required>
                    <Input.Group compact>
                        {addTermForm("50", "middle")}
                        {addDateForm("50", "middle")}
                    </Input.Group>
                </Form.Item>
                {addForms(Object.values(this.props.courses), Object.values(this.props.instances), [FormType.INSTRUCTOR], this.props.courseID)}
                {addRadioGroup("lecture", 'Lecture Type', Lecture, ['term', 'year'], Object.values(this.props.courses), Object.values(this.props.instances), this.props.courseID)}

                <Form.Item label=" " colon={false}>
                    <Form.List name="assessments">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(field => {
                                    return (
                                        <Input.Group compact key={field.key} >
                                            <Form.Item
                                                {...field}
                                                label="Type"
                                                key="Type"
                                                style={{ width: '35%' }}
                                                name={[field.name, 'type']}
                                                fieldKey={[field.fieldKey, 'type']}
                                                rules={[{ required: true, message: 'Missing assessment' }]}
                                            >
                                                <Select placeholder="Assessment" style={{ width: '100%' }} onDropdownVisibleChange={_ => this.setState({})}>
                                                    {Object.values(Assessments)
                                                        .filter(a => !fields.some(f => this.form.current?.getFieldValue(['assessments', f.name, 'type']) === a))
                                                        .map(item => (
                                                            <Option key={item} value={item}>
                                                                {item}
                                                            </Option>
                                                        ))}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                key="Weight"
                                                label="Weight"
                                                style={{ width: '27.5%' }}
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
                                                style={{ width: '27.5%' }}
                                                name={[field.name, 'count']}
                                                fieldKey={[field.fieldKey, 'count']}
                                                rules={[{ required: true, message: 'Missing count' }]}
                                            >
                                                <InputNumber style={{ width: '100%' }} min={1} />
                                            </Form.Item>
                                            {
                                                fields.length !== 1 &&
                                                <Form.Item label=" " colon={false} style={{ marginLeft: 15 }}>
                                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                                </Form.Item>
                                            }
                                        </Input.Group>
                                    )
                                })}

                                { fields.length < Object.values(Assessments).length &&
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add Assessment
                                        </Button>
                                    </Form.Item>
                                }
                            </>
                        )}
                    </Form.List>
                </Form.Item>
                <Form.Item shouldUpdate={true} label=" " colon={false}>
                    {({ getFieldsError, getFieldValue }) => {
                        let assessments = getFieldValue('assessments');
                        let seen = {
                            [Assessments.ASSIGNMENTS]: false,
                            [Assessments.EXAMS]: false,
                            [Assessments.LABS]: false,
                            [Assessments.MIDTERMS]: false,
                            [Assessments.OTHER]: false,
                            [Assessments.PROJECTS]: false,
                            [Assessments.QUIZZES]: false,
                        };

                        let sum: number | undefined = 0;
                        let same = false;

                        if (assessments)
                            for (let assessment of assessments) {
                                if (assessment?.type)
                                    if (!seen[assessment?.type as Assessments])
                                        seen[assessment?.type as Assessments] = true;
                                    else {
                                        same = true;
                                        break;
                                    }
                                if (assessment?.weight)
                                    sum += assessment.weight
                                else {
                                    sum = undefined;
                                    break;
                                }
                            }

                        let invalid = sum === undefined || sum !== 100;

                        let button = <Button
                            type="primary"
                            htmlType="submit"
                            disabled={getFieldsError().map(v => v.errors.length !== 0).reduce((r, c) => (r || c), false)}>
                            Submit
                        </Button>

                        return (
                            <Space>
                                {button}
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