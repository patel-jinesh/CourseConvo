import { FrownOutlined } from '@ant-design/icons';
import { Form, Layout, PageHeader, Result, Space, List, Comment, Card, Drawer, Divider, Button } from "antd";
import { History, Location } from "history";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { match, withRouter } from "react-router-dom";
import { RootState } from "../app/store";
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

type ComponentState = {
    visible: boolean
}

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
    state: State = {
        visible: false
    }

    render() {
        let userreview = this.props.reviews.find(review => review.userID === USERID);

        let content: JSX.Element | undefined = undefined;

        if (userreview) {
            content = <List
                itemLayout="horizontal"
                header={"Your review"}>
                <Review reviewID={userreview.reviewID} />
            </List>
        } else {
            content = <Result
                status='warning'
                icon={< FrownOutlined />}
                title="Seems like you haven't written a review for this course!"
                subTitle="You can add one by clicking the button below!"
                extra={<Button onClick={() => this.setState({visible: true})} type="primary">Write a review!</Button>}/>
        }

        return (
            <PageHeader
                style={{ width: "100%" }}
                backIcon={false}
                title={`${this.props.course?.subject} ${this.props.course?.code} - ${this.props.course?.name}`}>
                {content}
                <List
                    dataSource={this.props.reviews.reverse().map(review => ({
                        reviewID: review.reviewID,
                        replyable: true,
                        showreplies: true,
                        editable: true
                    }))}
                    header={`${this.props.reviews.length} ${this.props.reviews.length > 1 ? 'reviews' : 'review'}`}
                    itemLayout="horizontal"
                    renderItem={props => <Review {...props} />}/>
                <Drawer
                    onClose={() => this.setState({ visible: false })}
                    title="Create a new account"
                    width={467}
                    visible={this.state.visible}>
                    <ReviewForm
                        courseID={this.props.course.courseID}
                        initialValues={{ name: this.props.course.name, subject: this.props.course.subject, code: this.props.course.code }}
                        onFinish={() => this.setState({ visible: false })}
                        onCancel={() => this.setState({ visible: false })} />
                </Drawer>
            </PageHeader>
        );
    }
}

export default withRouter(connector(CourseReviewsPage));