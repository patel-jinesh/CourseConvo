import { CommentOutlined, InfoCircleOutlined, PieChartOutlined } from '@ant-design/icons';
import { Button, Card, Space, Tooltip } from 'antd';
import { History, Location } from "history";
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { match, withRouter } from 'react-router-dom';
import { RootState } from '../app/store';

type ComponentProps = {
    instanceID: string,

    /** React router props */
    match: match,
    location: Location,
    history: History,
}

const mapState = (state: RootState, props: ComponentProps) => ({
    instance: state.instances[props.instanceID],
    course: state.courses[state.instances[props.instanceID].courseID]
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;
type Props = ReduxProps & ComponentProps;

class InstanceCard extends React.Component<Props> {
    render() {
        return (
            <Card
                title={`${this.props.course.subject} ${this.props.course.code} - ${this.props.instance.term} ${this.props.instance.year}`}
                extra={
                    <Space>
                        <Tooltip title='Information'>
                            <Button
                                type='link'
                                icon={<InfoCircleOutlined />}
                                onClick={() => this.props.history.push({ pathname: '/information', search: `?instanceID=${this.props.instanceID}&courseID=${this.props.course.courseID}` })}></Button>
                        </Tooltip>
                        <Tooltip title='Breakdown'>
                            <Button
                                type='link'
                                icon={<PieChartOutlined />}
                                onClick={() => this.props.history.push({ pathname: '/breakdowns', search: `?instanceID=${this.props.instanceID}&courseID=${this.props.course.courseID}` })}/>
                        </Tooltip>
                        <Tooltip title='Reviews'>
                            <Button
                                type='link'
                                icon={<CommentOutlined />}
                                onClick={() => this.props.history.push({ pathname: '/reviews', search: `?instanceID=${this.props.instanceID}&courseID=${this.props.course.courseID}` })} />
                        </Tooltip>
                    </Space>
                }>
                {this.props.course.name}<br />
                {this.props.instance.instructor}
            </Card>
        );
    }
}

export default withRouter(connector(InstanceCard));