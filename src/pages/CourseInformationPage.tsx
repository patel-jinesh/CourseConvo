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
    let instanceID = query.get('instanceID')!;
    let courseID = query.get('courseID')!;

    return {
        breakdowns: Object.values(state.breakdowns).filter(breakdown => breakdown.instanceID === instanceID),
        records: Object.values(state.records).filter(record => state.instances[record.instanceID].courseID === courseID && record.status === Status.TAKEN),
        reviews: Object.values(state.reviews).filter(review => review.instanceID === instanceID),
        course: state.courses[state.instances[instanceID].courseID],
        instance: state.instances[instanceID],
        instances: Object.fromEntries(Object.entries(state.instances).filter(([_, instance]) => instance.courseID === state.instances[instanceID].courseID))
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
        let selectSemester = <Select
            size='large'
            style={{ width: 150 }}
            defaultValue={`${this.props.instance.term} ${this.props.instance.year}`}
            onSelect={(value, option) => {
                this.props.history.push({ pathname: '/information', search: `?instanceID=${option.instanceID}` })
            }}
            options={Object.values(this.props.instances).map(instance => ({
                value: `${instance.term} ${instance.year}`,
                instnaceID: instance.instanceID
            }))}>
        </Select>

        return (
            <PageHeader
                style={{ width: "100%" }}
                backIcon={false}
                title={`${this.props.course?.subject} ${this.props.course?.code} - ${this.props.course?.name}`}
                subTitle={selectSemester}
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