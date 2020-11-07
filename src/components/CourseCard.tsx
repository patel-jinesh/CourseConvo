import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '../app/store'
import React from 'react'
import { Tooltip, Card, Space, Button } from 'antd';
import { Location, History } from "history";

import {
    InfoCircleOutlined,
    PieChartOutlined,
    CommentOutlined
} from '@ant-design/icons';
import { match, withRouter } from 'react-router-dom';

type ComponentProps = {
    courseID: string,

    /** React router props */
    match: match,
    location: Location,
    history: History,
}

const mapState = (state: RootState, props: ComponentProps) => ({
    course: state.courses[props.courseID]
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;
type Props = ReduxProps & ComponentProps;

class CourseCard extends React.Component<Props> {
    render() {
        return (
            <Card
                title={`${this.props.course.identifier.subject} ${this.props.course.identifier.code} - ${this.props.course.semester.term} ${this.props.course.semester.year}`}
                extra={
                    <Space>
                        <Tooltip title='Information'>
                            <Button
                                type='link'
                                icon={<InfoCircleOutlined />}
                                onClick={() => this.props.history.push({ pathname: '/information', search: `?id=${this.props.courseID}` })}></Button>
                        </Tooltip>
                        <Tooltip title='Breakdown'>
                            <Button type='link' icon={<PieChartOutlined />} />
                        </Tooltip>
                        <Tooltip title='Reviews'>
                            <Button type='link' icon={<CommentOutlined />} />
                        </Tooltip>
                    </Space>
                }>
                {this.props.course.name}<br />
                {this.props.course.instructor}
            </Card>
        );
    }
}

export default withRouter(connector(CourseCard));