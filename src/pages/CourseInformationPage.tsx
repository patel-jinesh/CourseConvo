import { PlusOutlined } from '@ant-design/icons';
import { Button, Layout, PageHeader, Statistic, Tabs } from "antd";
import { History, Location } from "history";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { match, withRouter } from "react-router-dom";
import { RootState } from "../app/store";
import Breakdown from "../components/Breakdown";
import GPAGraph from "../components/graphs/GPAGraph";
import Review from "../components/Review";
import { Status, Term } from "../data/types";


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
        let counts: { [semester: string]: { total: number, count: number } } = {};
        let minsem: { term: Term, year: number } | undefined = undefined;
        let maxsem: { term: Term, year: number } | undefined = undefined;

        let termmap = {
            [Term.WINTER]: 0,
            [Term.SPRING]: 1,
            [Term.SUMMER]: 2,
            [Term.FALL]: 3,
        }
        let termmaprev = [
            Term.WINTER,
            Term.SPRING,
            Term.SUMMER,
            Term.FALL,
        ]


        for (let record of this.props.records) {
            let instance = this.props.instances[record.instanceID];
            let term = instance.term;
            let year = instance.year;
            let semester = `${term} ${year}`;

            counts[semester] = {
                total: (counts[semester]?.total ?? 0) + record.grade!,
                count: (counts[semester]?.count ?? 0) + 1
            }

            minsem = minsem === undefined || year < minsem.year || (year === minsem.year && termmap[minsem.term] < termmap[term])
                ? { term: term, year: year }
                : minsem;
            maxsem = maxsem === undefined || year > maxsem.year || (year === maxsem.year && termmap[maxsem.term] > termmap[term])
                ? { term: term, year: year }
                : maxsem;
        }

        let averages = Object.entries(counts).reduce<{ [semester: string]: number }>((r, [semester, { total, count }]) => ({
            ...r,
            [semester]: total / count
        }), {});

        let data: any[] = [];
        let ticks: number[] = [];

        for (let semval = minsem!.year + (termmap[minsem!.term] / 4); semval <= maxsem!.year + (termmap[maxsem!.term] / 4); semval += 0.25) {
            let semester = `${termmaprev[(semval % 1) * 4]} ${semval - (semval % 1)}`;

            if (averages[semester] !== undefined)
                data.push({ x: semval, y: averages[semester] });
            
            ticks.push(semval);
        }

        return (
            <PageHeader
                style={{ width: "100%" }}
                backIcon={false}
                title={`${this.props.course?.subject} ${this.props.course?.code} - ${this.props.course?.name}`}
                footer={
                    <Tabs defaultActiveKey="0">
                        <TabPane tab="Statistics" key="0">
                            <Content style={{ paddingTop: 20 }}>
                                <Statistic className="noselect" title="Course Average" valueRender={() => <GPAGraph records={this.props.records} />}></Statistic>
                            </Content>
                        </TabPane>
                        <TabPane tab="Top Breakdowns" key="1">
                            <Button style={{ marginTop: 30 }} type="primary" icon={<PlusOutlined />}>Add Breakdown</Button>
                            <Content style={{ paddingTop: 20 }}>
                                {this.props.breakdowns.map(breakdown => {
                                    return <Breakdown breakdownID={breakdown.breakdownID} instanceID={breakdown.instanceID} key={breakdown.breakdownID} />
                                })}
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