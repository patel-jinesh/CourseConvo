import { FrownOutlined, FilterOutlined } from '@ant-design/icons';
import { Form, Layout, PageHeader, Result, Space, List, Comment, Card, Drawer, Divider, Button, Row, Col, Affix, Pagination, Checkbox, Tag, Dropdown, Menu, Rate, Select, Radio } from "antd";
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
        instances: Object.fromEntries(Object.entries(state.instances).filter(([instnaceID, instance]) => instance.courseID === queryID)),
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
        visible: false,
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

        let semesters = this.props.reviews.map(review => `${this.props.instances[review.instanceID].term} ${this.props.instances[review.instanceID].year}`)

        let datasouce = this.props.reviews.reverse().filter(review => review.userID !== USERID).map(review => ({
            reviewID: review.reviewID,
            replyable: true,
            showreplies: true,
            editable: true
        }));

        let header = <>
            <p>{`${datasouce.length} ${datasouce.length > 1 ? 'reviews' : 'review'}`}</p>
        </>

        return (
            <PageHeader
                style={{ width: "100%", minWidth: 900 }}
                backIcon={false}
                title={`${this.props.course?.subject} ${this.props.course?.code} - ${this.props.course?.name}`}>
                {content}
                <Row gutter={24} >
                    {
                        <Col style={{width: 300}}>
                            <Affix offsetTop={26}>
                                <Card bordered={false}>
                                    <List header="Filters">
                                        <Space style={{ width: '100%', marginTop: 10 }} direction='vertical'>
                                            <span>Semesters</span>
                                            <Select mode="tags" style={{ width: '100%' }} placeholder="Semesters"
                                                defaultValue={semesters}
                                                options={
                                                    semesters.map(semester => ({
                                                        value: semester
                                                    }))
                                                }>
                                            </Select>
                                            <span>Minimum Overall Rating</span>
                                            <Rate allowHalf allowClear></Rate>
                                        </Space>
                                    </List>
                                </Card>
                                <Card bordered={false} style={{marginTop: 5}}>
                                    <List header="Sort by">
                                        <Radio.Group style={{marginTop: 10}}>
                                            <Radio style={{ display: 'block' }} value={1}>Ascending</Radio>
                                            <Radio style={{ display: 'block' }} value={2}>Descending</Radio>
                                        </Radio.Group>
                                        <Divider style={{margin: '10px 0'}}></Divider>
                                        <Radio.Group>
                                            <Radio style={{ display: 'block' }} value={2}>Semester</Radio>
                                            <Radio style={{ display: 'block' }} value={1}>Course Rating</Radio>
                                            <Radio style={{ display: 'block' }} value={2}>Date</Radio>
                                        </Radio.Group>
                                    </List>
                                </Card>
                            </Affix>
                        </Col>
                    }
                    {<Col flex={1}>
                        <List
                    dataSource={datasouce}
                    header={header}
                    itemLayout="horizontal"
                    renderItem={props => <Review {...props} />}/>
                    </Col>}
                </Row>
                
                <Drawer
                    onClose={() => this.setState({ visible: false })}
                    title="Write a Review"
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