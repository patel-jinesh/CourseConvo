import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Button, DatePicker, Form, Input, Select } from "antd";
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { FormInstance } from "antd/lib/form/hooks/useForm";
import { NamePath } from "antd/lib/form/interface";
import React, { RefObject } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../app/store";
import { Course, CourseInstance, Term } from "../data/types";

const { Option } = AutoComplete;

export function addTermForm(width: string, s: SizeType) {
    return (
        <Form.Item
            name='term'
            rules={[{ required: true, message: 'Please input the Term!' }]}
            noStyle>
            <Select style={{ width: width + "%" }} size={s} placeholder="Term">
                <Option value={Term.FALL}>{Term.FALL}</Option>
                <Option value={Term.WINTER}>{Term.WINTER}</Option>
                <Option value={Term.SPRING}>{Term.SPRING}</Option>
                <Option value={Term.SUMMER}>{Term.SUMMER}</Option>
            </Select>
        </Form.Item>
    );
}

export function addDateForm(width: string, s: SizeType) {
    return (
        <Form.Item
            name='year'
            rules={[{ required: true, message: 'Please input the Year!' }]}
            noStyle>
            <DatePicker style={{ width: width + "%" }} size={s} picker="year" />
        </Form.Item>
    );
}

export function addGenericForm(courses: Course[], instances: CourseInstance[]) {
    return (
        <Form.Item
            noStyle
            dependencies={[['subject'], ['code'], ['term'], ['year']]}>
            {
                ({ getFieldValue }) => {
                    let subject = getFieldValue('subject');
                    let code = getFieldValue('code');
                    let term = getFieldValue('term');
                    let year = getFieldValue('year')?.year();

                    let course = courses.find(course =>
                        course.code === code &&
                        course.subject === subject);
                    
                    let instance = instances.find(instance =>
                        instance.courseID === course?.courseID &&
                        instance.term === term &&
                        instance.year === year);

                    return (
                        <>
                            <Form.Item
                                name="name"
                                label="Course Name"
                                rules={[{ required: true, message: 'Please input the course name!' }]}
                                required>
                                <Input disabled={course !== undefined}></Input>
                            </Form.Item>
                            <Form.Item
                                name="instructor"
                                label="Instructor"
                                rules={[{ required: true, message: "Please input the instructor name!" }]}
                                required>
                                <AutoComplete
                                    disabled={instance !== undefined}
                                    filterOption={(i, o) => o?.value.toUpperCase().indexOf(i.toUpperCase()) === 0}
                                    options={
                                        Object.values(instances)
                                            .map(instance => instance.instructor)
                                            .unique()
                                            .map(instructor => ({ value: instructor }))
                                    }
                                />
                            </Form.Item>
                        </>
                    )
                }
            }
        </Form.Item>
    );
}