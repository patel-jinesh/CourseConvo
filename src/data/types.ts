/**
 * The types that our application will use.
 */

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

export enum Term {
    FALL = "Fall",
    WINTER = "Winter",
    SPRING = "Spring",
    SUMMER = "Summer"
};

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

export enum Status {
    IN_PROGRESS = "In progress",
    TAKEN = "Taken",
    TRANSFERRED = "Transferred"
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
    datetime: string;
    replies: {
        [userID: string]: { datetime: string, comment: string }
    };
};
