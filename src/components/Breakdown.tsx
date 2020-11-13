import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, Descriptions } from 'antd';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../app/store';
import { Mark } from '../data/types';
import { add } from '../features/courses/course';

const { Panel } = Collapse;

type ComponentProps = {
    breakdownID: string,
    instanceID: string
}

const mapState = (state: RootState, props: ComponentProps) => ({
    breakdown: state.breakdowns[props.breakdownID],
    instance: state.instances[props.instanceID],
    user: state.users[state.breakdowns[props.breakdownID].userID],
    users: state.users,
});

const mapDispatch = {
    add: add
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;
type Props = ReduxProps & ComponentProps;

class Breakdown extends React.Component<Props> {

    //Display assessment info
    displayInfo (type: string, mark: Mark) {
        return (
            <ul>
                <li>Weight: {mark.weight}%</li> 
                <li>Number of {type}: {mark.count}</li>
            </ul>
        );
    }

    //Add a specific assessment panel
    addAssessment (type: string) {
        return (
            this.props.breakdown.marks.map((mark, index) => {
                if ((mark.type === type) && (mark.count > 0)) {
                    return (
                        <Collapse
                            defaultActiveKey={"1"}
                            key={index}
                            bordered={false}
                            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                            className="site-collapse-custom-collapse" >
                            <Panel header={type} key="1" className="site-collapse-custom-panel">
                                {this.displayInfo(type, mark)}
                            </Panel>
                        </Collapse>
                    );
                }

                return undefined;
            })
        );
    }

    //Add all panels for assessments that the course supports
    addPanels () {
        const assessments = ["Exams", "Midterms", "Assignments", "Quizzes", "Labs", "Projects"];
        var panels = [];
        var i = 0;

        for (i = 0; i < assessments.length; i++)
        {
            panels.push(this.addAssessment(assessments[i]));
        }

        return panels;
    }

    render() {
        return (
            <Descriptions title="Course Breakdown" bordered column={2}>
                <Descriptions.Item label="Semester">{`${this.props.instance.term} ${this.props.instance.year}`}</Descriptions.Item>
                <Descriptions.Item label="Instructor">{this.props.instance.instructor}</Descriptions.Item>
                <Descriptions.Item label="Lectures" span={2}>In-Person</Descriptions.Item>
                <Descriptions.Item label="Assessments" span={2}>
                    {this.addPanels()}
                </Descriptions.Item>
            </Descriptions>       
        );
    }
}

export default connector(Breakdown);