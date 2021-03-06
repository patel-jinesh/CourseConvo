
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { AreaSeries, Crosshair, FlexibleXYPlot, GradientDefs, MarkSeries, VerticalGridLines, XAxis, YAxis } from 'react-vis';
import { RootState } from '../../app/store';
import { Record, Term } from '../../data/types';

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
            [semester: string]:
            {
                total: number,
                minimum: number,
                maximum: number,
                count: number
            }
        } = {};
        let minsem: { term: Term, year: number } | undefined = undefined;
        let maxsem: { term: Term, year: number } | undefined = undefined;

        let termmap = {
            [Term.WINTER]: 0,
            [Term.SPRING]: 1,
            [Term.SUMMER]: 2,
            [Term.FALL]: 3,
        }
        let termmaprev = [
            Term.WINTER,
            Term.SPRING,
            Term.SUMMER,
            Term.FALL,
        ]

        for (let record of this.props.records) {
            let instance = this.props.instances[record.instanceID];
            let term = instance.term;
            let year = instance.year;
            let semester = `${term} ${year}`;

            counts[semester] = {
                total: (counts[semester]?.total ?? 0) + record.grade!,
                minimum: Math.min((counts[semester]?.minimum ?? 12), record.grade!),
                maximum: Math.max((counts[semester]?.maximum ?? 0), record.grade!),
                count: (counts[semester]?.count ?? 0) + 1
            }

            minsem = minsem === undefined || year < minsem.year || (year === minsem.year && termmap[minsem.term] < termmap[term])
                ? { term: term, year: year }
                : minsem;
            maxsem = maxsem === undefined || year > maxsem.year || (year === maxsem.year && termmap[maxsem.term] > termmap[term])
                ? { term: term, year: year }
                : maxsem;
        }

        let averages = Object.entries(counts).reduce<{ [semester: string]: number }>((r, [semester, { total, count }]) => ({
            ...r,
            [semester]: total / count
        }), {});

        let gpa: any[] = [];
        let mins: any[] = [];
        let maxs: any[] = [];
        let range: any[] = [];
        let ticks: number[] = [];

        for (let semval = minsem!.year + (termmap[minsem!.term] / 4); semval <= maxsem!.year + (termmap[maxsem!.term] / 4); semval += 0.25) {
            let semester = `${termmaprev[(semval % 1) * 4]} ${semval - (semval % 1)}`;

            if (averages[semester] !== undefined)
                gpa.push({ x: semval, y: averages[semester] });
            if (counts[semester]?.minimum !== undefined)
                mins.push({ x: semval, y: counts[semester].minimum })
            if (counts[semester]?.maximum !== undefined)
                maxs.push({ x: semval, y: counts[semester].maximum })
            if (counts[semester]?.minimum !== undefined && counts[semester]?.minimum !== undefined)
                range.push({ x: semval, y: counts[semester].minimum, y0: counts[semester].maximum })
            
            ticks.push(semval);
        }

        let data = [gpa, mins, maxs];

        let formatter = (v: number) => {
            if (v % 1 === 0) return `${Term.WINTER} ${v}`;
            if (v % 1 === 0.25) return `${Term.SPRING} ${v - 0.25}`;
            if (v % 1 === 0.5) return `${Term.SUMMER} ${v - 0.5}`;
            if (v % 1 === 0.75) return `${Term.FALL} ${v - 0.75}`;
            return "?";
        }

        return (
            <FlexibleXYPlot height={400} onMouseLeave={() => this.setState({crosshair: []})} xPadding={1} margin={{ bottom: 100 }} yDomain={[-1, 13]}>
                <GradientDefs>
                    <linearGradient id="CoolGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="red" stopOpacity={0.4} />
                        <stop offset="150%" stopColor="blue" stopOpacity={0.3} />
                    </linearGradient>
                </GradientDefs>
                <VerticalGridLines style={{ stroke: 'rgb(100, 100, 100)' }} />
                <XAxis height={400} tickValues={ticks} tickLabelAngle={-45} tickFormat={(v: any) => formatter(v)} title="Semester" style={{ text: { fill: 'white' }, title: { fill: 'white' } }} />
                <YAxis title="Grade" tickValues={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]} style={{ text: { fill: 'white' } }} />
                <AreaSeries onNearestX={
                    (value: any, { index }: any) => {
                        // this.setState({ crosshair: gpa.map((d, i) => i === index ? [d, { x: d.x, y: mins[i] }, { x: d.x, y: maxs[i] }] : []) });
                        this.setState({ crosshair: data.map(d => d[index]) });
                    }
                } curve={'curveMonotoneX'} color={'url(#CoolGradient)'} data={gpa} />
                <MarkSeries color="white" style={{ fill: "none" }} data={gpa} />
                <AreaSeries curve={'curveMonotoneX'} color={'url(#CoolGradient)'} data={maxs} />
                <AreaSeries curve={'curveMonotoneX'} color={'url(#CoolGradient)'} data={mins} />
                <MarkSeries color="yellow" style={{ fill: "none" }} data={mins} />
                <MarkSeries color="brown" style={{ fill: "none" }} data={maxs} />
                <Crosshair
                    values={this.state.crosshair}
                    itemsFormat={(data: any) => {
                        let avg = data[0];
                        let min = data[1];
                        let max = data[2];

                        return [
                            { title: "Average", value: avg.y.toFixed(2) },
                            { title: "Min", value: min.y.toFixed(2) },
                            { title: "Max", value: max.y.toFixed(2) },
                        ]
                    }}
                    titleFormat={(data: any) => {
                        return data.map(({ x }: { x: number }) => ({ title: `${termmaprev[(x % 1) * 4]} ${x - (x % 1)}`}))[0]
                    }}
                />
            </FlexibleXYPlot>
        );
    }
}

export default connector(GPAGraph);