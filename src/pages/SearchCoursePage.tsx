import { FrownOutlined } from '@ant-design/icons';
import { Form, Layout, PageHeader, Result, Space } from "antd";
import { FormInstance } from "antd/lib/form";
import { NamePath } from "antd/lib/form/interface";
import { History, Location } from "history";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { match, withRouter } from "react-router-dom";
import { RootState } from "../app/store";
import CourseCard from "../components/InstanceCard";
import CreateCourseForm from "../components/forms/CreateCourseForm";
import SearchCourseForm from "../components/forms/SearchCourseForm";
import { Term } from "../data/types";

const { Content } = Layout;

interface FieldData {
    name: NamePath;
    value?: any;
    touched?: boolean;
    validating?: boolean;
    errors?: string[];
}

interface FormChangeInfo {
    changedFields: FieldData[],
    forms: {
        [name: string]: FormInstance
    }
}

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

    onSearch = (values: any) => {
        this.setState({ ...values });
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
        
        let content : JSX.Element | JSX.Element[];

        if (!noneDefined && results.length === 0) {
            content = <>
                <Result
                    status='warning'
                    icon={< FrownOutlined />}
                    title="No search results!"
                    subTitle="Try other search parameters! or create the course below"/>
                <Layout style={{width: '70%', marginRight: 'auto', marginLeft: 'auto'}}>
                    <CreateCourseForm initialValues={this.state} />
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
            content = results.map(instance =>
                <CourseCard key={instance.instanceID} instanceID={instance.instanceID} />
            );
        }
        
        return (
            <PageHeader
                style={{ width: "100%" }}
                backIcon={false}
                title="Search for a course">
                <Content style={{ padding: 24 }}>
                    <Form.Provider
                        onFormChange={(name, { changedFields, forms }) => {
                            const { create, search } = forms;
                            switch (name) {
                                case 'search': create?.setFields(changedFields); break;
                                case 'create': search?.setFields(changedFields); break;
                            }
                        }}
                    >
                        <SearchCourseForm onSearch={this.onSearch} />
                        <Layout>
                            <Space direction='vertical'>
                                {content}
                            </Space>
                        </Layout>
                    </Form.Provider>
                </Content>
            </PageHeader>
        );
    }
}

export default withRouter(connector(SearchCoursePage));