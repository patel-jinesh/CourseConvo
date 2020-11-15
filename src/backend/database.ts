import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import { Assessments, Breakdown, Course, CourseInstance, Record, Review, ReviewTag, Status, Term, User } from "../data/types";
import U1 from '../images/U1.jpeg'
import U2 from '../images/U2.jpeg'
import U3 from '../images/U3.jpeg'
import U4 from '../images/U4.jpeg'
import U5 from '../images/U5.jpeg'

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
        avatar_url: U1
    },
    {
        userID: uuidv4(),
        name: "Jane Bekham",
        avatar_url: U2
    },
    {
        userID: uuidv4(),
        name: "Allan Poe",
        avatar_url: U3
    },
    {
        userID: uuidv4(),
        name: "Edgar Smith",
        avatar_url: U4
    },
    {
        userID: uuidv4(),
        name: "Tina Miller",
        avatar_url: U5
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
        instructor: "William Farmer",
        term: Term.FALL,
        year: 2017
    },
    {
        instanceID: uuidv4(),
        courseID: courses[3].courseID,
        instructor: "Wolfram Kahl",
        term: Term.FALL,
        year: 2017
    },
    {
        instanceID: uuidv4(),
        courseID: courses[4].courseID,
        instructor: "William Farmer",
        term: Term.WINTER,
        year: 2018
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
            grade: Math.floor(1 + Math.random() * (12))
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
        datetime: moment().valueOf(),
        marks: [
            {
                type: Assessments.ASSIGNMENTS,
                weight: 12,
                count: 3
            },
            {
                type: Assessments.MIDTERMS,
                weight: 30,
                count: 1
            },
            {
                type: Assessments.EXAMS,
                weight: 50,
                count: 1
            },
            {
                type: Assessments.LABS,
                weight: 0,
                count: 0
            },
            {
                type: Assessments.QUIZZES,
                weight: 8,
                count: 4
            },
        ],
        isAnonymous: false
    },
    {
        breakdownID: uuidv4(),
        instanceID: instances[0].instanceID,
        userID: users[2].userID,
        datetime: moment().valueOf(),
        marks: [
            {
                type: Assessments.ASSIGNMENTS,
                weight: 12,
                count: 3
            },
            {
                type: Assessments.MIDTERMS,
                weight: 30,
                count: 1
            },
            {
                type: Assessments.EXAMS,
                weight: 50,
                count: 1
            },
            {
                type: Assessments.LABS,
                weight: 0,
                count: 0
            },
            {
                type: Assessments.QUIZZES,
                weight: 8,
                count: 4
            },
        ],
        isAnonymous: false
    },
    {
        breakdownID: uuidv4(),
        instanceID: instances[1].instanceID,
        userID: USERID,
        datetime: moment().valueOf(),
        marks: [
            {
                type: Assessments.ASSIGNMENTS,
                weight: 10,
                count: 5
            },
            {
                type: Assessments.EXAMS,
                weight: 50,
                count: 1
            },
            {
                type: Assessments.LABS,
                weight: 30,
                count: 5
            },
            {
                type: Assessments.QUIZZES,
                weight: 10,
                count: 4
            },
        ],
        isAnonymous: false
    },
    {
        breakdownID: uuidv4(),
        instanceID: instances[2].instanceID,
        userID: users[3].userID,
        datetime: moment().valueOf(),
        marks: [
            {
                type: Assessments.MIDTERMS,
                weight: 20,
                count: 1
            },
            {
                type: Assessments.EXAMS,
                weight: 50,
                count: 1
            },
            {
                type: Assessments.PROJECTS,
                weight: 30,
                count: 1
            }
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
        difficulty: 3,
        enjoyability: 2,
        workload: 1,
        comment: `This assessments for this course are hit or miss in terms of what you are able to learn from them. The coding portions of the assignments were easy and helpful,
        especially when we need to use unit testing which helped us learn about the test driven development process. The downside to the assignments was that we were required to
        construct a formal specification document for select assignments. The task here was to create a set of specs that mathematically describe the inputs and the correlating outputsThe irony here is that
        the instructions were so vague given that the document had to be very specific (so specific that mathematical language needed to be used to reduce any ambiguity).
        I had to use a 100% of 10% of my brain power to complete these specs at a satisfactory level. My complaints don't just stop there. The midterm and exam for this course is so next level
        that you would probably need to take an escalator just to understand the first question you see. One of the questions on the exam was designed so 90% of the class would be prevented from
        saying that they got that question right. And this was after the professor had said that we won't be blindsided in the exam and that the exam would be straightforward. Well I guess it was as
        as they; you can trust a dishonest man to be dishonest. After the course when I had a chance to stop and reflect at what I had learned, I realized that all I really learned was that
        unit testing is useful, which is cool I guess. Also I have been told that barely anyone uses formal specs in the industry (except for specific teams) so its good to know I went through all
        that effort for nothing.`,
        isAnonymous: false,
        upvoterIDs: {},
        downvoterIDs: {},
        datetime: moment().clone().subtract(1, 'month').valueOf(),
        replies: [{
            userID: users[1].userID,
            comment: "I agree",
            datetime: moment().valueOf()
        }],
        tags: {
            [ReviewTag.HELPFUL]: {},
            [ReviewTag.DETAILED]: {},
            [ReviewTag.ACCURATE]: {}
        }
    },
    {
        reviewID: uuidv4(),
        instanceID: instances[1].instanceID,
        userID: users[0].userID,
        difficulty: 3,
        enjoyability: 2,
        workload: 1,
        comment: `Ok, so this course was doable in terms of difficulty. The assigments were super hard while the midterms and quizzes were things I could handle. There was too much work
        and a lot of it seemed unnecessary. I did not enjoy doing the assignments as they were very tedious to finish.
        `,
        isAnonymous: false,
        upvoterIDs: {},
        downvoterIDs: {},
        datetime: moment().valueOf(),
        replies: [{
            userID: users[1].userID,
            comment: "I agree",
            datetime: moment().valueOf()
        }],
        tags: {
            [ReviewTag.HELPFUL]: {},
            [ReviewTag.DETAILED]: {},
            [ReviewTag.ACCURATE]: {}
        }
    },
    {
        reviewID: uuidv4(),
        instanceID: instances[2].instanceID,
        userID: users[2].userID,
        difficulty: 5,
        enjoyability: 5,
        workload: 4,
        comment: "I personaly enjoyed the course a lot and I think it's one of the best courses I've taken! The professor was super nice and I thing he did a great job teaching",
        isAnonymous: false,
        upvoterIDs: {},
        downvoterIDs: {},
        datetime: moment().valueOf(),
        replies: [{
            userID: users[1].userID,
            comment: "I agree",
            datetime: moment().valueOf()
        }],
        tags: {
            [ReviewTag.HELPFUL]: {},
            [ReviewTag.DETAILED]: {},
            [ReviewTag.ACCURATE]: {}
        }
    },
    {
        reviewID: uuidv4(),
        instanceID: instances[2].instanceID,
        userID: users[2].userID,
        difficulty: 5,
        enjoyability: 1,
        workload: 4,
        comment: "ez but boring course. The professor was cool tho.",
        isAnonymous: false,
        upvoterIDs: {},
        downvoterIDs: {},
        datetime: moment().valueOf(),
        replies: [{
            userID: users[1].userID,
            comment: "I agree",
            datetime: moment().valueOf()
        }],
        tags: {
            [ReviewTag.HELPFUL]: {},
            [ReviewTag.DETAILED]: {},
            [ReviewTag.ACCURATE]: {}
        }
    }
]