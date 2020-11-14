import { CommentOutlined, InfoCircleOutlined, PieChartOutlined } from '@ant-design/icons';
import { Button, Col, List, Row } from 'antd';
import { History, Location } from 'history';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match, withRouter } from 'react-router-dom';
import { RootState } from '../app/store';
import { Course } from '../data/types';
import { getCourseRatings } from '../pages/ElectivePage'
import SmileRate from './SmileRate';


type ComponentProps = {
    match: match,
    location: Location,
    history: History,
    course: Course,
    showOtherRatings?: boolean
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => {
    let instructors = new Set();
    let semesters = new Set();

    for (let instance of Object.values(state.instances)) {
        if (instance.courseID === props.course.courseID) {
            instructors.add(instance.instructor);
            semesters.add(`${instance.term} ${instance.year}`);
        }
    }


    let reviews = Object.values(state.reviews).filter(review => state.instances[review.instanceID].courseID === props.course.courseID);
    let courseRatings = getCourseRatings(reviews, state.instances);

    // let rating = reviews.length > 0
    //     ? reviews.reduce((res, review) => res + (review.difficulty + review.workload + review.enjoyability) / 3 / reviews.length, 0)
    //     : undefined;

    // let enjoyability = reviews.length > 0
    //     ? reviews.reduce((res, review) => res + (review.enjoyability)/ reviews.length, 0)
    //     : undefined;

    // let difficulty= reviews.length > 0
    //     ? reviews.reduce((res, review) => res + (review.difficulty) / reviews.length, 0)
    //     : undefined;

    // let workload = reviews.length > 0
    //     ? reviews.reduce((res, review) => res + (review.workload) / reviews.length, 0)
    //     : undefined;

    return {
        instructors: ([...instructors] as string[]),
        semesters: ([...semesters] as string[]).sort().reverse(),
        rating: courseRatings[props.course.courseID]?.overallRating,
        enjoyability: courseRatings[props.course.courseID]?.enjoyability,
        workload: courseRatings[props.course.courseID]?.workload,
        difficulty: courseRatings[props.course.courseID]?.difficulty,
    }
};

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;

type State = ComponentState;
type Props = ReduxProps & ComponentProps;

class CourseListItem extends React.Component<Props, State> {
    state: State = {}

    goto = (path: string, query: { [key: string]: string }) => {
        let params = new URLSearchParams();

        for (let [key, value] of Object.entries(query))
            params.append(key, value);

        this.props.history.push({
            pathname: path,
            search: params.toString(),
            state: this.props.history.location.state
        });
    }

    onInformationClicked = () => {
        this.goto('/information', {
            courseID: this.props.course.courseID
        });
    }

    onBreakdownClicked = () => {
        this.goto('/breakdowns', {
            courseID: this.props.course.courseID
        });
    }

    onReviewsClicked = () => {
        this.goto('/reviews', {
            courseID: this.props.course.courseID
        });
    }

    render() {
        return (
            <List.Item
                key={this.props.course.courseID}
                actions={[
                    <Button
                        type='link'
                        icon={<InfoCircleOutlined />}
                        onClick={this.onInformationClicked}>Information</Button>,
                    <Button
                        type='link'
                        icon={<PieChartOutlined />}
                        onClick={this.onBreakdownClicked}>Breakdowns</Button>,
                    <Button
                        type='link'
                        icon={<CommentOutlined />}
                        onClick={this.onReviewsClicked}>Reviews</Button>
                ]}>
                <List.Item.Meta
                    title={`${this.props.course.subject} ${this.props.course.code}`}
                    description={
                        <>
                            <Row>
                                <Col span={4}>Name:</Col>
                                <Col>{this.props.course.name}</Col>
                            </Row>
                            {
                                this.props.rating !== undefined && <Row align="middle">
                                    <Col span={4}>Overall Rating:</Col>
                                    <Col>
                                        {this.props.rating.toFixed(2)}
                                    </Col>
                                </Row>
                            }

                            { this.props.showOtherRatings && this.props.difficulty !== undefined && <Row align="middle">
                                <Col span={4}> Overall Difficulty</Col>
                                <Col>
                                    <SmileRate value={Math.round(this.props.difficulty)} disabled={true} />
                                </Col>
                            </Row>
                            }
                            { this.props.showOtherRatings && this.props.enjoyability !== undefined && <Row align="middle">
                                <Col span={4}> Overall Enjoyability</Col>
                                <Col>
                                    <SmileRate value={Math.round(this.props.enjoyability)} disabled={true} />
                                </Col>
                            </Row>
                            }
                            { this.props.showOtherRatings && this.props.workload !== undefined && <Row align="middle">
                                <Col span={4}> Overall Workload</Col>
                                <Col>
                                    <SmileRate value={Math.round(this.props.workload)} disabled={true} />
                                </Col>
                            </Row>
                            }
                            <Row>
                                <Col span={4}>Previous Instructors:</Col>
                                <Col>
                                    {
                                        this.props.instructors.reduce((res, instructor, index) => {
                                            if (index >= 5)
                                                return res;
                                            if (index === 4)
                                                return res + ", ...";
                                            return res + ', ' + instructor;
                                        })
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}>Previous Semesters:</Col>
                                <Col>
                                    {
                                        this.props.semesters.reduce((res, semester, index) => {
                                            if (index >= 5)
                                                return res;
                                            if (index === 4)
                                                return res + ", ...";
                                            return res + ', ' + semester;
                                        })
                                    }
                                </Col>
                            </Row>
                        </>
                    }
                />
            </List.Item>
        )
    }
}

export default withRouter(connector(CourseListItem));