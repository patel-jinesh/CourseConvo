import { Course } from "../course";
import { User } from "../../user/user"

export interface Review {
    difficulty: number;
    enjoyability: number;
    workload: number;
    comment: string;
    course: Course;
    user: User;
    isAnonymous: boolean;
};