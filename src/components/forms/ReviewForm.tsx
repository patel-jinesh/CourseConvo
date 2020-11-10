import { Comment, Tooltip, Rate, Descriptions, Button, List, Form, Select, Input, AutoComplete, Radio, Layout, Row, Col, Divider, DatePicker, Switch } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { LikeFilled, LikeTwoTone, DislikeFilled, DislikeTwoTone } from '@ant-design/icons';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../app/store';
import moment from 'moment';
import { upvote, downvote, reply, unvote } from '../../features/courses/review';
import { USERID } from '../../backend/database';
import TextArea from 'antd/lib/input/TextArea';
import CreateCourseForm from './CreateCourseForm';
import { Term } from '../../data/types';

const { Option } = Select;

type ComponentProps = {
    initialValues?: any
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => ({
    courses: state.courses,
    instances: state.instances
});

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type State = ComponentState;
type Props = ReduxProps & ComponentProps;

class ReviewForm extends React.Component<Props, State> {
    state: State = {}

    render() {
        return (
            <Form name="review" layout="horizontal" labelCol={{ flex: '100px' }} labelAlign={"left"}>
                <Form.Item label="Semester" required>
                    <Input.Group compact>
                        <Form.Item
                            name='term'
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
                            name='year'
                            rules={[{ required: true, message: 'Please input the Year!' }]}
                            noStyle>
                            <DatePicker style={{ width: "50%" }} picker="year" />
                        </Form.Item>
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
            </Form>
        );
    }
}

export default connector(ReviewForm);