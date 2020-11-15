import { CheckOutlined, DislikeFilled, DislikeTwoTone, LikeFilled, LikeTwoTone, UserOutlined } from '@ant-design/icons';
import { Button, Col, Comment, Drawer, Form, List, Row, Space, Tag, Tooltip, Typography } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../app/store';
import { USERID } from '../backend/database';
import { ReviewTag } from '../data/types';
import { downvote, reply, tag, untag, unvote, upvote } from '../features/courses/review';
import ReportForm from './forms/ReportForm';
import SmileRate from './SmileRate';

const { Paragraph } = Typography;

type ComponentProps = {
    reviewID: string
    replyable?: boolean
    showreplies?: boolean
    full?: boolean
}

type ComponentState = {
    showing: boolean,
    replying: boolean,
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
    unvote: unvote,
    tag: tag,
    untag: untag,
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type State = ComponentState;
type Props = ReduxProps & ComponentProps;

class Review extends React.Component<Props, State> {
    state: State = {
        showing: false,
        replying: false,
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
                                <Row align="middle">
                                    <Col flex={1}>Semester</Col>
                                    <Col>{`${this.props.instance.term} ${this.props.instance.year}`}</Col>
                                </Row>
                                <Row align="middle">
                                    <Col flex={1}>Instructor</Col>
                                    <Col>{this.props.instance.instructor}</Col>
                                </Row>
                            </Space>
                            <Paragraph style={{ width: '100%', overflowWrap: 'anywhere', wordBreak: 'break-all', paddingLeft: 15, borderLeft: '1px solid #303030' }} ellipsis={this.props.full ? undefined : {
                                rows: 9,
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
                            <span
                                onClick={() => (this.props.review.upvoterIDs[USERID] ? this.props.unvote : this.props.upvote)({ reviewID: this.props.reviewID, userID: USERID })}
                                style={{ cursor: (this.props.review.userID !== USERID ? 'pointer' : 'not-allowed') }}>
                                {this.props.review.upvoterIDs[USERID] ? <LikeTwoTone /> : <LikeFilled />}
                                <span>{Object.keys(this.props.review.upvoterIDs).length}</span>
                            </span>
                        </Tooltip>,
                        <Tooltip title="Dislike">
                            <span
                                onClick={() => (this.props.review.downvoterIDs[USERID] ? this.props.unvote : this.props.downvote)({ reviewID: this.props.reviewID, userID: USERID })}
                                style={{ cursor: (this.props.review.userID !== USERID ? 'pointer' : 'not-allowed') }}>
                                {this.props.review.downvoterIDs[USERID] ? <DislikeTwoTone /> : <DislikeFilled />}
                                <span>{Object.keys(this.props.review.downvoterIDs).length}</span>
                            </span>
                        </Tooltip>,
                        [{ tag: ReviewTag.HELPFUL, color: "#FA4" }, { tag: ReviewTag.DETAILED, color: "#F1F" }, { tag: ReviewTag.ACCURATE, color: "#AF1" }].map(({ tag, color }: { tag: ReviewTag, color: string }) => {
                            let tagged = this.props.review.tags[tag][USERID] !== undefined;

                            return (
                                <Tag
                                    key={tag}
                                    icon={tagged ? <CheckOutlined /> : undefined}
                                    onClick={() => (tagged ? this.props.untag : this.props.tag)({ reviewID: this.props.reviewID, userID: USERID, tag: tag })}
                                    color={color}
                                    style={{ color: "black", cursor: (this.props.review.userID !== USERID ? 'pointer' : 'not-allowed') }}>
                                    {tag}:  {Object.values(this.props.review.tags[tag]).length}
                                </Tag>
                            );
                        }),
                        this.props.review.userID !== USERID && this.props.replyable && !this.state.replying && <span onClick={() => this.setState({ replying: true })}>Reply to</span>,
                        this.props.showreplies && <span onClick={() => this.setState({ showing: !this.state.showing })}>{this.state.showing ? "Hide" : "Show"} replies</span>,
                        this.props.review.userID !== USERID && <span className="report" onClick={() => this.setState({ reporting: true })}>Report</span>
                    ]}
                >
                    {this.state.replying && <Comment
                        avatar={this.props.user.avatar_url}
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
                                avatar: this.props.users[reply.userID].avatar_url,
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
                    onClose={() => this.setState({ reporting: false })}
                    title="Report"
                    width={467}
                    visible={this.state.reporting}>
                    <ReportForm
                        key={this.props.user.userID}
                        user={this.props.user.name}
                        onFinish={() => this.setState({ reporting: false })}
                        onCancel={() => this.setState({ reporting: false })} />
                </Drawer>
            </>
        );
    }
}

export default connector(Review);