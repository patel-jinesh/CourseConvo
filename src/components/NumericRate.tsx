import { Rate } from "antd";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../app/store";


type ComponentProps = {
    tooltips?: string[]
    defaultValue?: number
    disabled?: boolean
    onChange?: (value : number) => void
}

type ComponentState = {}

const mapState = (state: RootState, props: ComponentProps) => ({
});

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;
type Props = ReduxProps & ComponentProps;

const customCharacters = [
    "1",
    "2",
    "3",
    "4",
    "5",
];

class NumericRate extends React.Component<Props> {
    render() {
        return (
            <Rate
                tooltips={this.props.tooltips}
                character={({ index, value }: { index: number, value: number }) => {
                    return customCharacters[index];
                }}
                defaultValue={this.props.defaultValue}
                disabled={this.props.disabled}
                onChange={this.props.onChange}/>
        );
    }
}

export default connector(NumericRate);