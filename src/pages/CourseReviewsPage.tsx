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
import { RadioChangeEvent } from 'antd/lib/radio';

const { Content } = Layout;

type ComponentProps = {
    match: match,
    location: Location,
    history: History,
}

type ComponentState = {
    visible: boolean,
    hide: boolean,
    filters: {
        semesters: string[],
        minimumrating: number
    },
    sortorder: "Ascending" | "Descending",
    sortprop: "Date" | "Rating" | "Semester"
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
        hide: false,
        filters: {
            semesters: ["All"],
            minimumrating: 0
        },
        sortorder: "Descending",
        sortprop: "Date"
    }

    onSortOrderChange = (e: RadioChangeEvent) => {
        
    }

    render() {
        let userreview = this.props.reviews.find(review => review.userID === USERID);

        let content: JSX.Element | undefined = undefined;

        if (!userreview && !this.state.hide) {
            content = <Result
                status='warning'
                icon={< FrownOutlined />}
                title="Seems like you haven't written a review for this course!"
                subTitle="If you have taken the course, you can add one by clicking the button below!"
                extra={
                    <>
                        <Button onClick={() => this.setState({ visible: true })} type="primary">Write a review!</Button>
                        <Button onClick={() => this.setState({ hide: true })}>Hide</Button>
                    </>
                } />
        }

        let semesters = this.props.reviews.map(review => `${this.props.instances[review.instanceID].term} ${this.props.instances[review.instanceID].year}`)

        let datasource = this.props.reviews.reverse()
            .filter(review => review.userID !== USERID)
            .filter(review => {
                let rating = (review.difficulty + review.workload + review.enjoyability) / 3;

                if (this.state.filters.semesters.length === 1 && this.state.filters.semesters[0] === "All")
                    return this.state.filters.minimumrating <= rating;
                
                if (this.state.filters.semesters.includes(`${this.props.instances[review.instanceID].term} ${this.props.instances[review.instanceID].year}`))
                    return this.state.filters.minimumrating <= rating;
                
                return false;
            })
            .map(review => ({
            reviewID: review.reviewID,
            replyable: true,
            showreplies: true,
            editable: true
        }));

        let header = <>
            <span>{`${datasource.length} ${datasource.length > 1 ? 'reviews' : 'review'}`}</span>
        </>

        return (
            <PageHeader
                style={{ width: "100%", minWidth: 900 }}
                backIcon={false}
                title={`${this.props.course?.subject} ${this.props.course?.code} - ${this.props.course?.name}`}
                extra={this.state.hide && <Button onClick={() => this.setState({ visible: true })} type="primary">Write a review!</Button>}
            >
                {content}
                <Row gutter={24} >
                    {
                        <Col style={{width: 300}}>
                            <Affix offsetTop={26}>
                                <Layout>
                                <Card bordered={false}>
                                    <List header="Filters">
                                        <Space style={{ width: '100%', marginTop: 10 }} direction='vertical'>
                                            <span>Semesters</span>
                                            <Select key={userreview?.userID} mode="tags" style={{ width: '100%' }} placeholder="Semesters"
                                                    value={this.state.filters.semesters}
                                                    onDeselect={(value) => {
                                                        if (value === "All" && this.state.filters.semesters.length === 1)
                                                            return
                                                        if (this.state.filters.semesters.length === 1)
                                                            this.setState({
                                                                filters: {
                                                                    ...this.state.filters,
                                                                    semesters: ["All"]
                                                                }
                                                            })
                                                        else  
                                                            this.setState({
                                                                filters: {
                                                                    ...this.state.filters,
                                                                    semesters: this.state.filters.semesters.filter(semester => semester !== value)
                                                                }
                                                            })
                                                    }}
                                                    onSelect={(value) => {
                                                        if (value === "All")
                                                            this.setState({
                                                                filters: {
                                                                    ...this.state.filters,
                                                                    semesters: ["All"]
                                                                }
                                                            });
                                                        else
                                                            this.setState({
                                                                filters: {
                                                                    ...this.state.filters,
                                                                    semesters: [...this.state.filters.semesters.filter(semester => semester !== "All"), value]
                                                                }
                                                            })
                                                    }}
                                                    options={
                                                        [{value: 'All'}, 
                                                        ...semesters.map(semester => ({
                                                            value: semester
                                                        }))]
                                                    }>
                                            </Select>
                                            <span>Minimum Overall Rating</span>
                                            <Rate allowHalf allowClear onChange={value => this.setState({filters:{...this.state.filters, minimumrating: value}})}></Rate>
                                        </Space>
                                    </List>
                                </Card>
                                <Card bordered={false} style={{marginTop: 5}}>
                                    <List header="Sort by">
                                        <Radio.Group onChange={this.onSortOrderChange} style={{marginTop: 10}} defaultValue="Descending">
                                            <Radio style={{ display: 'block' }} value={"Ascending"}>Ascending</Radio>
                                            <Radio style={{ display: 'block' }} value={"Descending"}>Descending</Radio>
                                        </Radio.Group>
                                        <Divider style={{margin: '10px 0'}}></Divider>
                                        <Radio.Group defaultValue="Date">
                                            <Radio style={{ display: 'block' }} value={"Semester"}>Semester</Radio>
                                            <Radio style={{ display: 'block' }} value={"Rating"}>Course Rating</Radio>
                                            <Radio style={{ display: 'block' }} value={"Date"}>Date</Radio>
                                        </Radio.Group>
                                    </List>
                                    </Card>
                                    </Layout>
                            </Affix>
                        </Col>
                    }
                    {<Col flex={1}>
                        {userreview && <List
                            itemLayout="horizontal"
                            header={"Your review"}>
                            <Review reviewID={userreview.reviewID} />
                        </List>}
                        <List
                    dataSource={datasource}
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