import { AutoComplete, Affix, Button, Card, Col, List, Form, PageHeader, Row, Space, Statistic, Tooltip, Typography } from 'antd';
import { Input, Select, InputNumber, Layout } from 'antd';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../app/store';
import { match, withRouter } from 'react-router-dom';
import { History, Location } from "history";
import SearchCourseForm from '../components/forms/SearchCourseForm';
import { FormInstance } from 'antd/lib/form';
import NumericRate from '../components/NumericRate';
import { mapForm } from '../utilities/formUtils'
import SmileRate from '../components/SmileRate';

const { Option } = AutoComplete;

type ComponentProps = {
    match: match,
    location: Location,
    history: History,
}
type ComponentState = {
    subject?: string,
    enjoyability?: number,
    difficulty?: number,
    workload?: number,
    overallRating?: number
}



const mapState = (state: RootState) => ({
    instances: state.instances,
    courses: state.courses
});

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState

class ElectivePage extends React.Component<Props, State> {
    formSearchCourse = React.createRef<FormInstance>();
    state: State = {};
    content = {};
    onSearch = (values: any) => {
        this.setState({ ...values });
    }

    autocomplete = (subject: any) => {
        return Object.values(this.props.courses).map((course) => {
            return course.subject
        }).unique().map((subject) => {
            return { value: subject }
        })
    }

    filterElectives = () => {



    }


    render() {
        return (
            //Page header
            <PageHeader
                title="Elective Suggestions Page" style={{ width: "100%" }}>

                <Row style={{ height: "100%" }}>
                    <Col style={{ width: "275px" }}>
                        <Affix offsetTop={50}>
                            <Card bordered={false} title="Elective Filter Options">
                                <Space direction='vertical'>
                                    <span> Course:</span>
                                    <AutoComplete placeholder="Course" style={{ width: "200px" }}
                                        onChange={this.onSearch}
                                        filterOption={(i, o) => o?.value.indexOf(i.toUpperCase()) === 0}
                                        options={this.autocomplete(this.state.subject)}
                                    > </AutoComplete>

                                    <span> Overall Rating</span>
                                    <SmileRate className="overallRating" value={this.state.overallRating ?? 0}
                                        onChange={(value) => this.setState({ overallRating: value })}></SmileRate>

                                    <span> Enjoyability</span>
                                    <SmileRate className="enjoyability" value={this.state.enjoyability ?? 0}
                                        onChange={(value) => this.setState({ enjoyability: value })}></SmileRate>

                                    <span> Workload </span>
                                    <SmileRate className="workload" value={this.state.workload ?? 0}
                                        onChange={(value) => this.setState({ workload: value })}></SmileRate>

                                    <span> Difficulty</span>
                                    <SmileRate className="difficulty" value={this.state.difficulty ?? 0}
                                        onChange={(value) => this.setState({ difficulty: value })}></SmileRate>

                                </Space>
                            </Card>
                        </Affix>
                    </Col>
                </Row>
            </PageHeader >
        );
    }
}

export default withRouter(connector(ElectivePage));