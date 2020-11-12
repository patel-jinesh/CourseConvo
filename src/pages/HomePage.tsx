import { Button, Card, Col, List, PageHeader, Row, Space, Statistic, Tooltip } from 'antd';
import { CommentOutlined, InfoCircleOutlined, PieChartOutlined } from '@ant-design/icons';

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../app/store';
import DashboardCard from '../components/DashboardCard';
import { Course } from '../data/types';

type ComponentProps = {}
type ComponentState = {
    recordID?: string
}

const mapState = (state: RootState) => ({
    reviews: Object.values(state.reviews),
    instances: state.instances,
    courses: state.courses
});

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState

class HomePage extends React.Component<Props, State> {

    getTopRatedCourses = (numCourse: number) => {

        //Computing ratings for each course
        let courseRatings = (Object.entries(this.props.reviews
            .reduce<{ [courseID: string]: { count: number, totalRating: number } }>(
                (result, review) => {

                    let currRating = ((review.difficulty + review.enjoyability + review.workload) / 3);
                    return {
                        ...result,
                        [this.props.instances[review.instanceID].courseID]: {
                            count: (result[this.props.instances[review.instanceID].courseID]?.count ?? 0) + 1,
                            totalRating: (result[this.props.instances[review.instanceID].courseID]?.totalRating ?? 0) + currRating,
                        }
                    }

                }, {}))).map(([courseID, { totalRating, count }]) => ({ rating: (totalRating / count), courseID: courseID }));
        console.log(courseRatings);

        return courseRatings.sort((a, b) => b.rating - a.rating).slice(0, numCourse);

    }

    getElectiveRecommendations = () => {

    }
    //2c0cf1513534a68aa4b5b241cf9f12f04629f854git

    getMostPopularCourses = (numCourse: number) => {
        let mostPopularCourses: { [courseID: string]: { count: number } } = {};
        for (let i = 0; i < this.props.reviews.length; i++) {
            let review = this.props.reviews[i];
            mostPopularCourses = {
                ...mostPopularCourses, [this.props.instances[review.instanceID].courseID]: {
                    count: (mostPopularCourses[this.props.instances[review.instanceID].courseID]?.count ?? 0) + 1,
                }
            };
        }

        let courseReviews = Object.entries(mostPopularCourses).map(([courseID, { count }]) => ({ count: count, courseID: courseID }));
        return courseReviews.sort((a, b) => b.count - a.count).slice(0, numCourse);
    }

    getTopRatedInstructors = () => {

        let instructorRatings: { [instanceID: string]: { totalRating: number } } = {};
        for (let i = 0; i < this.props.reviews.length; i++) {
            let review = this.props.reviews[i];
            let currRating = ((review.difficulty + review.enjoyability + review.workload) / 3);
            instructorRatings = {
                ...instructorRatings,
                [review.instanceID]: {
                    totalRating: (instructorRatings[review.instanceID]?.totalRating ?? 0) + currRating
                }
            };
        }
        console.log(instructorRatings);
        return [];
    }



    render() {
        return (
            <PageHeader
                title="Home" style={{ width: "100%" }}>
                <Row gutter={10}>
                    <Col span={8}>
                        <Card>
                            <List header="Top Rated Courses"
                                itemLayout="horizontal"
                                dataSource={this.getTopRatedCourses(3)}
                                renderItem={item => (
                                    <List.Item>
                                        <Row style={{ width: "100%" }}>
                                            <Col flex={1}>{`${this.props.courses[item.courseID].subject} ${this.props.courses[item.courseID].code}`}
                                                <Tooltip title='Information'>
                                                    <Button
                                                        type='link'
                                                        icon={<InfoCircleOutlined />}
                                                    ></Button>
                                                </Tooltip>


                                                <Tooltip title='Information'>
                                                    <Button
                                                        type='link'
                                                        icon={<PieChartOutlined />}
                                                    ></Button>
                                                </Tooltip>


                                                <Tooltip title='Information'>
                                                    <Button
                                                        type='link'
                                                        icon={<CommentOutlined />}
                                                    ></Button>
                                                </Tooltip>
                                            </Col>

                                            <Col>
                                                <Statistic
                                                    value={item.rating}
                                                    precision={2}
                                                    suffix="/ 5"

                                                    valueStyle={{
                                                        color: (() => {
                                                            if (item.rating < 1) {
                                                                return '#f5222d'
                                                            } else if (item.rating < 2) {
                                                                return '#874d00'
                                                            } else if (item.rating < 3) {
                                                                return '#fadb14'
                                                            } else if (item.rating < 4) {
                                                                return '#7cb305'
                                                            } else if (item.rating < 5) {
                                                                return '#52c41a'
                                                            }
                                                        })()
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>

                                            </Col>
                                        </Row>

                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>

                    <Col span={8} >
                        <Card>
                            <List header="Most Popular Courses"
                                itemLayout="horizontal"
                                dataSource={this.getMostPopularCourses(3)}
                                renderItem={item => (
                                    <List.Item>
                                        <Row style={{ width: "100%" }}>
                                            <Col flex={1}>{`${this.props.courses[item.courseID].subject} ${this.props.courses[item.courseID].code}`}</Col>
                                            <Col>{`${item.count} reviews`}</Col>
                                        </Row>

                                    </List.Item>
                                )}
                            />
                        </Card>

                    </Col>
                </Row>

                <Row>
                    <Col span={8} >
                        <Card>
                            <List header="Top Instructors"
                                itemLayout="horizontal"
                                dataSource={this.getTopRatedInstructors()}
                                renderItem={item => (
                                    <List.Item>
                                        <Row style={{ width: "100%" }}>

                                        </Row>

                                    </List.Item>
                                )}
                            />
                        </Card>

                    </Col>
                </Row>
            </PageHeader>



        );
    }
}

export default connector(HomePage);