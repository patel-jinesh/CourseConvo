import { Comment, Tooltip, Rate, Descriptions, Button, List, Form, Card, Tag } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { LikeFilled, LikeTwoTone, DislikeFilled, DislikeTwoTone } from '@ant-design/icons';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../app/store';
import moment from 'moment';
import { upvote, downvote, reply, unvote } from '../features/courses/review';
import { USERID } from '../backend/database';
import TextArea from 'antd/lib/input/TextArea';
import ReportForm from './forms/ReportForm';

type ComponentProps = {
    reviewID: string
    replyable?: boolean
    showreplies?: boolean
    editable?: boolean
}

type ComponentState = {
    showing: boolean,
    replying: boolean,
    editing: boolean,
    reporting: boolean,
}

const mapState = (state: RootState, props: ComponentProps) => ({
    review: state.reviews[props.reviewID],
    user: state.users[state.reviews[props.reviewID].userID],
    users: state.users,
});

const mapDispatch = {
    upvote: upvote,
    downvote: downvote,
    reply: reply,
    unvote: unvote
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type State = ComponentState;
type Props = ReduxProps & ComponentProps;

class Review extends React.Component<Props, State> {
    state: State = {
        showing: false,
        replying: false,
        editing: false,
        reporting: false,
    }

    render() {
        return (
            <Comment
                author={<span>{this.props.user.name}</span>}
                avatar={
                    <Avatar
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    />
                }
                content={
                    <>
                        <Descriptions size='small' style={{ width: 'max-content' }} bordered column={1}>
                            <Descriptions.Item label="Difficulty"><Rate defaultValue={this.props.review.difficulty} disabled allowHalf></Rate></Descriptions.Item>
                            <Descriptions.Item label="Workload"><Rate defaultValue={this.props.review.workload} disabled allowHalf></Rate></Descriptions.Item>
                            <Descriptions.Item label="Enjoyability"><Rate defaultValue={this.props.review.enjoyability} disabled allowHalf></Rate></Descriptions.Item>
                        </Descriptions>
                        <p>{this.props.review.comment}</p>
                    </>
                }
                datetime={
                    <Tooltip title={moment().format('YYYY-MM-DD hh:mm:ss')}>
                        <span>{moment().fromNow()}</span>
                    </Tooltip>
                }
                actions={[
                    <Tooltip title="Like">
                        <span onClick={() => (this.props.review.upvoterIDs[USERID] ? this.props.unvote : this.props.upvote)({ reviewID: this.props.reviewID, userID: USERID })}>
                            {this.props.review.upvoterIDs[USERID] ? <LikeTwoTone /> : <LikeFilled />}
                            <span className="comment-action">{Object.keys(this.props.review.upvoterIDs).length}</span>
                        </span>
                    </Tooltip>,
                    <Tooltip title="Dislike">
                        <span onClick={() => (this.props.review.downvoterIDs[USERID] ? this.props.unvote : this.props.downvote)({ reviewID: this.props.reviewID, userID: USERID })}>
                            {this.props.review.downvoterIDs[USERID] ? <DislikeTwoTone /> : <DislikeFilled />}
                            <span className="comment-action">{Object.keys(this.props.review.downvoterIDs).length}</span>
                        </span>
                    </Tooltip>,
                    this.props.editable && this.props.review.userID === USERID && <span onClick={() => this.setState({ editing: true })}>Edit</span>,
                    this.props.replyable && this.props.review.userID !== USERID && <span onClick={() => this.setState({ replying: true })}>Reply to</span>,
                    this.props.showreplies && <span onClick={() => this.setState({ showing: !this.state.showing })}>{this.state.showing ? "Hide" : "Show"} replies</span>,
                    this.props.review.userID !== USERID && <span className="report" onClick={() => this.setState({ reporting: !this.state.reporting })}>{this.state.reporting ? "Cancel Report" : "Report"}</span>
                ]}
            >
                {this.state.reporting && <Comment style={{width: '50%', minWidth: '500px'}}
                    content={
                        <>
                            <Card title={`You are reporting ${this.props.user.name}`}><ReportForm></ReportForm></Card>
                        </>
                    }
                />
                }
                {this.state.replying && <Comment
                    avatar={
                        <Avatar
                            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        />
                    }
                    content={
                        <>
                            <Form onFinish={(values) => {
                                this.props.reply({
                                    reviewID: this.props.reviewID,
                                    userID: USERID,
                                    comment: values.comment
                                });
                                this.setState({ replying: false });
                            }}>
                            <Form.Item name="comment">
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit"  type="primary">
                                    Add Comment
                                </Button>
                            </Form.Item>
                            </Form>
                        </>
                    }
                />
                }
                {this.state.showing && <List
                    dataSource={
                        this.props.review.replies.map(reply => ({
                                author: this.props.users[reply.userID].name,
                                avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
                                content: <p>{reply.comment}</p>,
                                datetime: moment(reply.datetime).fromNow()
                        })).reverse()
                    }
                    header={`${Object.entries(this.props.review.replies).length} ${Object.entries(this.props.review.replies).length > 1 ? 'replies' : 'reply'}`}
                    itemLayout="horizontal"
                    renderItem={props => <Comment {...props} />}
                />
                }
            </Comment>
        );
    }
}

export default connector(Review);