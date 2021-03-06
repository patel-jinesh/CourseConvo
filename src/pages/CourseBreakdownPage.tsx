import { FrownOutlined } from '@ant-design/icons';
import { Affix, Button, Card, Col, Divider, Drawer, Layout, List, PageHeader, Radio, Result, Row, Select, Space, Tag } from "antd";
import { History, Location } from "history";
import moment from 'moment';
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { match, withRouter } from "react-router-dom";
import { RootState } from "../app/store";
import { USERID } from '../backend/database';
import Breakdown from '../components/Breakdown';
import AddBreakdownForm from '../components/forms/AddBreakdownForm';
import { Assessments } from '../data/types';
import { remove } from '../features/courses/breakdown';

type ComponentProps = {
    match: match,
    location: Location,
    history: History,
}

type ComponentState = {
    visible: boolean,
    hide: boolean,
    filters: {
        semesters: string[]
        assessments: string[]
    },
    sortorder: "Ascending" | "Descending",
    sortprop: "Assessments" | "Semester"
}

const mapState = (state: RootState, props: ComponentProps) => {
    let queryID = (new URLSearchParams(props.location.search)).get('courseID')!;

    return {
        userbreakdown: Object.values(state.breakdowns).find(breakdown => breakdown.userID === USERID && state.instances[breakdown.instanceID].courseID === queryID),
        breakdowns: Object.values(state.breakdowns).filter(breakdown => state.instances[breakdown.instanceID].courseID === queryID),
        users: state.users,
        instances: Object.fromEntries(Object.entries(state.instances).filter(([instanceID, instance]) => instance.courseID === queryID)),
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

//Course breakdown page
class CourseBreakdownsPage extends React.Component<Props, State> {
    state: State = {
        visible: false,
        hide: false,
        filters: {
            semesters: ["All"],
            assessments: ["All"]
        },
        sortorder: "Descending",
        sortprop: "Semester"
    }

    render() {
        let content: JSX.Element | undefined = undefined;

        if (!this.props.userbreakdown && !this.state.hide) {
            content = <Result
                status='warning'
                icon={< FrownOutlined />}
                title="Seems like you haven't written a breakdown for this course!"
                subTitle="If you have taken the course, you can add one by clicking the button below!"
                extra={
                    <>
                        <Button onClick={() => this.setState({ visible: true })} type="primary">Write a breakdown!</Button>
                        <Button onClick={() => this.setState({ hide: true })}>Hide</Button>
                    </>
                } />
        }

        let semesters = this.props.breakdowns
            .filter(breakdown => breakdown.userID !== USERID)
            .map(breakdown => `${this.props.instances[breakdown.instanceID].term} ${this.props.instances[breakdown.instanceID].year}`)
            .unique()
            .sort()
            .reverse();

        let assessments = Object.values(Assessments)
            .map(assessment => `${assessment}`)
            .unique()
            .sort();

        let datasource = this.props.breakdowns.reverse()
            .filter(breakdown => breakdown.userID !== USERID)
            .filter(breakdown => {
                let semester = `${this.props.instances[breakdown.instanceID].term} ${this.props.instances[breakdown.instanceID].year}`;
                let matchSemester = this.state.filters.semesters.includes("All") || this.state.filters.semesters.includes(semester)
                let matchAssessments = this.state.filters.assessments.includes("All") || this.state.filters.assessments.some(item => breakdown.marks.map(mark => mark.type).includes(item));

                return matchSemester && matchAssessments;
            })
            .sort((a, b) => {
                return b.breakdownID.localeCompare(a.breakdownID);
            })
            .sort((a, b) => {
                if (this.state.sortprop === "Assessments")
                    return b.marks.length - a.marks.length;

                let asem = `${this.props.instances[a.instanceID].term} ${this.props.instances[a.instanceID].year}`;
                let bsem = `${this.props.instances[b.instanceID].term} ${this.props.instances[b.instanceID].year}`;

                return bsem.localeCompare(asem);
            })
            .map(breakdown => ({
                breakdownID: breakdown.breakdownID,
                instanceID: breakdown.instanceID
            }))

        if (this.state.sortorder === "Ascending")
            datasource = datasource.reverse();
        
        let data: {
            [instanceID: string]: {
                [assessmentID: string]: string[]
            }
        } = {};

        for (let { breakdownID, instanceID } of datasource) {
            let marks = [...this.props.breakdowns.find(breakdown => breakdown.breakdownID === breakdownID)!.marks].sort((a, b) => a.type.localeCompare(b.type));
            let assessmentID = marks.reduce((res, mark) => `${res} ${mark.type}@${mark.count}@${mark.weight}`, "");

            if (data[instanceID]) {
                if (data[instanceID][assessmentID]) {
                    data[instanceID][assessmentID].push(breakdownID);
                } else {
                    data[instanceID][assessmentID] = [breakdownID]
                }
            } else {
                data[instanceID] = {
                    [assessmentID]: [breakdownID]
                }
            }
        }

        let dsource = Object.entries(data).map(([instanceID, bucket]) => {
            return Object.values(bucket).map((breakdownIDs) => ({
                breakdownID: breakdownIDs[0],
                instanceID: instanceID,
                extra: breakdownIDs.length - 1
            })).flat()
        }).flat();

        let header = <>
            <span>{`Search results - ${dsource.length} ${dsource.length !== 1 ? 'unique breakdowns' : 'unique breakdown'}`}</span>
        </>

        return (
            <PageHeader
                style={{ width: "100%", minWidth: 900 }}
                backIcon={false}
                title={`${this.props.course?.subject} ${this.props.course?.code} - ${this.props.course?.name}`}
                extra={!this.props.userbreakdown && this.state.hide && <Button onClick={() => this.setState({ visible: true })} type="primary">Write a breakdown!</Button>}
            >
                {content}
                <Row gutter={24}>
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
                                                    key={this.props.userbreakdown?.userID} mode="tags" style={{ width: '100%' }} placeholder="Semesters"
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
                                            <span>Assessments</span>
                                                <Select
                                                    tagRender={props => <Tag {...{ ...props, closable: props.value !== "All" }}>{props.label}</Tag>}
                                                    getPopupContainer={trigger => trigger.parentElement}
                                                    key={this.props.userbreakdown?.userID} mode="tags" style={{ width: '100%' }} placeholder="Assessments"
                                                    value={this.state.filters.assessments}
                                                    onDeselect={(value) => {
                                                        if (value === "All" && this.state.filters.assessments.length === 1)
                                                            return
                                                        if (this.state.filters.assessments.length === 1)
                                                            this.setState({
                                                                filters: {
                                                                    ...this.state.filters,
                                                                    assessments: ["All"]
                                                                }
                                                            })
                                                        else  
                                                            this.setState({
                                                                filters: {
                                                                    ...this.state.filters,
                                                                    assessments: this.state.filters.assessments.filter(assessment => assessment !== value)
                                                                }
                                                            })
                                                    }}
                                                    onSelect={(value) => {
                                                        if (value === "All")
                                                            this.setState({
                                                                filters: {
                                                                    ...this.state.filters,
                                                                    assessments: ["All"]
                                                                }
                                                            });
                                                        else
                                                            this.setState({
                                                                filters: {
                                                                    ...this.state.filters,
                                                                    assessments: [...this.state.filters.assessments.filter(assessment => assessment !== "All"), value]
                                                                }
                                                            })
                                                    }}
                                                    options={
                                                        [{value: 'All'}, 
                                                        ...assessments.map(assessment => ({
                                                            value: assessment
                                                        }))]
                                                    }>
                                            </Select>
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
                                        <Radio.Group onChange={e => this.setState({ sortprop: e.target.value })} defaultValue="Semester">
                                            <Radio style={{ display: 'block' }} value={"Semester"}>Semester</Radio>
                                            <Radio style={{ display: 'block' }} value={"Assessments"}>Number of Assessments</Radio>
                                        </Radio.Group>
                                    </List>
                                    </Card>
                                    </Layout>
                            </Affix>
                        </Col>
                    }
                    {<Col style={{width: 'calc(100% - 300px)'}}>
                        {this.props.userbreakdown && <List
                            itemLayout="vertical"
                            header={<Row align='middle'>
                                <Col flex={1}>Your breakdown</Col>
                                <Col>
                                    <Space direction='horizontal'>
                                        <Button onClick={() => this.setState({visible: true})} type='primary'>Edit</Button>
                                        <Button onClick={() => this.props.remove(this.props.userbreakdown!.breakdownID)} type='primary' danger>Delete</Button>
                                    </Space>
                                </Col>
                            </Row>}
                        >
                            <Breakdown instanceID={this.props.userbreakdown.instanceID} breakdownID={this.props.userbreakdown.breakdownID} />
                        </List>}
                        <List
                            rowKey={breakdown => breakdown.breakdownID}
                    dataSource={dsource}
                    header={header}
                    itemLayout="vertical"
                    renderItem={props => <Breakdown {...props} />}/>
                    </Col>}
                </Row>
                <Drawer
                    destroyOnClose
                    onClose={() => this.setState({ visible: false })}
                    title={this.props.userbreakdown ? "Edit breakdown" : "Write a breakdown"}
                    width={567}
                    visible={this.state.visible}>
                    <AddBreakdownForm
                        initialValues={this.props.userbreakdown ? {
                            assessments: this.props.userbreakdown.marks,
                            term: this.props.instances[this.props.userbreakdown.instanceID]?.term,
                            year: moment(`${this.props.instances[this.props.userbreakdown.instanceID]?.year}`),
                            instructor: this.props.instances[this.props.userbreakdown.instanceID]?.instructor,
                        } : {assessments: [undefined]}}
                        key={this.props.userbreakdown?.breakdownID}
                        courseID={this.props.course.courseID}
                        breakdownID={this.props.userbreakdown?.breakdownID}
                        onFinish={() => this.setState({ visible: false })}
                        onCancel={() => this.setState({ visible: false })} />
                </Drawer>
            </PageHeader>
        );
    }
}

export default withRouter(connector(CourseBreakdownsPage));