import { PlusOutlined } from '@ant-design/icons';
import { Layout, PageHeader, Select, Tabs, Statistic, Descriptions, Badge, Button, Drawer } from "antd";
import { History, Location } from "history";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { match, withRouter } from "react-router-dom";
import { RootState } from "../app/store";
import Breakdown from "../components/Breakdown";
import GPAGraph from "../components/graphs/GPAGraph";
import Review from "../components/Review";
import { Status, Term, ReviewTag } from "../data/types";
import TopReviewList from '../components/TopReviewList';
import moment from 'moment';

import AcademicRecordForm from "../components/forms/AcademicRecordForm";
import AddBreakdownForm from "../components/forms/AddBreakdownForm";
import InstructorGraph from '../components/graphs/InstructorGraph';

const { Content } = Layout;
const { TabPane } = Tabs;

type ComponentProps = {
    match: match,
    location: Location,
    history: History,
}

type ComponentState = {
    visible: boolean,
    recordID?: string
}

const mapState = (state: RootState, props: ComponentProps) => {
    let query = new URLSearchParams(props.location.search)
    let courseID = query.get('courseID')!;

    return {
        breakdowns: Object.values(state.breakdowns).filter(breakdown => state.instances[breakdown.instanceID].courseID === courseID),
        records: Object.values(state.records).filter(record => state.instances[record.instanceID].courseID === courseID && record.status === Status.TAKEN),
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
    state: State = {
        visible: false,
    }

    onAdd = () => {
        this.setState({ visible: true })
    }

    render() {
        let instance = Object.values(this.props.instances).find(instance => instance.courseID === this.props.course.courseID);

        return (
            <PageHeader
                style={{ width: "100%" }}
                backIcon={false}
                title={`${this.props.course?.subject} ${this.props.course?.code} - ${this.props.course?.name}`}
                footer={
                    instance && <Tabs defaultActiveKey="0" onChange={(key) => {
                        if (key === "0")
                            window.dispatchEvent(new Event('resize'))
                    }}>
                        <TabPane tab="Statistics" key="0">
                            <Content style={{ paddingTop: 20 }}>
                                <Statistic className="noselect" title="Course Stats by Semester" valueRender={() => <GPAGraph records={this.props.records} />}></Statistic>
                                <Statistic className="noselect" title="Course Stats by Instructor" valueRender={() =>
                                    <InstructorGraph records={this.props.records} />
                                }>
                                </Statistic>
                            </Content>
                        </TabPane>
                        <TabPane tab="Top Breakdowns" key="1">
                            <Content style={{ paddingTop: 20 }}>
                                {this.props.breakdowns.map(breakdown => {
                                    return <Breakdown breakdownID={breakdown.breakdownID} instanceID={breakdown.instanceID} key={breakdown.breakdownID} />
                                })}
                            </Content>
                        </TabPane>
                        <TabPane tab="Top Reviews" key="2">
                            <Content style={{ paddingTop: 20 }}>
                                <TopReviewList></TopReviewList>
                            </Content>
                        </TabPane>
                    </Tabs>
                }>
                <p>Overview Information</p>
                <Drawer
                    destroyOnClose
                    onClose={() => this.setState({ visible: false, recordID: undefined })}
                    title="Create course breakdown"
                    width={467}
                    visible={this.state.visible}>
                    <AddBreakdownForm
                        key={this.state.recordID ?? "add"}
                        breakdownID={"Hi"}
                        courseID={"Hi"}
                        onFinish={() => this.setState({ visible: false, recordID: undefined })}
                        onCancel={() => this.setState({ visible: false, recordID: undefined })} />
                </Drawer>
            </PageHeader>
        );
    }
}

export default withRouter(connector(CourseInformationPage));