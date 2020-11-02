import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../app/store'
import React from 'react'
import Avatar from 'antd/lib/avatar/avatar';
import { Comment, Tooltip } from 'antd';

type ComponentProps = {
    id: string
}

const mapState = (state: RootState, props : ComponentProps) => ({
    review: state.reviews[props.id]
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;

class Review extends React.Component<Props> {
    render() {
        return (
            <Comment
                author={<a>{this.props.review.user.name}</a>}
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