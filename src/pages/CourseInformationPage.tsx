import { Layout, PageHeader, Select, Tabs, Statistic, Descriptions, Badge, Button } from "antd";
import { History, Location } from "history";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { match, withRouter } from "react-router-dom";
import { PlusOutlined } from '@ant-design/icons';
import { RootState } from "../app/store";
import Review from "../components/Review";
import Breakdown from "../components/Breakdown";

import {
    FlexibleXYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    Crosshair,
    LineMarkSeries,
    Voronoi
} from 'react-vis';
import { Term, Status } from "../data/types";

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

        console.log(minsem, maxsem);
        console.log(data);

        let formatter = (v: number) => {
            if (v % 1 === 0) return `${Term.WINTER} ${v}`;
            if (v % 1 === 0.25) return `${Term.SPRING} ${v - 0.25}`;
            if (v % 1 === 0.5) return `${Term.SUMMER} ${v - 0.5}`;
            if (v % 1 === 0.75) return `${Term.FALL} ${v - 0.75}`;
            return "?";
        }

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
                                <Statistic title="Course Average" valueRender={() => <FlexibleXYPlot xPadding={0.25} margin={{bottom: 100}} height={400} yDomain={[-1, 13]}>
                                    <VerticalGridLines style={{ stroke: 'rgb(100, 100, 100)' }} />
                                    <XAxis height={400} tickValues={ticks} tickLabelAngle={-45} tickFormat={v => formatter(v)} title="Semester" style={{ text: { fill: 'white' }, title: { fill: 'white' } }} />
                                    <YAxis tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} style={{ text: { fill: 'white' } }} />
                                    <LineMarkSeries curve={'curveMonotoneX'} style={{ fill: "none" }} data={data} />
                                    {/* <Crosshair
                                        values={this.state.crosshairValues}
                                        className={'test-class-name'}
                                    /> */}
                                </FlexibleXYPlot>}>

                                </Statistic>
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