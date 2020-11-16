import { FrownOutlined } from '@ant-design/icons';
import { Affix, AutoComplete, Button, Card, Col, PageHeader, Result, Row, Space } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { History, Location } from "history";
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match, withRouter } from 'react-router-dom';
import { RootState } from '../app/store';
import CourseList from '../components/CourseList';
import SmileRate from '../components/SmileRate';

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
    overallRating?: number,
    content?: JSX.Element
}



const mapState = (state: RootState) => ({
    instances: state.instances,
    courses: state.courses,
    reviews: Object.values(state.reviews),
});

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState

// TODO: Can optimize and reuse code from homepage to get course ratings, can create a general class
export function getCourseRatings(reviews: any, instances: any,) {
    let courseAttrRatings: {
        [courseID: string]:
        { overallRating: number, count: number, difficulty: number, workload: number, enjoyability: number }
    } = {};

    for (let i = 0; i < reviews.length; i++) {
        let review = reviews[i];
        let currRating = ((review.difficulty + review.enjoyability + review.workload) / 3);
        let courseID = instances[review.instanceID].courseID;
        courseAttrRatings[courseID] = {
            overallRating: (courseAttrRatings[courseID]?.overallRating ?? 0) + currRating,
            count: (courseAttrRatings[courseID]?.count ?? 0) + 1,
            difficulty: (courseAttrRatings[courseID]?.difficulty ?? 0) + review.difficulty,
            enjoyability: (courseAttrRatings[courseID]?.enjoyability ?? 0) + review.enjoyability,
            workload: (courseAttrRatings[courseID]?.workload ?? 0) + review.workload,
        }
    }

    Object.keys(courseAttrRatings).forEach(key => {
        let count = courseAttrRatings[key].count;
        courseAttrRatings[key].difficulty = courseAttrRatings[key].difficulty / count;
        courseAttrRatings[key].enjoyability = courseAttrRatings[key].enjoyability / count;
        courseAttrRatings[key].workload = courseAttrRatings[key].workload / count;
        courseAttrRatings[key].overallRating = courseAttrRatings[key].overallRating / count;
    })

    return courseAttrRatings
}

class ElectivePage extends React.Component<Props, State> {
    formSearchCourse = React.createRef<FormInstance>();
    content: JSX.Element = <Result
        status='warning'
        icon={< FrownOutlined />}
        title="No Course Suggestions"
        subTitle="Please enter course suggestion parameters"
    />;
    state: State = { content: this.content };


    autocomplete = (subject: any) => {

        return Object.values(this.props.courses).map((course) => {
            return course.subject
        }).unique().map((subject) => {
            return { value: subject }
        })
    }

    getCourseSuggestions = (numCourse: number) => {
        let noneDefined = this.state.subject === undefined;
        let courseRatings = getCourseRatings(this.props.reviews, this.props.instances);


        //filtering results to match filter options
        let results = Object.values(this.props.courses)
            .filter(course => {
                let matchSubject = this.state.subject === undefined || course.subject.indexOf(this.state.subject) === 0;
                let hasInstance = Object.values(this.props.instances).some(instance => instance.courseID === course.courseID);
                // let overallRatingMatch = courseRatings[course.courseID]?.totalRating >= (this?.state?.overallRating ?? 0);
                let difficultyMatch = courseRatings[course.courseID]?.difficulty >= (this?.state?.difficulty ?? 0);
                let enjoyabilityMatch = courseRatings[course.courseID]?.enjoyability >= (this?.state?.enjoyability ?? 0);
                let workloadMatch = courseRatings[course.courseID]?.workload >= (this?.state?.workload ?? 0);
                // return matchSubject && hasInstance && difficultyMatch && enjoyabilityMatch && workloadMatch && overallRatingMatch;
                return matchSubject && hasInstance && difficultyMatch && enjoyabilityMatch && workloadMatch;
            });

        //Getting top numCourse results of the filter
        results.sort((a, b) => { return courseRatings[b.courseID].overallRating - courseRatings[a.courseID].overallRating });
        if (results.length > numCourse) {
            results = results.splice(0, numCourse);

        }

        if (!noneDefined && results.length === 0) {
            this.content = <>
                <Result
                    status='warning'
                    icon={< FrownOutlined />}
                    title="No Course Suggestions"
                    subTitle="Try other  course suggestion parameters!" />
            </>
        } else if (noneDefined) {
            this.content = <Result
                status='warning'
                icon={< FrownOutlined />}
                title="No Course Suggestions"
                subTitle="Please enter course suggestion parameters"
            />
        } else {
            this.content = <CourseList courses={results} showOtherRatings={true} />
        }

        this.setState({ content: this.content });

    }


    render() {
        return (
            //Page header
            <PageHeader
                title="Elective Suggestions" style={{ width: "100%" }}>

                <Row style={{ width: "100%" }}>
                    <Col span={5}>
                        <Affix offsetTop={50}>
                            <Card bordered={false} title="Elective Filter Options">
                                <Space direction='vertical'>
                                    <span> Course: (required)</span>
                                    <AutoComplete placeholder="Course" style={{ width: "200px" }}
                                        getPopupContainer={trigger => trigger.parentElement}
                                        value={this.state.subject}
                                        onChange={(value) => { this.setState({ subject: value }) }}
                                        filterOption={(i, o) => o?.value.indexOf(i.toUpperCase()) === 0}
                                        options={this.autocomplete(this.state.subject)}
                                    > </AutoComplete>

                                    {/* <span> Overall Rating</span>
                                    <SmileRate className="overallRating" value={this.state.overallRating ?? 0}
                                        onChange={(value) => this.setState({ overallRating: value })}></SmileRate> */}

                                    <span> Minimum Difficulty (optional)</span>
                                    <SmileRate className="difficulty" value={this.state.difficulty ?? 0}
                                        tooltips={["Challenging", "Hard", "Understandable", "Easy", "No brainer"]}
                                        onChange={(value) => this.setState({
                                            difficulty: value,
                                            overallRating:
                                                ((this.state.enjoyability ?? 0) + (this.state.difficulty ?? 0) + (this.state.workload ?? 0)) / 3
                                        })}></SmileRate>

                                    <span> Minimum Enjoyability (optional)</span>
                                    <SmileRate className="enjoyability" value={this.state.enjoyability ?? 0}
                                        tooltips={["Challenging", "Hard", "Understandable", "Easy", "No brainer"]}
                                        onChange={(value) =>
                                            this.setState({
                                                enjoyability: value,
                                                overallRating:
                                                    ((this.state.enjoyability ?? 0) + (this.state.difficulty ?? 0) + (this.state.workload ?? 0)) / 3
                                            })}></SmileRate>

                                    <span> Minimum Workload (optional)</span>
                                    <SmileRate className="workload" value={this.state.workload ?? 0}
                                        tooltips={["Challenging", "Hard", "Understandable", "Easy", "No brainer"]}
                                        onChange={(value) => this.setState({
                                            workload: value,
                                            overallRating:
                                                ((this.state.enjoyability ?? 0) + (this.state.difficulty ?? 0) + (this.state.workload ?? 0)) / 3
                                        })}></SmileRate>



                                    <Button type="primary" style={{ width: "100%" }} onClick={() => { this.getCourseSuggestions(3) }}> Get Suggestions</Button>
                                </Space>
                            </Card>
                        </Affix>
                    </Col>
                    <Col flex={1} style={{ padding: "20px" }}>
                        {this.state.content}
                    </Col>
                </Row>
            </PageHeader >
        );
    }
}

export default withRouter(connector(ElectivePage));