import { Rate, Radio } from "antd";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../app/store";


type ComponentProps = {
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

class NumericRate extends React.Component<Props> {
    render() {
        return (
            <Radio.Group
                buttonStyle='solid'
                defaultValue={this.props.defaultValue}
                disabled={this.props.disabled}
                onChange={e => this.props.onChange && this.props.onChange(e.target.value)}>
                <Radio.Button value={1}>1</Radio.Button>
                <Radio.Button value={2}>2</Radio.Button>
                <Radio.Button value={3}>3</Radio.Button>
                <Radio.Button value={4}>4</Radio.Button>
                <Radio.Button value={5}>5</Radio.Button>
            </Radio.Group>
        );
    }
}

export default connector(NumericRate);