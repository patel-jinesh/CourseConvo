import { Button, Form, Input, Space, Switch } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '../../app/store';
import { USERID } from '../../backend/database';
import { FormType, ReviewTag } from '../../data/types';
import { add as addInstance } from '../../features/courses/instance';
import { add as addReview, edit as editReview } from '../../features/courses/review';
import { addDateForm, addForms, addTermForm } from "../../utilities/formUtils";
import SmileRate from '../SmileRate';

type ComponentProps = {
    initialValues?: any;
    onFinish?: () => void;
    onCancel?: () => void;
    reviewID?: string;
    courseID: string;
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => ({
    courses: state.courses,
    instances: state.instances,
    reviews: state.reviews
});

const mapDispatch = {
    addReview: addReview,
    addInstance: addInstance,
    editReview: editReview
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type State = ComponentState;
type Props = ReduxProps & ComponentProps;

class ReviewForm extends React.Component<Props, State> {
    state: State = {}

    onFinish = (values: any) => {
        console.log(values);
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
        
        if (this.props.reviewID)
            this.props.editReview({
                ...this.props.reviews[this.props.reviewID],
                reviewID: this.props.reviewID,
                userID: USERID,
                comment: values.comment,
                difficulty: values.difficulty,
                enjoyability: values.enjoyability,
                workload: values.workload,
                isAnonymous: values.anonymous,
                instanceID: instanceID,
                upvoterIDs: {},
                downvoterIDs: {},
                replies: [],
            });
        else
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
                replies: [],
                tags: {
                    [ReviewTag.HELPFUL]: {},
                    [ReviewTag.DETAILED]: {},
                    [ReviewTag.ACCURATE]: {}
                }
            });

        if (this.props.onFinish)
            this.props.onFinish();
    }

    render() {
        return (
            <Form initialValues={this.props.initialValues} name="review" layout="horizontal" labelCol={{ flex: '100px' }} labelAlign={"left"} onFinish={this.onFinish}>
                <Form.Item label="Semester" required>
                    <Input.Group compact>
                        {addTermForm("50", "middle")}
                        {addDateForm("50", "middle")}
                    </Input.Group>
                </Form.Item>
                {addForms(Object.values(this.props.courses), Object.values(this.props.instances), [FormType.INSTRUCTOR], this.props.courseID)}
                <Form.Item required name="difficulty" label="Difficulty">
                    <SmileRate></SmileRate>
                </Form.Item>
                <Form.Item required name="enjoyability" label="Enjoyability">
                    <SmileRate></SmileRate>
                </Form.Item>
                <Form.Item required name="workload" label="Workload">
                    <SmileRate></SmileRate>
                </Form.Item>
                <Form.Item label="Overall" dependencies={['difficulty', 'enjoyability', 'workload']}>
                    {({ getFieldValue }) => {
                        return (
                            `${((getFieldValue('difficulty') + getFieldValue('workload') + getFieldValue('enjoyability')) / 3).toFixed(2)} / 5`
                        )
                    }}
                </Form.Item>
                <Form.Item name="comment" label="Comment">
                    <TextArea rows={8} />
                </Form.Item>
                <Form.Item name="anonymous" label="Anonymous" valuePropName="checked">
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