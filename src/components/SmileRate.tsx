import { FrownOutlined, MehOutlined, SmileOutlined } from '@ant-design/icons';
import { Rate } from "antd";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../app/store";


type ComponentProps = {
    tooltips?: string[]
    defaultValue?: number
    disabled?: boolean
    value?: number,
    onChange?: (value: number) => void
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => ({
});

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;
type Props = ReduxProps & ComponentProps;

const customIconsColored = [
    <FrownOutlined style={{ color: 'red' }} />,
    <FrownOutlined style={{ color: 'orange' }} />,
    <MehOutlined style={{ color: 'yellow' }} />,
    <SmileOutlined style={{ color: 'greenyellow' }} />,
    <SmileOutlined style={{ color: 'green' }} />,
];

const customIconsBlank = [
    <FrownOutlined style={{ color: 'rgba(255,255,255,0.12)' }} />,
    <FrownOutlined style={{ color: 'rgba(255,255,255,0.12)' }} />,
    <MehOutlined style={{ color: 'rgba(255,255,255,0.12)' }} />,
    <SmileOutlined style={{ color: 'rgba(255,255,255,0.12)' }} />,
    <SmileOutlined style={{ color: 'rgba(255,255,255,0.12)' }} />,
]

class SmileRate extends React.Component<Props> {
    render() {
        return (
            <Rate
                value={this.props.value}
                onChange={this.props.onChange}
                tooltips={this.props.tooltips}
                character={({ index, value }: { index: number, value: number }) => {
                    if (index === value - 1)
                        return customIconsColored[index];
                    return customIconsBlank[index];
                }}
                defaultValue={this.props.defaultValue}
                disabled={this.props.disabled} />
        );
    }
}

export default connector(SmileRate);