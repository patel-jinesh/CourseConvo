
import {
    FlexibleXYPlot,
    XAxis,
    YAxis,
    HorizontalGridLines,
    Crosshair,
    MarkSeries,
    LineMarkSeries,
    VerticalBarSeries,
    DiscreteColorLegend,
    AreaSeries,
    GradientDefs
} from 'react-vis';
import React from 'react';
import { Term, Record } from '../../data/types';
import { ConnectedProps, connect } from 'react-redux';
import { RootState } from '../../app/store';

type ComponentProps = {
    records: Record[],
}

type ComponentState = {
    crosshair: any[]
}

const mapState = (state: RootState, props: ComponentProps) => ({
    instances: state.instances
});

const connector = connect(mapState);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState

class GPAGraph extends React.Component<Props, State> {
    state: State = {
        crosshair: []
    }

    render() {
        let counts: {
            [instructor: string]:
            {
                total: number,
                minimum: number,
                maximum: number,
                count: number
            }
        } = {};

        for (let record of this.props.records) {
            let instance = this.props.instances[record.instanceID];
            let instructor = instance.instructor;

            counts[instructor] = {
                total: (counts[instructor]?.total ?? 0) + record.grade!,
                minimum: Math.min((counts[instructor]?.minimum ?? 12), record.grade!),
                maximum: Math.max((counts[instructor]?.maximum ?? 0), record.grade!),
                count: (counts[instructor]?.count ?? 0) + 1
            }
        }

        let avgs: any[] = [];
        let mins: any[] = [];
        let maxs: any[] = [];

        for (let [instructor, data] of Object.entries(counts)) {
            let avg = data.total / data.count;

            avgs.push({ x: instructor, y: avg });
            mins.push({ x: instructor, y: data.minimum });
            maxs.push({ x: instructor, y: data.maximum });
        }

        return (
            <FlexibleXYPlot xType="ordinal" height={400} onMouseLeave={() => this.setState({ crosshair: [] })} margin={{ right: 200 }} yDomain={[0, 12]}>
                <HorizontalGridLines style={{ stroke: 'rgb(100, 100, 100)' }} />
                <XAxis title='Instructor' style={{ text: { fill: 'white' } }}/>
                <YAxis title="Grade" style={{ text: { fill: 'white' } }}/>
                <DiscreteColorLegend
                    style={{ position: 'absolute', right: '50px', top: '10px' }}
                    orientation="vertical"
                    items={[
                        {
                            title: 'Apples',
                        },
                        {
                            title: 'Oranges',
                        }
                    ]}
                />
                <VerticalBarSeries data={mins} />
                <VerticalBarSeries data={avgs} />
                <VerticalBarSeries data={maxs} />
            </FlexibleXYPlot>
        );
    }
}

export default connector(GPAGraph);