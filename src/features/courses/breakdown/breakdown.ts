import { Course } from "../course";
import { User } from "../../user/user"

export interface Mark {
    type: string;
    weight: number;
    count: number;
}

export interface Breakdown {
    course: Course;
    isAnonymous: boolean;
    user: User;
    marks: Mark[];
}