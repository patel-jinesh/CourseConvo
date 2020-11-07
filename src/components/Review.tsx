import { Comment } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../app/store';

type ComponentProps = {
    reviewID: string
}

const mapState = (state: RootState, props: ComponentProps) => ({
    review: state.reviews[props.reviewID]
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;

class Review extends React.Component<Props> {
    render() {
        return (
            <Comment
                author={<a>{this.props.review.userID}{}</a>}
                avatar={
                    <Avatar
                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        alt="Han Solo"
                    />
                }
                content={
                    <p>{this.props.review.comment}</p>
                }
            />
        );
    }
}

export default connector(Review);