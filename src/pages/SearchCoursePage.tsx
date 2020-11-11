import { CommentOutlined, InfoCircleOutlined, PieChartOutlined } from '@ant-design/icons';
import { FrownOutlined } from '@ant-design/icons';
import { Form, Layout, PageHeader, Result, Space, List, Button, Tooltip, Row, Col, Radio, Card, Affix, Divider, Checkbox, Select, Tag, Pagination } from "antd";
import { History, Location } from "history";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { match, withRouter } from "react-router-dom";
import { RootState } from "../app/store";
import CreateCourseForm from "../components/forms/CreateCourseForm";
import SearchCourseForm from "../components/forms/SearchCourseForm";
import { Term } from "../data/types";
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';

const { Content } = Layout;

type ComponentProps = {
    match: match,
    location: Location,
    history: History,
}

type ComponentState = {
    subject?: string,
    code?: string
}

const mapState = (state: RootState, props: ComponentProps) => ({
    courses: state.courses,
    instances: state.instances,
});

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState

class SearchCoursePage extends React.Component<Props, State> {
    state: State = {}
    formSearchCourse = React.createRef<FormInstance>();
    formCreateCourse = React.createRef<FormInstance>();

    onSearch = (values: any) => {
        this.setState({ ...values });
    }

    onCreateCourseFormFinish = (values: any) => {
        this.formSearchCourse.current?.setFieldsValue({
            ...values,
            year: moment(`${values.year}`)
        });

        this.onSearch(values)
    }

    render() {
        // let allDefined = subject !== undefined && code !== undefined && term !== undefined && year !== undefined;
        let noneDefined = this.state.subject === undefined && this.state.code === undefined;

        let results = Object.values(this.props.courses)
            .filter(course => {
                let matchSubject = this.state.subject === undefined || course.subject.indexOf(this.state.subject) === 0;
                let matchCode = this.state.code === undefined || course.code.indexOf(this.state.code) === 0;

                return matchSubject && matchCode;
            })
        
        let instancebuckets = Object
            .values(this.props.instances)
            .reduce<{ [courseID: string]: string[] }>((result, instance) => ({
            ...result,
            [instance.courseID]: [...(result[instance.courseID] ?? []), instance.instanceID]
            }), {});
        
        console.log(instancebuckets);
        
        let content : JSX.Element;

        if (!noneDefined && results.length === 0) {
            let initialValues : ComponentState & {name?: string, instructor?: string} = this.state;
            
            let course = Object.values(this.props.courses).find(course =>
                course.code === this.state.code &&
                course.subject === this.state.subject)

            if (course !== undefined)
                initialValues.name = course.name;

            content = <>
                <Result
                    status='warning'
                    icon={< FrownOutlined />}
                    title="No search results!"
                    subTitle="Try other search parameters! or create the course below"/>
                <Layout style={{width: '70%', marginRight: 'auto', marginLeft: 'auto'}}>
                    <CreateCourseForm form={this.formCreateCourse} initialValues={initialValues} onFinish={this.onCreateCourseFormFinish}/>
                </Layout>
            </>
        } else if (noneDefined) {
            content = <Result
                status='warning'
                icon={< FrownOutlined />}
                title="No search results!"
                subTitle="Please enter search parameters!"
            />
        } else {
            content = <List
                rowKey={course => course.courseID}
                header={`${results.length} ${results.length > 1 ? 'results' : 'result'}`}
                itemLayout="vertical"
                dataSource={results}
                renderItem={course => (
                    <List.Item
                        key={course.courseID}
                        actions={[
                            <Button
                                type='link'
                                icon={<InfoCircleOutlined />}
                                onClick={() => this.props.history.push({ pathname: '/information', search: `?courseID=${course.courseID}` })}>Information</Button>,
                            <Button
                                type='link'
                                icon={<PieChartOutlined />}
                                onClick={() => this.props.history.push({ pathname: '/breakdowns', search: `?courseID=${course.courseID}` })}>Breakdowns</Button>,
                            <Button
                                type='link'
                                icon={<CommentOutlined />}
                                onClick={() => this.props.history.push({ pathname: '/reviews', search: `?courseID=${course.courseID}` })}>Reviews</Button>
                        ]}
                    >
                        <List.Item.Meta
                            title={`${course.subject} ${course.code} - ${course.name}`}
                            description={
                                <>
                                    {instancebuckets[course.courseID]
                                        ?.map(instanceID =>
                                            <p>{`${this.props.instances[instanceID].term} ${this.props.instances[instanceID].year}`}</p>)}
                                </>
                            }
                        />
                    </List.Item>
                )}
            />
        }

        return (
            <PageHeader
                style={{ width: "100%" }}
                backIcon={false}
                title="Search for a course">
                <SearchCourseForm form={this.formSearchCourse} onSearch={this.onSearch} />
                {content}
            </PageHeader>
        );
    }
}

export default withRouter(connector(SearchCoursePage));