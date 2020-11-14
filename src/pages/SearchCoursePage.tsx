import { FrownOutlined } from '@ant-design/icons';
import { Layout, PageHeader, Result } from "antd";
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../app/store";
import CourseList from '../components/CourseList';
import CreateCourseForm from "../components/forms/CreateCourseForm";
import SearchCourseForm from "../components/forms/SearchCourseForm";

import { History, Location } from "history";
import { match, withRouter } from "react-router-dom";

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

    onSearch = (values: any) => {
        this.props.history.push('/search', {...values})
        this.setState({ ...values });
    }

    componentDidMount() {
        this.setState(this.props.history.location.state as { subject?: string, code?: string } ?? {})
        this.formSearchCourse.current?.setFieldsValue(this.props.history.location.state as { subject?: string, code?: string } ?? {})
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
                let hasInstance = Object.values(this.props.instances).some(instance => instance.courseID === course.courseID);

                return matchSubject && matchCode && hasInstance;
            })

        let content: JSX.Element;

        if (!noneDefined && results.length === 0) {
            content = <>
                <Result
                    status='warning'
                    icon={< FrownOutlined />}
                    title="No search results!"
                    subTitle="Try other search parameters! or create the course below" />
                <Layout style={{ width: '70%', marginRight: 'auto', marginLeft: 'auto' }}>
                    <CreateCourseForm onFinish={this.onCreateCourseFormFinish} />
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
            content = <CourseList courses={results} />
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