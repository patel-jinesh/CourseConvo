import { FrownOutlined } from '@ant-design/icons';
import { Form, Layout, PageHeader, Result, Space, List } from "antd";
import { History, Location } from "history";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { match, withRouter } from "react-router-dom";
import { RootState } from "../app/store";
import InstanceCard from "../components/InstanceCard";
import CreateCourseForm from "../components/forms/CreateCourseForm";
import SearchCourseForm from "../components/forms/SearchCourseForm";
import { Term } from "../data/types";
import Review from '../components/Review';
import { USERID } from '../backend/database';
import ReviewForm from '../components/forms/ReviewForm';

const { Content } = Layout;

type ComponentProps = {
    match: match,
    location: Location,
    history: History,
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => {
    let queryID = (new URLSearchParams(props.location.search)).get('courseID')!;

    return {
        reviews: Object.values(state.reviews).filter(review => state.instances[review.instanceID].courseID === queryID),
        users: state.users,
        course: state.courses[queryID],
    }
};

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState

class CourseReviewsPage extends React.Component<Props, State> {
    state: State = {}

    render() {
        let userreview = this.props.reviews.find(review => review.userID === USERID);

        return (
            <PageHeader
                style={{ width: "100%" }}
                backIcon={false}
                title={`${this.props.course?.subject} ${this.props.course?.code} - ${this.props.course?.name}`}
            >
                {<ReviewForm/>}
                    <List
                        dataSource={this.props.reviews.reverse().map(review => ({
                            reviewID: review.reviewID,
                            replyable: true,
                            showreplies: true,
                            editable: true
                        }))}
                        header={`${this.props.reviews.length} ${this.props.reviews.length > 1 ? 'reviews' : 'review'}`}
                        itemLayout="horizontal"
                        renderItem={props => <Review {...props} />}
                    />
            </PageHeader>
        );
    }
}

export default withRouter(connector(CourseReviewsPage));