import { Layout, PageHeader, Select, Tabs } from "antd";
import { History, Location } from "history";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { match, withRouter } from "react-router-dom";
import { RootState } from "../app/store";

const { Content } = Layout;
const { TabPane } = Tabs;

type ComponentProps = {
    match: match,
    location: Location,
    history: History,
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => {
    let queryID = (new URLSearchParams(props.location.search)).get('id')!;

    return {
        reviews: Object.values(state.reviews).filter(review => review.instanceID === queryID),
        course: state.courses[state.instances[queryID].courseID],
        instance: state.instances[queryID],
        semesters: Object.values(state.instances)
            .filter(instance => instance.courseID === state.instances[queryID].courseID)
            .map(instance => ({
                term: instance.term,
                year: instance.year,
                courseID: instance.courseID
            }))
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
            style={{width: 150}}
            defaultValue={`${this.props.instance.term} ${this.props.instance.year}`}
            onSelect={(value, option) => {
                this.props.history.push({ pathname: '/information', search: `?id=${option.courseID}` })
            }}
            options={this.props.semesters.map(semester => ({
                value: `${semester.term} ${semester.year}`,
                courseID: semester.courseID
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

                            </Content>
                        </TabPane>
                        <TabPane tab="Top Breakdowns" key="1">
                            <Content style={{ paddingTop: 20 }}>
                                <p>Top Breakdown stuff</p>
                            </Content>
                        </TabPane>
                        <TabPane tab="Top Reviews" key="2">
                            <Content style={{ paddingTop: 20 }}>
                                <p>Top Reviews stuff</p>
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