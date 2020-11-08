import { Comment, Tooltip, Rate, Descriptions } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { LikeFilled, LikeTwoTone, DislikeFilled, DislikeTwoTone } from '@ant-design/icons';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../app/store';
import moment from 'moment';
import { upvote, downvote } from '../features/courses/review';
import { USERID } from '../backend/database';

type ComponentProps = {
    reviewID: string
    replyable?: boolean
}

const mapState = (state: RootState, props: ComponentProps) => ({
    review: state.reviews[props.reviewID],
    user: state.users[state.reviews[props.reviewID].userID]
});

const mapDispatch = {
    upvote: upvote,
    downvote: downvote,
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;

class Review extends React.Component<Props> {
    render() {
        return (
            <Comment
                author={<a>{this.props.user.name}{}</a>}
                avatar={
                    <Avatar
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    />
                }
                content={
                    <>
                        <Descriptions size='small' style={{width: 'max-content'}} bordered column={1}>
                            <Descriptions.Item label="Difficulty"><Rate defaultValue={this.props.review.difficulty} disabled allowHalf></Rate></Descriptions.Item>
                            <Descriptions.Item label="Workload"><Rate defaultValue={this.props.review.difficulty} disabled allowHalf></Rate></Descriptions.Item>
                            <Descriptions.Item label="Enjoyability"><Rate defaultValue={this.props.review.difficulty} disabled allowHalf></Rate></Descriptions.Item>
                        </Descriptions>
                        <p>{this.props.review.comment}</p>
                    </>
                }
                datetime={
                    <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{moment().fromNow()}</span>
                    </Tooltip>
                }
                actions={[
                    <Tooltip key="comment-basic-like" title="Like">
                        <span onClick={() => this.props.upvote({ reviewID: this.props.reviewID, userID: USERID })}>
                            {this.props.review.upvoterIDs[USERID] ? <LikeTwoTone /> : <LikeFilled />}
                            <span className="comment-action">{Object.keys(this.props.review.upvoterIDs).length}</span>
                        </span>
                    </Tooltip>,
                    <Tooltip key="comment-basic-dislike" title="Dislike">
                        <span onClick={() => this.props.downvote({ reviewID: this.props.reviewID, userID: USERID })}>
                            {this.props.review.downvoterIDs[USERID] ? <DislikeTwoTone /> : <DislikeFilled />}
                            <span className="comment-action">{Object.keys(this.props.review.downvoterIDs).length}</span>
                        </span>
                    </Tooltip>,
                    ...[this.props.replyable ? <span key="comment-basic-reply-to">Reply to</span> : undefined],
                ]}
            />
        );
    }
}

export default connector(Review);