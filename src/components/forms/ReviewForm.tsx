import { Comment, Tooltip, Rate, Descriptions, Button, List, Form, Select, Input, AutoComplete, Radio, Layout, Row, Col, Divider, DatePicker, Switch, Space } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { LikeFilled, LikeTwoTone, DislikeFilled, DislikeTwoTone } from '@ant-design/icons';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../app/store';
import moment from 'moment';
import { upvote, downvote, reply, unvote, add as addReview } from '../../features/courses/review';
import { add as addInstance } from '../../features/courses/instance';
import { USERID } from '../../backend/database';
import TextArea from 'antd/lib/input/TextArea';
import CreateCourseForm from './CreateCourseForm';
import { Term } from '../../data/types';
import { v4 as uuidv4 } from 'uuid';
import { addDateForm, addTermForm } from "../../utilities/formUtils";

const { Option } = Select;

type ComponentProps = {
    initialValues?: any
    onFinish?: () => void;
    onCancel?: () => void;
    courseID: string;
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => ({
    courses: state.courses,
    instances: state.instances
});

const mapDispatch = {
    addReview: addReview,
    addInstance: addInstance
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type State = ComponentState;
type Props = ReduxProps & ComponentProps;

class ReviewForm extends React.Component<Props, State> {
    state: State = {}

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

        this.props.addReview({
            userID: USERID,
            comment: values.comment,
            difficulty: values.difficulty,
            enjoyability: values.enjoyability,
            workload: values.workload,
            isAnonymous: values.anonymous,
            instanceID: instanceID,
            upvoterIDs: {},
            downvoterIDs: {},
            replies: []
        })

        if (this.props.onFinish)
            this.props.onFinish();
    }

    render() {
        return (
            <Form name="review" layout="horizontal" labelCol={{ flex: '100px' }} labelAlign={"left"} onFinish={this.onFinish}>
                <Form.Item label="Semester" required>
                    <Input.Group compact>
                        {addTermForm("50", "middle")}
                        {addDateForm("50", "middle")}
                    </Input.Group>
                </Form.Item>
                <Form.Item
                    noStyle
                    dependencies={[['subject'], ['code'], ['term'], ['year']]}>
                    {
                        ({ getFieldValue }) => {
                            let subject = getFieldValue('subject');
                            let code = getFieldValue('code');
                            let term = getFieldValue('term');
                            let year = getFieldValue('year')?.year();

                            let course = Object.values(this.props.courses).find(course =>
                                course.code === code &&
                                course.subject === subject);

                            let instance = Object.values(this.props.instances).find(instance =>
                                instance.courseID === course?.courseID &&
                                instance.term === term &&
                                instance.year === year);

                            return (
                                <Form.Item
                                    name="instructor"
                                    label="Instructor"
                                    rules={[{ required: true, message: "Please input the instructor name!" }]}
                                    required>
                                    <AutoComplete
                                        disabled={instance !== undefined}
                                        filterOption={(i, o) => o?.value.toUpperCase().indexOf(i.toUpperCase()) === 0}
                                        options={
                                            Object.values(this.props.instances)
                                                .map(instance => instance.instructor)
                                                .unique()
                                                .map(instructor => ({ value: instructor }))
                                        }
                                    />
                                </Form.Item>
                            )
                        }
                    }
                </Form.Item>
                <Form.Item required name="difficulty" label="Difficulty">
                    <Rate allowHalf allowClear></Rate>
                </Form.Item>
                <Form.Item required name="enjoyability" label="Enjoyability">
                    <Rate allowHalf allowClear></Rate>
                </Form.Item>
                <Form.Item required name="workload" label="Workload">
                    <Rate allowHalf allowClear></Rate>
                </Form.Item>
                <Form.Item required name="comment" label="Comment">
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item required name="anonymous" label="Anonymous">
                    <Switch></Switch>
                </Form.Item>
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

export default connector(ReviewForm);