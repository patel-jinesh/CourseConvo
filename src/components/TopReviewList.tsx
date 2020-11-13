import { CheckOutlined, DislikeFilled, DislikeTwoTone, LikeFilled, LikeTwoTone, UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Col, Comment, Drawer, Form, List, Row, Space, Tooltip, Typography, Tag, Badge } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../app/store';
import { USERID } from '../backend/database';
import { downvote, reply, unvote, upvote, tag, untag } from '../features/courses/review';
import ReportForm from './forms/ReportForm';
import ReviewForm from './forms/ReviewForm';
import SmileRate from './SmileRate';
import { ReviewTag } from '../data/types';
import Review from './Review';

const { Paragraph } = Typography;

type ComponentProps = {}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => ({
    reviews: Object.values(state.reviews)
        .sort((a, b) => {
            let arank = Object.values(a.upvoterIDs).length - Object.values(a.downvoterIDs).length + Object.values(a.tags[ReviewTag.ACCURATE]).length + Object.values(a.tags[ReviewTag.DETAILED]).length + Object.values(a.tags[ReviewTag.HELPFUL]).length;
            let brank = Object.values(b.upvoterIDs).length - Object.values(b.downvoterIDs).length + Object.values(b.tags[ReviewTag.ACCURATE]).length + Object.values(b.tags[ReviewTag.DETAILED]).length + Object.values(b.tags[ReviewTag.HELPFUL]).length;

            console.log(arank, brank)

            return brank - arank;
        })
        .slice(0, 3)
});

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type State = ComponentState;
type Props = ReduxProps & ComponentProps;

class TopReviewList extends React.Component<Props, State> {
    state: State = {}

    render() {
        return (
            this.props.reviews.map(review => {
                return <Review full reviewID={review.reviewID} key={review.reviewID} />
            })
        )
    }
}

export default connector(TopReviewList);