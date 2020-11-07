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
        reviews: Object.values(state.courses).filter(course => course.courseID === queryID),
        semesters: Object.values(state.courses).filter(course => {
            let matchSubject = course.identifier.subject === state.courses[queryID].identifier.subject;
            let matchCode = course.identifier.code === state.courses[queryID].identifier.code;
            return matchSubject && matchCode;
        }).map(course => ({
            semester: course.semester,
            courseID: course.courseID
        })),
        course: state.courses[queryID]
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
            defaultValue={`${this.props.course.semester.term} ${this.props.course.semester.year}`}
            onSelect={(value, option) => {
                this.props.history.push({ pathname: '/information', search: `?id=${option.courseID}` })
            }}
            options={this.props.semesters.map(option => ({
            value: `${option.semester.term} ${option.semester.year}`,
            courseID: option.courseID
        }))}>
        </Select>
        return (
            <PageHeader
                style={{ width: "100%" }}
                backIcon={false}
                title={`${this.props.course?.identifier.subject} ${this.props.course?.identifier.code} - ${this.props.course?.name}`}
                subTitle={selectSemester}
                footer={
                    <Tabs defaultActiveKey="0">
                        <TabPane tab="Statistics" key="0">
                            <Content style={{ paddingTop: 20 }}>
                                <p>Stats stuff</p>
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