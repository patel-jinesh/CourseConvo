import { List } from 'antd';
import { History, Location } from 'history';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match, withRouter } from 'react-router-dom';
import { RootState } from '../app/store';
import { Course } from '../data/types';
import CourseListItem from './CourseListItem';

type ComponentProps = {
    match: match,
    location: Location,
    history: History,
    courses: Course[],
    showOtherRatings?: boolean
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => ({});

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type State = ComponentState;
type Props = ReduxProps & ComponentProps;

class CourseList extends React.Component<Props, State> {
    state: State = {}

    renderCourse = (course: Course) => <CourseListItem course={course} showOtherRatings={this.props.showOtherRatings} />

    render() {
        return (
            <List
                dataSource={this.props.courses}
                rowKey={course => course.courseID}
                header={`${this.props.courses.length} ${this.props.courses.length !== 1 ? 'courses' : 'course'}`}
                itemLayout="vertical"
                renderItem={this.renderCourse}
            />
        )
    }
}

export default withRouter(connector(CourseList));