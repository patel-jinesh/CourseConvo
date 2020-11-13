import { Form, Input } from "antd";
import { FormInstance } from "antd/lib/form/hooks/useForm";
import { NamePath } from "antd/lib/form/interface";
import React, { RefObject } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../app/store";
import { addFilterForm } from "../../utilities/formUtils";

interface FieldData {
    name: NamePath;
    value?: any;
    touched?: boolean;
    validating?: boolean;
    errors?: string[];
}

type ComponentProps = {
    fields?: FieldData[],
    onFieldsChange?: (changed: FieldData[], all: FieldData[]) => void,
    onValuesChange?: (changed: any, all: any) => void,
    onSearch: (values: any) => void;
    form?: RefObject<FormInstance>,
}

type ComponentState = {}

const mapState = (state: RootState) => ({
    courses: state.courses,
});

const mapDispatch = {}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState;

class CreateCourseForm extends React.Component<Props, State>{
    onValuesChange = (changed: any, all: any) => {
        this.props.onSearch({
                subject: all.subject,
                code: all.code,
                year: all.year?.year(),
                term: all.term
        });

        if (this.props.onValuesChange)
            this.props.onValuesChange(changed, all);
    }

    render() {
        return (
            <Form name="search" ref={this.props.form} fields={this.props.fields} onFieldsChange={this.props.onFieldsChange} onValuesChange={this.onValuesChange} layout='horizontal'>
                <Form.Item
                    noStyle
                    shouldUpdate={true}>
                    {({ getFieldValue }) =>
                        <Input.Group
                            style={{ display: 'flex' }}
                            compact>
                            {addFilterForm(Object.values(this.props.courses), "subject", /^[A-Z]+$/g, { width: '70%' }, "large", getFieldValue)}
                            {addFilterForm(Object.values(this.props.courses), "code", /^[0-9][A-Z]([A-Z]|[0-9])[0-9]$/g,  { width: '30%' }, "large", getFieldValue, 4)}
                        </Input.Group>
                    }
                </Form.Item>
            </Form>
        );
    }
}

export default connector(CreateCourseForm);