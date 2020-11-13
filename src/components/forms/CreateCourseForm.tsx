import { Button, Form, Input, Space, Tooltip } from "antd";
import { FormInstance } from "antd/lib/form/hooks/useForm";
import { NamePath } from "antd/lib/form/interface";
import { History, Location } from "history";
import moment from "moment";
import React, { RefObject } from "react";
import { connect, ConnectedProps } from "react-redux";
import { match, withRouter } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { RootState } from "../../app/store";
import { FormType } from "../../data/types";
import { add as addCourse } from '../../features/courses/course';
import { add as addInstance } from '../../features/courses/instance';
import { addDateForm, addFilterForm, addForms, addTermForm } from "../../utilities/formUtils";

interface FieldData {
    name: NamePath;
    value?: any;
    touched?: boolean;
    validating?: boolean;
    errors?: string[];
}

type ComponentProps = {
    fields?: FieldData[],
    onFinish?: (values: any) => void,
    onFieldsChange?: (changed: FieldData[], all: FieldData[]) => void,
    onValuesChange?: (changed: FieldData[], all: FieldData[]) => void,
    initialValues?: any,
    form?: RefObject<FormInstance>,

    match: match,
    location: Location,
    history: History,
}

type ComponentState = {}

const mapState = (state: RootState) => ({
    courses: state.courses,
    instances: state.instances,
});

const mapDispatch = {
    addCourse: addCourse,
    addInstance: addInstance,
}

const connector = connect(mapState, mapDispatch);

type ReduxProps = ConnectedProps<typeof connector>;

type Props = ReduxProps & ComponentProps;
type State = ComponentState;

class CreateCourseForm extends React.Component<Props, State> {
    form = this.props.form ?? React.createRef<FormInstance>();

    onFinish = (values: any) => {
        let courseID = uuidv4();
        let instanceID = uuidv4();

        this.props.addCourse({
            courseID: courseID,
            name: values.name,
            code: values.code,
            subject: values.subject
        });
        
        this.props.addInstance({
            instanceID: instanceID,
            courseID: courseID,
            instructor: values.instructor,
            term: values.term,
            year: values.year.year()
        });

        if (this.props.onFinish)
            this.props.onFinish({
                ...values,
                year: values.year.year()
            });
    }

    onValuesChange = (_: any, values: any) => {
        let course = Object.values(this.props.courses).find(course =>
            course.code === values.code &&
            course.subject === values.subject)

        let instance = Object.values(this.props.instances).find(instance =>
            instance.courseID === course?.courseID &&
            instance.term === values.term &&
            instance.year === values.year?.year())

        if (course !== undefined && values.name !== course.name)
            this.form.current?.setFieldsValue({ name: course.name });
        if (instance !== undefined && values.instructor !== instance.instructor)
            this.form.current?.setFieldsValue({ instructor: instance.instructor });
        
        if (this.props.onValuesChange)
            this.props.onValuesChange(_, values);
    }

    render() {
        let initialValues = {
            ...(this.props.initialValues ?? {}),
            year: this.props.initialValues?.year !== undefined ? moment(`${this.props.initialValues.year}`) : undefined
        }

        return (
            <Form name='create' initialValues={initialValues} ref={this.form} fields={this.props.fields} onFieldsChange={this.props.onFieldsChange} onValuesChange={this.onValuesChange} onFinish={this.onFinish} layout="horizontal" labelCol={{ span: 8 }} labelAlign={"left"}>
                <Form.Item
                    label="Course Code"
                    shouldUpdate={true}
                    required>
                    {({ getFieldValue }) =>
                        <Input.Group compact>
                            {addFilterForm(Object.values(this.props.courses), "subject", /^[A-Z]+$/g, {width: '70%'}, "middle", getFieldValue)}
                            {addFilterForm(Object.values(this.props.courses), "code", /^[0-9][A-Z]([A-Z]|[0-9])[0-9]$/g, {width: '30%'}, "middle", getFieldValue, 4)}
                        </Input.Group>
                    }
                </Form.Item>
                <Form.Item label="Semester" required>
                    <Input.Group compact>
                        {addTermForm("50", "middle")}
                        {addDateForm("50", "middle")}
                    </Input.Group>
                </Form.Item>
                {addForms(Object.values(this.props.courses), Object.values(this.props.instances), [FormType.COURSE, FormType.INSTRUCTOR])}
                <Form.Item shouldUpdate={true} label=" " colon={false}>
                    {({ getFieldsError, getFieldValue }) => {
                        let course = Object.values(this.props.courses).find(course =>
                            course.subject === getFieldValue('subject') &&
                            course.code === getFieldValue('code'));

                        let instance = Object.values(this.props.instances).find(instance =>
                            instance.courseID === course?.courseID &&
                            instance.year === getFieldValue('year')?.year() &&
                            instance.term === getFieldValue('term'));

                        let button = (
                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={
                                    (instance !== undefined) || getFieldsError().map(v => v.errors.length !== 0).reduce((r, c) => (r || c), false)
                                }>
                                Submit
                            </Button>
                        );

                        let informationbutton = (
                            <Button
                                onClick={() => this.props.history.push({ pathname: '/information', search: `?courseID=${course!.courseID}` })}
                                type="primary">
                                Go to the information page.
                            </Button>
                        )
                    

                        if (instance !== undefined)
                            return (
                                <Space direction='horizontal' split>
                                    <Tooltip title="This course exists">
                                        {button}
                                    </Tooltip>
                                    {informationbutton}
                                </Space>
                            )

                        return button;
                    }}
                </Form.Item>
            </Form>
        );
    }
}

export default withRouter(connector(CreateCourseForm));