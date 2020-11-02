export interface User {
    id: string
    name: string
}

export interface Mark {
    type: string;
    weight: number;
    count: number;
}

export interface Breakdown {
    breakdownID: string,
    course: string;
    user: User;
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
    identifier: {
        code: string,
        subject: string
    };
    instructor: string;
    semester: {
        term: Term,
        year: number
    };
};

export enum Status {
    IN_PROGRESS = "In progress",
    TAKEN = "Taken",
    TRANSFERRED = "Transferred"
}

export interface Record {
    recordID: string,
    courseID: string;
    status: Status;
    grade?: number;
}

export interface Review {
    recordID: string,
    difficulty: number;
    enjoyability: number;
    workload: number;
    comment: string;
    course: string;
    user: User;
    isAnonymous: boolean;
};
