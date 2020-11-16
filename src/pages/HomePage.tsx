import { CommentOutlined, InfoCircleOutlined, PieChartOutlined } from '@ant-design/icons';
import { Button, Card, Col, List, PageHeader, Row, Statistic, Tooltip } from 'antd';
import { History, Location } from "history";
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match, withRouter } from 'react-router-dom';
import { RootState } from '../app/store';




type ComponentProps = {
    match: match,
    location: Location,
    history: History,
}
type ComponentState = {

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

    getTopRatedCourses = (numCourse?: number) => {

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


        return courseRatings.sort((a, b) => b.rating - a.rating).slice(0, numCourse ?? (courseRatings.length - 1));

    }

    getMostPopularCourses = (numCourse: number) => {
        let mostPopularCourses: { [courseID: string]: { count: number } } = {};
        for (let i = 0; i < this.props.reviews.length; i++) {
            let review = this.props.reviews[i];
            mostPopularCourses[this.props.instances[review.instanceID].courseID] = {
                count: (mostPopularCourses[this.props.instances[review.instanceID].courseID]?.count ?? 0) + 1,
            }

        }

        let courseReviews = Object.entries(mostPopularCourses).map(([courseID, { count }]) => ({ count: count, courseID: courseID }));
        return courseReviews.sort((a, b) => b.count - a.count).slice(0, numCourse);
    }

    getTopRatedInstructors = (numCourse: number) => {
        let instructorRatings: { [instructor: string]: { totalRating: number, count: number } } = {};
        for (let i = 0; i < this.props.reviews.length; i++) {
            let review = this.props.reviews[i];
            let currRating = ((review.difficulty + review.enjoyability + review.workload) / 3);


            instructorRatings[this.props.instances[review.instanceID].instructor] = {
                totalRating: (instructorRatings[this.props.instances[review.instanceID].instructor]?.totalRating ?? 0) + currRating,
                count: (instructorRatings[this.props.instances[review.instanceID].instructor]?.count ?? 0) + 1
            }
        }

        let topRatedInstructors = Object.entries(instructorRatings)
            .map(([instructor, { totalRating, count }]) => ({ instructor: instructor, rating: totalRating / count }));
        return topRatedInstructors.sort((a, b) => b.rating - a.rating).slice(0, numCourse);

    }



    render() {
        let numCourses = 5;
        return (
            //Page header
            <PageHeader
                title="Home" style={{ width: "100%" }}>
                <Row gutter={10}>
                    <Col span={8}>
                        <Card style={{ height: "100%" }}>
                            <List header="Top Rated Courses"
                                itemLayout="horizontal"
                                dataSource={this.getTopRatedCourses(numCourses)}
                                renderItem={item => (
                                    <List.Item>
                                        <Row style={{ width: "100%" }} align="middle">
                                            <Col span={9}>{`${this.props.courses[item.courseID].subject} ${this.props.courses[item.courseID].code}`}
                                            </Col>
                                            <Col offset={2} flex={1}>
                                                <Tooltip title='Information'>
                                                    <Button
                                                        type='link'
                                                        icon={<InfoCircleOutlined />}
                                                        onClick={() => this.props.history.push({ pathname: '/information', search: `?courseID=${item?.courseID}` })}
                                                    ></Button>
                                                </Tooltip>


                                                <Tooltip title='Breakdown'>
                                                    <Button
                                                        type='link'
                                                        icon={<PieChartOutlined />}
                                                        onClick={() => this.props.history.push({ pathname: '/breakdowns', search: `?courseID=${item?.courseID}` })}
                                                    ></Button>
                                                </Tooltip>


                                                <Tooltip title='Reviews'>
                                                    <Button
                                                        type='link'
                                                        icon={<CommentOutlined />}
                                                        onClick={() => this.props.history.push({ pathname: '/reviews', search: `?courseID=${item?.courseID}` })}
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

                    <Col span={8}>
                        <Card style={{ height: "100%" }}>
                            <List header="Most Popular Courses"
                                itemLayout="horizontal"
                                dataSource={this.getMostPopularCourses(numCourses)}

                                renderItem={item => (
                                    <List.Item>
                                        <Row style={{ width: "100%" }} align="middle">
                                            <Col flex={1}>{`${this.props.courses[item.courseID].subject} ${this.props.courses[item.courseID].code}`}</Col>
                                            <Col style={{ height: "36.660px" }}>
                                                <Button
                                                    type='link'
                                                    onClick={() => this.props.history.push({ pathname: '/reviews', search: `?courseID=${item?.courseID}` })}>
                                                    {`${item.count} ${item.count === 1 ? "review" : "reviews"}`}
                                                </Button>
                                            </Col>
                                        </Row>

                                    </List.Item>
                                )}
                            />
                        </Card>

                    </Col>

                    <Col span={8} >
                        <Card style={{ height: "100%" }}>
                            <List header="Top Instructors"
                                itemLayout="horizontal"
                                dataSource={this.getTopRatedInstructors(numCourses)}
                                renderItem={item => (
                                    <List.Item>
                                        <Row style={{ width: "100%" }} align="middle">
                                            <Col flex={1}>{`${item.instructor}`}</Col>
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
                                                            } else if (item.rating <= 5) {
                                                                return '#52c41a'
                                                            }
                                                        })()
                                                    }}
                                                />
                                            </Col>
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

export default withRouter(connector(HomePage));