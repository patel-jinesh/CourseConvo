import { CommentOutlined, InfoCircleOutlined, PieChartOutlined } from '@ant-design/icons';
import { FrownOutlined } from '@ant-design/icons';
import { Form, Layout, PageHeader, Result, Space, List, Button, Tooltip } from "antd";
import { History, Location } from "history";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { match, withRouter } from "react-router-dom";
import { RootState } from "../app/store";
import InstanceCard from "../components/InstanceCard";
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
    code?: string,
    term?: Term,
    year?: number
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
        let noneDefined = this.state.subject === undefined && this.state.code === undefined && this.state.term === undefined && this.state.year === undefined;

        let results = Object.values(this.props.instances)
            .filter(instance => {
                let course = this.props.courses[instance.courseID];

                let matchSubject = this.state.subject === undefined || course.subject.indexOf(this.state.subject) === 0;
                let matchCode = this.state.code === undefined || course.code.indexOf(this.state.code) === 0;
                let matchTerm = this.state.term === undefined || instance.term === this.state.term;
                let matchYear = this.state.year === undefined || instance.year === this.state.year;

                return matchSubject && matchCode && matchTerm && matchYear;
            })
        
        let content : JSX.Element;

        if (!noneDefined && results.length === 0) {
            let initialValues : ComponentState & {name?: string, instructor?: string} = this.state;
            
            let course = Object.values(this.props.courses).find(course =>
                course.code === this.state.code &&
                course.subject === this.state.subject)

            let instance = Object.values(this.props.instances).find(instance =>
                instance.courseID === course?.courseID &&
                instance.term === this.state.term &&
                instance.year === this.state.year)

            if (course !== undefined)
                initialValues.name = course.name;
            if (instance !== undefined)
                initialValues.instructor = instance.instructor

            content = <>
                <Result
                    status='warning'
                    icon={< FrownOutlined />}
                    title="No search results!"
                    subTitle="Try other search parameters! or create the course below"/>
                <Layout style={{width: '70%', marginRight: 'auto', marginLeft: 'auto'}}>
                    <CreateCourseForm initialValues={initialValues} onFinish={this.onCreateCourseFormFinish}/>
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
                header={`${results.length} ${results.length > 1 ? 'results' : 'result'}`}
                itemLayout="vertical"
                dataSource={results}
                renderItem={instance => (
                    <List.Item
                        key={instance.courseID}
                        actions={[
                            <Button
                                type='link'
                                icon={<InfoCircleOutlined />}
                                onClick={() => this.props.history.push({ pathname: '/information', search: `?instanceID=${instance.instanceID}&courseID=${instance.courseID}` })}>Information</Button>,
                            <Button
                                type='link'
                                icon={<PieChartOutlined />}
                                onClick={() => this.props.history.push({ pathname: '/breakdowns', search: `?instanceID=${instance.instanceID}&courseID=${instance.courseID}` })}>Breakdowns</Button>,
                            <Button
                                type='link'
                                icon={<CommentOutlined />}
                                onClick={() => this.props.history.push({ pathname: '/reviews', search: `?instanceID=${instance.instanceID}&courseID=${instance.courseID}` })}>Reviews</Button>
                        ]}
                    >
                        <List.Item.Meta
                            title={`${this.props.courses[instance.courseID].subject} ${this.props.courses[instance.courseID].code} - ${instance.term} ${instance.year}`}
                            description={
                                <>
                                    <p>{this.props.courses[instance.courseID].name}</p>
                                    <p>{instance.instructor}</p>
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
                <Content style={{ padding: 24 }}>
                    <SearchCourseForm form={this.formSearchCourse} onSearch={this.onSearch} />
                    <Layout>
                        <Space direction='vertical'>
                            {content}
                        </Space>
                    </Layout>
                </Content>
            </PageHeader>
        );
    }
}

export default withRouter(connector(SearchCoursePage));