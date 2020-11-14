import { FrownOutlined } from '@ant-design/icons';
import { Affix, Button, Card, Col, Divider, Drawer, Layout, List, PageHeader, Radio, Result, Row, Select, Space, Tag } from "antd";
import { History, Location } from "history";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { match, withRouter } from "react-router-dom";
import { RootState } from "../app/store";
import { USERID } from '../backend/database';
import ReviewForm from '../components/forms/ReviewForm';
import NumericRate from '../components/NumericRate';
import Review from '../components/Review';
import ReportForm from '../components/forms/ReportForm';
import moment from 'moment';
import { remove } from '../features/courses/review';

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
        userreview: Object.values(state.reviews).find(review => review.userID === USERID && state.instances[review.instanceID].courseID === queryID),
        reviews: Object.values(state.reviews).filter(review => state.instances[review.instanceID].courseID === queryID),
        users: state.users,
        instances: Object.fromEntries(Object.entries(state.instances).filter(([instnaceID, instance]) => instance.courseID === queryID)),
        course: state.courses[queryID],
    }
};

const mapDispatch = {
    remove: remove
}

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

    render() {
        let content: JSX.Element | undefined = undefined;

        if (!this.props.userreview && !this.state.hide) {
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

        let semesters = this.props.reviews
            .filter(review => review.userID !== USERID)
            .map(review => `${this.props.instances[review.instanceID].term} ${this.props.instances[review.instanceID].year}`)
            .unique()
            .sort();

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
            .sort((a, b) => {
                return b.reviewID.localeCompare(a.reviewID);
            })
            .sort((a, b) => {
                if (this.state.sortprop === "Date")
                    return b.datetime - a.datetime;
                
                if (this.state.sortprop === "Rating") {
                    let arating = (a.difficulty + a.workload + a.enjoyability) / 3;
                    let brating = (b.difficulty + b.workload + b.enjoyability) / 3;

                    return brating - arating;
                }

                let asem = `${this.props.instances[a.instanceID].term} ${this.props.instances[a.instanceID].year}`;
                let bsem = `${this.props.instances[b.instanceID].term} ${this.props.instances[b.instanceID].year}`;

                return bsem.localeCompare(asem);
            })
            .map(review => ({
                reviewID: review.reviewID,
                replyable: true,
                showreplies: true,
                editable: true
            }))
        
        if (this.state.sortorder === "Ascending")
            datasource = datasource.reverse();

        let header = <>
            <span>{`Search results - ${datasource.length} ${datasource.length !== 1 ? 'reviews' : 'review'}`}</span>
        </>

        return (
            <PageHeader
                style={{ width: "100%", minWidth: 900 }}
                backIcon={false}
                title={`${this.props.course?.subject} ${this.props.course?.code} - ${this.props.course?.name}`}
                extra={this.state.hide && <Button onClick={() => this.setState({ visible: true })} type="primary">Write a review!</Button>}
            >
                {content}
                <Row gutter={24} wrap={false}>
                    {
                        <Col style={{ width: 300 }} flex="none">
                            <Affix offsetTop={26}>
                                <Layout>
                                <Card bordered={false}>
                                    <List header="Filters">
                                        <Space style={{ width: '100%', marginTop: 10 }} direction='vertical'>
                                            <span>Semesters</span>
                                                <Select
                                                    tagRender={props => <Tag {...{ ...props, closable: props.value !== "All" }}>{props.label}</Tag>}
                                                    getPopupContainer={trigger => trigger.parentElement}
                                                    key={this.props.userreview?.userID} mode="tags" style={{ width: '100%' }} placeholder="Semesters"
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
                                            <NumericRate onChange={value => this.setState({filters:{...this.state.filters, minimumrating: value}})}></NumericRate>
                                        </Space>
                                    </List>
                                </Card>
                                <Card bordered={false} style={{marginTop: 5}}>
                                    <List header="Sort by">
                                        <Radio.Group onChange={e => this.setState({ sortorder: e.target.value })} style={{marginTop: 10}} defaultValue="Descending">
                                            <Radio style={{ display: 'block' }} value={"Ascending"}>Ascending</Radio>
                                            <Radio style={{ display: 'block' }} value={"Descending"}>Descending</Radio>
                                        </Radio.Group>
                                        <Divider style={{margin: '10px 0'}}></Divider>
                                        <Radio.Group onChange={e => this.setState({ sortprop: e.target.value })} defaultValue="Date">
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
                    {<Col style={{width: 'calc(100% - 300px)'}}>
                        {this.props.userreview && <List
                            itemLayout="vertical"
                            header={<Row align='middle'>
                                <Col flex={1}>Your Review</Col>
                                <Col>
                                    <Space direction='horizontal'>
                                        <Button onClick={() => this.setState({visible: true})} type='primary'>Edit</Button>
                                        <Button onClick={() => this.props.remove(this.props.userreview!.reviewID)} type='primary' danger>Delete</Button>
                                    </Space>
                                </Col>
                            </Row>}
                        >
                            <Review showreplies reviewID={this.props.userreview.reviewID} />
                        </List>}
                        <List
                            rowKey={review => review.reviewID}
                    dataSource={datasource}
                    header={header}
                    itemLayout="vertical"
                    renderItem={props => <Review {...props} />}/>
                    </Col>}
                </Row>
                <Drawer
                    destroyOnClose
                    onClose={() => this.setState({ visible: false })}
                    title={this.props.userreview ? "Edit review" : "Write a review"}
                    width={467}
                    visible={this.state.visible}>
                    <ReviewForm
                        courseID={this.props.course.courseID}
                        reviewID={this.props.userreview?.reviewID}
                        initialValues={this.props.userreview ? {
                            term: this.props.instances[this.props.userreview.instanceID]?.term,
                            year: moment(`${this.props.instances[this.props.userreview.instanceID]?.year}`),
                            instructor: this.props.instances[this.props.userreview.instanceID]?.instructor,
                            difficulty: this.props.userreview.difficulty,
                            enjoyability: this.props.userreview.enjoyability,
                            workload: this.props.userreview.workload,
                            comment: this.props.userreview.comment,
                            anonymous: this.props.userreview.isAnonymous
                        } : undefined}
                        onFinish={() => this.setState({ visible: false })}
                        onCancel={() => this.setState({ visible: false })} />
                </Drawer>
            </PageHeader>
        );
    }
}

export default withRouter(connector(CourseReviewsPage));