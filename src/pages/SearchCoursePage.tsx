import { RootState } from "../app/store";
import { connect, ConnectedProps } from "react-redux";
import React from "react";
import { PageHeader, Layout, AutoComplete, Input, Card, Button, Tooltip, Space, Form, Select, DatePicker, Typography, Result } from "antd";
import Meta from "antd/lib/card/Meta";
import {
    PieChartOutlined,
    CommentOutlined,
    InfoCircleOutlined,
    FrownOutlined
} from '@ant-design/icons';
import { Term, Course } from "../data/types";
import { withRouter, match } from "react-router-dom";
import { Location, History } from "history";
import CreateCourseForm from "../components/forms/CreateCourseForm";
import moment from "moment";
import { FormInstance } from "antd/lib/form";
import { NamePath } from "antd/lib/form/interface";
import SearchCourseForm from "../components/forms/SearchCourseForm";
import CourseCard from "../components/CourseCard";

const { Title } = Typography;

const { Content } = Layout;
const { Option } = Select;

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
    identifier?: {
        subject?: string,
        code?: string,
    },
    semester?: {
        term?: Term,
        year?: number
    }
}

const mapState = (state: RootState, props: ComponentProps) => ({
    courses: Object.values(state.courses),
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
        let subject = this.state.identifier?.subject;
        let code = this.state.identifier?.code;
        let term = this.state.semester?.term;
        let year = this.state.semester?.year;

        let allDefined = subject !== undefined && code !== undefined && term !== undefined && year !== undefined;
        let noneDefined = subject === undefined && code === undefined && term === undefined && year === undefined;

        let results = this.props.courses
            .filter(course => {
                let matchSubject = subject === undefined || course.identifier.subject.indexOf(subject) === 0;
                let matchCode = code === undefined || course.identifier.code.indexOf(code) === 0;
                let matchTerm = term === undefined || course.semester.term === term;
                let matchYear = year === undefined || course.semester.year === year;
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
                    <CreateCourseForm />
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
            content = results.map(course =>
                <CourseCard key={course.courseID} courseID={course.courseID} />
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
                                case 'search':
                                    create?.setFields(changedFields);
                                    break;
                                case 'create':
                                    search?.setFields(changedFields);
                                    break;
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