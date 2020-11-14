import { FrownOutlined } from '@ant-design/icons';
import { Affix, Button, Card, Col, Divider, Drawer, Layout, List, PageHeader, Radio, Result, Row, Select, Space, Tag } from "antd";
import { History, Location } from "history";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { match, withRouter } from "react-router-dom";
import { RootState } from "../app/store";
import { USERID } from '../backend/database';
import { remove } from '../features/courses/breakdown';
import Breakdown from '../components/Breakdown';
import AddBreakdownForm from '../components/forms/AddBreakdownForm';
import moment from 'moment';

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

class CourseBreakdownsPage extends React.Component<Props, State> {
    state: State = {
        visible: false,
        hide: false,
        filters: {
            semesters: ["All"]
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
            .sort();

        let datasource = this.props.breakdowns.reverse()
            .filter(breakdown => breakdown.userID !== USERID)
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

        let header = <>
            <span>{`Search results - ${datasource.length} ${datasource.length !== 1 ? 'breakdowns' : 'breakdown'}`}</span>
        </>

        return (
            <PageHeader
                style={{ width: "100%", minWidth: 900 }}
                backIcon={false}
                title={`${this.props.course?.subject} ${this.props.course?.code} - ${this.props.course?.name}`}
                extra={this.state.hide && <Button onClick={() => this.setState({ visible: true })} type="primary">Write a breakdown!</Button>}
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
                    dataSource={datasource}
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
                            lecture: this.props.instances[this.props.userbreakdown.instanceID].lecture,
                            term: this.props.instances[this.props.userbreakdown.instanceID]?.term,
                            year: moment(`${this.props.instances[this.props.userbreakdown.instanceID]?.year}`),
                            instructor: this.props.instances[this.props.userbreakdown.instanceID]?.instructor,
                        } : undefined}
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