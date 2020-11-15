import { AutoComplete, DatePicker, Form, Input, Select } from "antd";
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import React, { CSSProperties } from "react";
import { Course, CourseInstance, FormType, Term } from "../data/types";

const { Option } = AutoComplete;

export function addTermForm(width: any, s: SizeType) {
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

export function addDateForm(width: any, s: SizeType) {
    return (
        <Form.Item
            name='year'
            rules={[{ required: true, message: 'Please input the Year!' }]}
            noStyle>
            <DatePicker style={{ width: width + "%" }} size={s} picker="year" />
        </Form.Item>
    );
}

export function mapForm(courses: Course[], name: string, getFieldValue: any) {
    if (name === "subject") {
        return (
            courses
                .map(course => course.subject)
                .unique()
                .map(subject => ({ value: subject }))
        );
    }
    else if (name === "code") {
        return (
            courses
                .filter(course => course.subject === getFieldValue('subject'))
                .map(course => course.code)
                .unique()
                .map(code => ({ value: code }))
        );
    }
}

export function addFilterForm(courses: Course[], name: string, pattern: RegExp, style: CSSProperties, sz: SizeType, getFieldValue: any, length?: any) {
    return (
        <Form.Item
            normalize={(v: string) => v !== "" ? v.toUpperCase().replace(" ", "").substr(0, length) : undefined}
            name={name}
            rules={[
                { required: true, message: 'Please input the ' + name + '!' },
                { pattern: pattern, message: 'Not a valid ' + name + '!' }]
            }
            noStyle>
            <AutoComplete
                style={style}
                size={sz}
                placeholder={name.charAt(0).toUpperCase() + name.slice(1)}
                filterOption={(i, o) => o?.value.indexOf(i.toUpperCase()) === 0}
                options={
                    mapForm(courses, name, getFieldValue)
                }>
            </AutoComplete>
        </Form.Item>
    );
}

export function addCourseForm(course: any) {
    return (
        <Form.Item
            name="name"
            label="Course Name"
            rules={[{ required: true, message: 'Please input the course name!' }]}
            required>
            <Input disabled={course !== undefined}></Input>
        </Form.Item>
    );
}

export function addInstructorForm(instance: any, instances: CourseInstance[]) {
    return (
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
    );
}

function collectForms(course: any, instance: any, instances: CourseInstance[], forms: FormType[]) {
    var formList = [];
    var i = 0;

    for (i = 0; i < forms.length; i++) {
        if (forms[i] === "Course")
            formList.push(addCourseForm(course))
        else if (forms[i] === "Instructor")
            formList.push(addInstructorForm(instance, instances))
    }

    return formList;
}

export function addForms(courses: Course[], instances: CourseInstance[], forms: FormType[], courseID?: string) {
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
                        instance.courseID === (courseID ?? course?.courseID) &&
                        instance.term === term &&
                        instance.year === year);

                    return collectForms(course, instance, instances, forms)
                }
            }
        </Form.Item>
    );
}