/**
 * The types that our application will use.
 */

export enum Term {
    FALL = "Fall",
    WINTER = "Winter",
    SPRING = "Spring",
    SUMMER = "Summer"
};

export enum Status {
    IN_PROGRESS = "In progress",
    TAKEN = "Taken",
    TRANSFERRED = "Transferred"
}

export enum FormType {
    COURSE = "Course",
    INSTRUCTOR = "Instructor",
    DATE = "Date",
    TERM = "Term"
}

export interface User {
    userID: string;
    name: string;
    avatar_url: string;
}

export interface Mark {
    type: string;
    weight: number;
    count: number;
}

export interface Breakdown {
    breakdownID: string,
    instanceID: string;
    userID: string;
    marks: Mark[];
    isAnonymous: boolean;
}

export interface Course {
    courseID: string;
    name: string;
    code: string,
    subject: string
};

export interface CourseInstance {
    instanceID: string,
    courseID: string,
    instructor: string,
    term: Term,
    year: number
}

export interface Record {
    userID: string;
    recordID: string,
    instanceID: string;
    status: Status;
    grade?: number;
}

export interface Review {
    reviewID: string,
    difficulty: number;
    enjoyability: number;
    workload: number;
    comment: string;
    instanceID: string;
    userID: string;
    isAnonymous: boolean;
    upvoterIDs: { [userID: string] : true };
    downvoterIDs: { [userID: string]: true };
    datetime: number;
    replies: { userID: string, datetime: number, comment: string }[]
};
