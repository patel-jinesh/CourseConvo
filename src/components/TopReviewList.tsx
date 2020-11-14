import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../app/store';
import { ReviewTag } from '../data/types';
import Review from './Review';
import { Result, Layout } from 'antd';
import ReviewForm from './forms/ReviewForm';
import { FrownOutlined } from '@ant-design/icons';

type ComponentProps = {
    courseID: string
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => ({
    reviews: Object.values(state.reviews)
        .filter(review => state.instances[review.instanceID].courseID === props.courseID)
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
        if (this.props.reviews.length === 0)
            return (
                <>
                    <Result
                        status='warning'
                        icon={< FrownOutlined />}
                        title="Seems like there aren't any reviews for this course!"
                        subTitle="If you have taken the course, you can write one!" />
                    <Layout style={{ width: '70%', marginRight: 'auto', marginLeft: 'auto' }}>
                        <ReviewForm courseID={this.props.courseID} />
                    </Layout>
                </>
            )

        return (
            this.props.reviews.map(review => {
                return <Review full reviewID={review.reviewID} key={review.reviewID} />
            })
        )
    }
}

export default connector(TopReviewList);