import { RootState } from "../app/store";
import { connect, ConnectedProps } from "react-redux";
import React from "react";
import { PageHeader, Layout, AutoComplete, Input, Card, Button, Tooltip, Space, Form, Select, DatePicker, Typography, Result } from "antd";
import Meta from "antd/lib/card/Meta";
import {
    AuditOutlined,
    HomeOutlined,
    PieChartOutlined,
    CommentOutlined,
    InfoCircleOutlined,
    SearchOutlined,
    FrownTwoTone,
    FrownOutlined
} from '@ant-design/icons';
import { Term } from "../data/types";
import { withRouter, match } from "react-router-dom";
import { Location, History } from "history";
import CreateCourseForm from "../components/forms/CreateCourseForm";
import moment from "moment";
import { FormInstance } from "antd/lib/form";

const { Title } = Typography;

const { Content } = Layout;
const { Option } = Select;

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
    courses: Object.values(state.courses),
});

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState

class SearchCoursePage extends React.Component<Props, State> {
    state: State = {}

    createCourseForm = React.createRef<FormInstance>();
    searchCourseForm = React.createRef<FormInstance>();

    onCreateCourseFormValuesChange = (_: any, values: any) => {
        console.log(values)
        this.searchCourseForm.current?.setFieldsValue({
            subject: values.identifier.subject,
            code: values.identifier.code,
            term: values.semester.term,
            year: values.semester.year,
        });
    }

    onFormValuesChange = (_: any, values: any) => {
        this.setState({
            subject: values.subject === "" ? undefined : values.subject,
            code: values.code === "" ? undefined : values.code,
            term: values.term,
            year: values.year?.year(),
        }, () => {
            this.createCourseForm.current?.setFieldsValue({
                identifier: {
                    subject: this.state.subject,
                    code: this.state.code,
                },
                semester: {
                    term: this.state.term,
                    year: this.state.year === undefined ? undefined : moment(`${this.state.year}`)
                }
            })
        });
    }

    render() {
        let search = (
            <Form ref={this.searchCourseForm} layout='horizontal' onValuesChange={this.onFormValuesChange}>
                <Form.Item
                    noStyle
                    shouldUpdate={true}>
                    {({ getFieldValue }) =>
                        <Input.Group
                            style={{ display: 'flex' }}
                            compact>
                            <Form.Item
                                normalize={(v: string) => v.toUpperCase().replace(/[ \d]/g, "")}
                                name={'subject'}
                                rules={[
                                    { pattern: /^[A-Z]+$/g, message: 'Not a valid subject!' }]
                                }
                                noStyle>
                                <AutoComplete
                                    style={{ flex: 0.8 }}
                                    size='large'
                                    placeholder="Subject"
                                    filterOption={(i, o) => o?.value.indexOf(i.toUpperCase()) === 0}
                                    options={
                                        this.props.courses
                                            .map(c => c.identifier.subject)
                                            .unique()
                                            .map(v => ({ value: v }))
                                    }>
                                </AutoComplete>
                            </Form.Item>
                            <Form.Item
                                normalize={(v: string) => v.toUpperCase().replace(" ", "").substr(0, 4)}
                                name={'code'}
                                rules={[
                                    { pattern: /^[0-9][A-Z]([A-Z]|[0-9])[0-9]$/g, message: "Not a valid code!" }
                                ]}
                                noStyle>
                                <AutoComplete
                                    style={{ flex: 0.2 }}
                                    size='large'
                                    filterOption={(i, o) => o?.value.indexOf(i.toUpperCase()) === 0}
                                    options={
                                        this.props.courses
                                            .filter(c => c.identifier.subject === getFieldValue(['identifier', 'subject']))
                                            .map(c => c.identifier.code)
                                            .unique()
                                            .map(code => ({ value: code }))
                                    }
                                    placeholder="Code"
                                />
                            </Form.Item>
                            <Form.Item >
                                <Input.Group compact>
                                    <Form.Item
                                        name={'term'}
                                        rules={[{ required: true, message: 'Please input the Term!' }]}
                                        noStyle>
                                        <Select style={{ width: 110 }} size='large' placeholder="Term">
                                            <Option value={Term.FALL}>{Term.FALL}</Option>
                                            <Option value={Term.WINTER}>{Term.WINTER}</Option>
                                            <Option value={Term.SPRING}>{Term.SPRING}</Option>
                                            <Option value={Term.SUMMER}>{Term.SUMMER}</Option>
                                        </Select>
                                    </Form.Item>
                                    <Form.Item
                                        name={'year'}
                                        rules={[{ required: true, message: 'Please input the Year!' }]}
                                        noStyle>
                                        <DatePicker size='large' picker="year" />
                                    </Form.Item>
                                </Input.Group>
                            </Form.Item>
                            <Form.Item>
                                <Button style={{ marginLeft: '5px' }} size='large' type='primary' icon={<SearchOutlined />} />
                            </Form.Item>
                        </Input.Group>
                    }
                </Form.Item>
            </Form>
        );

        let allDefined = this.state.code !== undefined && this.state.subject !== undefined && this.state.year !== undefined && this.state.term !== undefined;
        let noneDefined = this.state.code === undefined && this.state.subject === undefined && this.state.year === undefined && this.state.term === undefined;

        let results: JSX.Element[] | JSX.Element = this.props.courses
            .filter(course => {
                let matchSubject = course.identifier.subject === this.state.subject || this.state.subject === undefined;
                let matchCode = course.identifier.code === this.state.code || this.state.code === undefined;
                let matchTerm = course.semester.term === this.state.term || this.state.term === undefined;
                let matchYear = course.semester.year === this.state.year || this.state.year === undefined;
                return matchSubject && matchCode && matchTerm && matchYear;
            })
            .map(course => {
                return (
                    <Card
                        key={course.courseID}
                        title={`${course.identifier.subject} ${course.identifier.code} - ${course.semester.term} ${course.semester.year}`}
                        extra={
                            <Space>
                                <Tooltip title='Information'>
                                    <Button
                                        type='link'
                                        icon={<InfoCircleOutlined />}
                                        onClick={() => this.props.history.push({ pathname: '/information', search: `?id=${course.courseID}` })}></Button>
                                </Tooltip>
                                <Tooltip title='Breakdown'>
                                    <Button type='link' icon={<PieChartOutlined />} />
                                </Tooltip>
                                <Tooltip title='Reviews'>
                                    <Button type='link' icon={<CommentOutlined />} />
                                </Tooltip>
                            </Space>
                        }>
                        {course.name}<br />
                        {course.instructor}
                    </Card>
                );
            });

        if (!noneDefined && results.length === 0) {
            results = <><Result
                status='warning'
                icon={< FrownOutlined />}
                title="No search results!"
                subTitle="Try other search parameters! or create the course below"
            />
                <CreateCourseForm onValuesChange={this.onCreateCourseFormValuesChange} form={this.createCourseForm} /></>
        } else if (noneDefined) {
            results = <Result
                status='warning'
                icon={< FrownOutlined />}
                title="No search results!"
                subTitle="Please enter search parameters!"
            />
        }

        return (
            <PageHeader
                style={{ width: "100%" }}
                backIcon={false}
                title="Search for a course">
                <Content style={{ padding: 24 }}>
                    {search}
                    <Layout>
                        <Space direction='vertical'>
                            {results}
                        </Space>
                    </Layout>
                </Content>
            </PageHeader>
        );
    }
}

export default withRouter(connector(SearchCoursePage));