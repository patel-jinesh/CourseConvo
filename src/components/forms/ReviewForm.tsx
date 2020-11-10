import { Comment, Tooltip, Rate, Descriptions, Button, List, Form, Select, Input, AutoComplete, Radio } from 'antd';
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

type ComponentProps = {}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => ({});

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type State = ComponentState;
type Props = ReduxProps & ComponentProps;

class ReviewForm extends React.Component<Props, State> {
    state: State = {}

    render() {
        return (
            <Form.Provider>
                <CreateCourseForm />
                <Form name="review" layout="horizontal" labelCol={{ flex: '100px' }} labelAlign={"left"}>
                    <Form.Item name="difficulty">
                        <Rate allowHalf allowClear></Rate>
                    </Form.Item>
                    <Form.Item name="enjoyability">
                        <Rate allowHalf allowClear></Rate>
                    </Form.Item>
                    <Form.Item name="workload">
                        <Radio.Group
                            options={["Light", "Normal", "Heavy", "Unbearable"]}
                            optionType="button"
                            buttonStyle="solid"
                        />
                    </Form.Item>
                </Form>
            </Form.Provider>
        );
    }
}

export default connector(ReviewForm);