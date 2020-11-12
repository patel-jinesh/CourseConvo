import { Comment, Tooltip, Rate, Descriptions, Button, List, Form, Card, Tag, Row, Col, Space, Divider, Typography, Drawer } from 'antd';
import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { LikeFilled, LikeTwoTone, DislikeFilled, DislikeTwoTone, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../app/store';
import moment from 'moment';
import { upvote, downvote, reply, unvote } from '../features/courses/review';
import { USERID } from '../backend/database';
import TextArea from 'antd/lib/input/TextArea';
import ReportForm from './forms/ReportForm';
import SmileRate from './SmileRate';
import ReviewForm from './forms/ReviewForm';

const { Paragraph } = Typography;

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
    course: state.courses[state.instances[state.reviews[props.reviewID].instanceID].courseID],
    instance: state.instances[state.reviews[props.reviewID].instanceID]
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
            <>
                <Comment
                    author={<span>{this.props.review.isAnonymous ? "Anonymous" : this.props.user.name}</span>}
                    avatar={
                        this.props.review.isAnonymous
                            ? <Avatar icon={< UserOutlined />} />
                            : this.props.user.avatar_url}
                    content={
                        <Space direction='horizontal' align='start' style={{ width: '100%' }}>
                            <Space direction='vertical' style={{ width: 300 }}>
                                <Row align="middle" wrap={false} gutter={5}>
                                    <Col flex={1}>Difficulty</Col>
                                    <Col>
                                        <SmileRate
                                            disabled
                                            tooltips={["Challenging", "Hard", "Understandable", "Easy", "No brainer"]}
                                            value={this.props.review.difficulty} />
                                    </Col>
                                </Row>
                                <Row align="middle">
                                    <Col flex={1}>Enjoyability</Col>
                                    <Col>
                                        <SmileRate
                                            disabled
                                            tooltips={["Sleepy", "Boring", "Meh", "Fun", "Exciting"]}
                                            value={this.props.review.enjoyability} />
                                    </Col>
                                </Row>
                                <Row align="middle">
                                    <Col flex={1}>Workload</Col>
                                    <Col>
                                        <SmileRate
                                            disabled
                                            tooltips={["Unbearable", "Heavy", "Manageable", "Light", "Barely"]}
                                            value={this.props.review.workload} />
                                    </Col>
                                </Row>
                                <Row align="middle">
                                    <Col flex={1}>Overall</Col>
                                    <Col>{`${((this.props.review.enjoyability + this.props.review.difficulty + this.props.review.workload) / 3).toFixed(2)} / 5`}</Col>
                                </Row>
                            </Space>
                            <Paragraph style={{ overflowWrap: 'anywhere', wordBreak: 'break-all', paddingLeft: 15, borderLeft: '1px solid #303030' }} ellipsis={{
                                rows: 6,
                                expandable: true,
                            }}>
                                {this.props.review.comment}
                            </Paragraph>
                        </Space>
                    }
                    datetime={
                        <Tooltip title={moment(this.props.review.datetime).format('YYYY-MM-DD hh:mm:ss')}>
                            <span>{moment(this.props.review.datetime).fromNow()}</span>
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
                        this.props.replyable && !this.state.replying && this.props.review.userID !== USERID && <span onClick={() => this.setState({ replying: true })}>Reply to</span>,
                        this.props.showreplies && <span onClick={() => this.setState({ showing: !this.state.showing })}>{this.state.showing ? "Hide" : "Show"} replies</span>,
                        this.props.review.userID !== USERID && <span className="report" onClick={() => this.setState({ reporting: !this.state.reporting })}>{this.state.reporting ? "Cancel Report" : "Report"}</span>
                    ]}
                >
                    {this.state.reporting && <Comment style={{ width: '50%', minWidth: '500px' }}
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
                                        <Space direction='horizontal'>
                                            <Button htmlType="submit" type="primary">
                                                Add Comment
                                        </Button>
                                            <Button onClick={() => this.setState({ replying: false })} htmlType="button" type="default">
                                                Cancel
                                        </Button>
                                        </Space>
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
                <Drawer
                    forceRender
                    destroyOnClose
                    onClose={() => this.setState({ editing: false })}
                    title="Edit review"
                    width={467}
                    visible={this.state.editing}>
                    <ReviewForm
                        courseID={this.props.course.courseID}
                        reviewID={this.props.review.reviewID}
                        initialValues={{
                            term: this.props.instance.term,
                            year: moment(`${this.props.instance.year}`),
                            instructor: this.props.instance.instructor,
                            difficulty: this.props.review.difficulty,
                            enjoyability: this.props.review.enjoyability,
                            workload: this.props.review.workload,
                            comment: this.props.review.comment,
                            anonymous: this.props.review.isAnonymous
                        }}
                        onFinish={() => this.setState({ editing: false })}
                        onCancel={() => this.setState({ editing: false })} />
                </Drawer>
            </>
        );
    }
}

export default connector(Review);