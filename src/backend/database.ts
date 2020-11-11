import { Course, Term, Record, Status, User, Breakdown, Review, CourseInstance } from "../data/types";
import { v4 as uuidv4 } from 'uuid'
import moment from "moment";

/**
COMPSCI 3AC3 - Algorithms and Complexity
COMPSCI 3DB3 - Databases
COMPSCI 3EA3 - Software and System Correctness
COMPSCI 3FP3 - Functional Programming
COMPSCI 3GC3 - Computer Graphics
COMPSCI 3I03 - Communication Skills
COMPSCI 3IS3 - Information Security
COMPSCI 3MI3 - Principles of Programming Languages
COMPSCI 3N03 - Computer Networks and Security
COMPSCI 3RA3 - Software Requirements and Security Considerations
COMPSCI 3SD3 - Concurrent Systems
COMPSCI 3SH3 - Computer Science Practice and Experience: Operating Systems
COMPSCI 3TB3 - Syntax-Based Tools and Compilers
COMPSCI 4AD3 - Advanced Databases
COMPSCI 4AR3 - Software Architecture
COMPSCI 4C03 - Computer Networks and Security
COMPSCI 4DC3 - Distributed Computing
COMPSCI 4E03 - Performance Analysis of Computer Systems
COMPSCI 4EN3 - Software Entrepreneurship
COMPSCI 4F03 - Parallel Computing
COMPSCI 4HC3 - Human Computer Interfaces
COMPSCI 4ML3 - Introduction to Machine Learning
COMPSCI 4O03 - Linear Optimization
COMPSCI 4TB3 - Syntax-Based Tools and Compilers
COMPSCI 4TE3 - Continuous Optimization
COMPSCI 4TH3 - Theory of Computation
COMPSCI 4TI3 - Fundamentals of Image Processing
COMPSCI 4WW3 - Web Systems and Web Computing
COMPSCI 4X03 - Scientific Computation
 */

const coursesdb: [string, string, string][] = [
    ["SFWRENG", "2AA4", "Design I - Introduction to Software Development"],
    ["SFWRENG", "2C03", "Data Structures and Algorithms"],
    ["SFWRENG", "2DA4", "Digital Systems and Interfacing"],
    ["SFWRENG", "2DM3", "Discrete Mathematics with Applications I"],
    ["SFWRENG", "2FA3", "Discrete Mathematics and Applications II"],
    ["SFWRENG", "2GA3", "Computer Architecture"],
    ["SFWRENG", "2S03", "Principles of Programming"],
    ["SFWRENG", "2XA3", "Software Engineering Practice and Experience: Software Development Skills"],
    ["SFWRENG", "2XB3", "Software Engineering Practice and Experience: Binding Theory to Practice"],
    ["SFWRENG", "3A04", "Software Design III - Large System Design"],
    ["SFWRENG", "3BB4", "Software Design II - Concurrent System Design"],
    ["SFWRENG", "3DB3", "Databases"],
    ["SFWRENG", "3DX4", "Dynamic Systems and Control"],
    ["SFWRENG", "3I03", "Communication Skills"],
    ["SFWRENG", "3MX3", "Signals and Systems"],
    ["SFWRENG", "3O03", "Linear Optimization"],
    ["SFWRENG", "3RA3", "Software Requirements and Security Considerations"],
    ["SFWRENG", "3S03", "Software Testing"],
    ["SFWRENG", "3SH3", "Operating Systems"],
    ["SFWRENG", "3XA3", "Software Engineering Practice and Experience: Software Project Management"],
    ["SFWRENG", "4AA4", "Real-Time Systems and Control Applications"],
    ["SFWRENG", "4C03", "Computer Networks and Security"],
    ["SFWRENG", "4E03", "Performance Analysis of Computer Systems"],
    ["SFWRENG", "4F03", "Parallel Computing"],
    ["SFWRENG", "4G06", "Software Design IV - Capstone Design Project"],
    ["SFWRENG", "4HC3", "Human Computer Interfaces"],
    ["SFWRENG", "4X03", "Scientific Computation"]
]

/**
 * The users in our fake database.
 */
export const users: User[] = [
    {
        userID: uuidv4(),
        name: "John Doe",
        avatar_url: "https://thispersondoesnotexist.com/image"
    },
    {
        userID: uuidv4(),
        name: "Jane Doe",
        avatar_url: "https://thispersondoesnotexist.com/image"
    },
    {
        userID: uuidv4(),
        name: "Allan Poe",
        avatar_url: "https://thispersondoesnotexist.com/image"
    },
]

/**
 * The current logged in userID
 */
export const USERID = users[0].userID;

/**
 * The courses in our fake database
 */
export const courses: Course[] = coursesdb.map(([subject, code, name]) => {
    return {
        courseID: uuidv4(),
        name: name,
        code: code,
        subject: subject
    }
})

export const instances: CourseInstance[] = [
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[0].courseID,
        instructor: "Spencer Smith",
        term: Term.FALL,
        year: 2015 + i
    })),
    {
        instanceID: uuidv4(),
        courseID: courses[2].courseID,
        instructor: "Ryan Leduc",
        term: Term.FALL,
        year: 2017
    }
]

/**
 * The academic records in our fake database.
 */
export const records: Record[] = [
    {
        recordID: uuidv4(),
        status: Status.IN_PROGRESS,
        instanceID: instances[0].instanceID,
        userID: users[0].userID
    },
    {
        recordID: uuidv4(),
        status: Status.TAKEN,
        instanceID: instances[1].instanceID,
        userID: users[0].userID,
        grade: 12
    },
    {
        recordID: uuidv4(),
        status: Status.TAKEN,
        instanceID: instances[0].instanceID,
        userID: users[1].userID,
        grade: 9
    },
    ...(instances.map(instance => (
        Array(10).fill(undefined).map(_ => ({
            recordID: uuidv4(),
            status: Status.TAKEN,
            instanceID: instance.instanceID,
            userID: users[2].userID,
            grade: Math.floor(Math.random() * (12 + 1))
        }))
    )).flat())
]
/**
 * The breakdowns in our fake database.
 */
export const breakdowns: Breakdown[] = [
    {
        breakdownID: uuidv4(),
        instanceID: instances[0].instanceID,
        userID: users[1].userID,
        marks: [
            {
                type: "Assignments",
                weight: 12,
                count: 3
            },
            {
                type: "Midterms",
                weight: 30,
                count: 1
            },
            {
                type: "Exams",
                weight: 50,
                count: 1
            },
            {
                type: "Labs",
                weight: 0,
                count: 0
            },
            {
                type: "Quizzes",
                weight: 8,
                count: 4
            },
        ],
        isAnonymous: false
    }
]

/**
 * The reviews in our fake database.
 */
export const reviews: Review[] = [
    {
        reviewID: uuidv4(),
        instanceID: instances[0].instanceID,
        userID: users[1].userID,
        difficulty: 3.5,
        enjoyability: 2,
        workload: 1,
        comment: "Best course ever",
        isAnonymous: false,
        upvoterIDs: {},
        downvoterIDs: {},
        datetime: moment().format('LLLL'),
        replies: [{
            userID: users[1].userID,
            comment: "I agree",
            datetime: moment().format('LLLL')
        }]
    }
]