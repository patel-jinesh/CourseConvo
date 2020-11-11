import { Layout, PageHeader, Select, Tabs, Statistic } from "antd";
import { History, Location } from "history";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { match, withRouter } from "react-router-dom";
import { RootState } from "../app/store";
import Review from "../components/Review";

import { Term, Status } from "../data/types";
import GPAGraph from "../components/graphs/GPAGraph";

const { Content } = Layout;
const { TabPane } = Tabs;

type ComponentProps = {
    match: match,
    location: Location,
    history: History,
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => {
    let query = new URLSearchParams(props.location.search)
    let courseID = query.get('courseID')!;

    return {
        breakdowns: Object.values(state.breakdowns).filter(breakdown => state.instances[breakdown.instanceID].courseID === courseID),
        records: Object.values(state.records).filter(record => state.instances[record.instanceID].courseID === courseID && record.status === Status.TAKEN),
        reviews: Object.values(state.reviews).filter(review => state.instances[review.instanceID].courseID === courseID),
        course: state.courses[courseID],
        instances: Object.fromEntries(Object.entries(state.instances).filter(([_, instance]) => instance.courseID === courseID))
    }
}

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState

class CourseInformationPage extends React.Component<Props, State> {
    state: State = {}

    render() {
        return (
            <PageHeader
                style={{ width: "100%" }}
                backIcon={false}
                title={`${this.props.course?.subject} ${this.props.course?.code} - ${this.props.course?.name}`}
                footer={
                    <Tabs defaultActiveKey="0">
                        <TabPane tab="Statistics" key="0">
                            <Content style={{ paddingTop: 20 }}>
                                <Statistic className="noselect" title="Course Average" valueRender={() => <GPAGraph records={this.props.records} />}>

                                </Statistic>
                            </Content>
                        </TabPane>
                        <TabPane tab="Top Breakdowns" key="1">
                            <Content style={{ paddingTop: 20 }}>
                                <p>Top Breakdown stuff</p>
                            </Content>
                        </TabPane>
                        <TabPane tab="Top Reviews" key="2">
                            <Content style={{ paddingTop: 20 }}>
                                {this.props.reviews.map(review => {
                                    return <Review reviewID={review.reviewID} key={review.reviewID} />
                                })}
                            </Content>
                        </TabPane>
                    </Tabs>
                }>
                <p>Overview Information</p>
            </PageHeader>
        );
    }
}

export default withRouter(connector(CourseInformationPage));