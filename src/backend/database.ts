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
    ["SFWRENG", "4X03", "Scientific Computation"],
    ["ECON", "1B03", "Introduction to Microeconomics"],
    ["ECON", "1BB3", "Introduction to Macroeconomics"],
    ["ECON", "2A03", "Economics of Labour-Market Issues"],
    ["ECON", "2B03", "Analysis of Economic Data"],
    ["ECON", "2D03", "Economic Issues"],
    ["ECON", "2K03", "Economic History of Canada"],
    ["LIFESCI", "1D03", "Medical Imaging Physics"],
    ["LIFESCI", "2A03", "Research Methods in Life Sciences"],
    ["LIFESCI", "2AA3", "Intro Topics in Life Sciences"],
    ["LIFESCI", "3AA3", "Human Pathophysiology"],
    ["LIFESCI", "3BP3", "Modeling Life"],
    ["LIFESCI", "3G03", "Introduction to Epidemiology"],
    ["CHEMENG", "2D04", "Chemical Engineering Principles I"],
    ["CHEMENG", "2E04", "Numerical Methods"],
    ["CHEMENG", "3A04", "Heat Transfer"],
    ["CHEMENG", "3BM3", "Bioseperations Engineering"],
    ["CHEMENG", "3BK3", "Bio-reaction Engineering"],
    ["ENGPHYS", "2A04", "Electricity and Magnetism"],
    ["ENGPHYS", "2CM4", "Computational Multiphysics"],
    ["ENGPHYS", "2E04", "Analog and Digital Circuits"],
    ["ENGPHYS", "3BA4", "Circuitts with Non-Linear Components"],
    ["ENGPHYS", "3D03", "Principles of Nuclear Engineering"],
    ["COMMERCE", "1AA3", "Financial Accounting"],
    ["COMMERCE", "1B03", "Strategic Management"],
    ["COMMERCE", "1BA3", "Human Resources and Management"],
    ["COMMERCE", "1MA3", "Introduction to Marketing"],
    ["COMMERCE", "2FA3", "Introduction to Finance"],
    ["COMMERCE", "2KA3", "Information Systems in Management"],
    ["COMMERCE", "2QA3", "Financial Accounting"],
    ["COMMERCE", "3FB3", "Security Analysis"],
    ["BIO", "1A03", "Cellular and Molecular Biology"],
    ["BIO", "1M03", "Biodiversity, Evolution & Humanity"],
    ["BIO", "1P03", "Introductory Biology"],
    ["BIO", "2C03", "Genetics"],
    ["BIO", "2F03", "Fundamental & Applied Ecology"],
    ["BIO", "3EI3", "Ecological Indicators"],
    ["MOLBIOL", "3M03", "Fundemental Concepts of Development"],
    ["MOLBIOL", "3O03", "Microbial Genetics"],
    ["MOLBIOL", "3Y03", "Plant Responses to the Environment"],
    ["MOLBIOL", "3V03", "Techniques in Molecular Genetics"],
    ["CLASSICS", "1A03", "Introduction to Classical Archaeology"],
    ["CLASSICS", "1B03", "Introduction to Ancient Myth and Literature"],
    ["CLASSICS", "2K03", "The Society of Greece and Rome"],
    ["CLASSICS", "3MT3", "Advanced Ancient Roots of Medical Terminology"],
    ["CLASSICS", "4F03", "Seminar in Ancient History"],
    ["GREEK", "1Z03", "Beginners’ Introduction to Ancient Greek"],
    ["GREEK", "2A03", "Intermediate Greek 1"],
    ["GREEK", "3BB3", "Topics in Greek Literature"],
    ["LATIN", "1ZZ3", "Beginners’ Introduction to Latin 2"],
    ["LATIN", "2AA3", "Intermediate Latin 2"],
    ["LATIN", "3BB3", "Topics in Latin Literature"],
    ["KINESIOL", "1A03", "Human Anatomy and Physiology"],
    ["KINESIOL", "1E03", "Motor Control and Learning"],
    ["KINESIOL", "1K03", "Foundations in Kinesiology"],
    ["KINESIOL", "2A03", "Biomechanics"],
    ["KINESIOL", "2G03", "Health Psychology"]
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
        courseID: courses[0].courseID, //SFWRENG 2AA4
        instructor: "Spencer Smith",
        term: Term.FALL,
        year: 2010 + i
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[11].courseID,
        instructor: "Ridha Khedri", //SFWRENG 3A04
        term: Term.WINTER,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[3].courseID, //SFWRENG 2DM3
        instructor: "Wolfram Kahl",
        term: Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[10].courseID, //SFWR3BB4
        instructor: "Emil Sekerinski",
        term: Term.WINTER,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[22].courseID, //SFWR4E03
        instructor: "Douglas Down",
        term: Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[27].courseID,
        instructor: "Hannah Holmes", //ECOn 1B03
        term: (i % 2) ? Term.WINTER : Term.FALL,
        year: 2015 + (i % 2)
    })),
    ...Array(6).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[57].courseID, //BIO1A03
        instructor: "Aleksandra Gajic",
        term: (i % 2) ? Term.WINTER : Term.FALL,
        year: 2017 + (i % 2)
    })),
    ...Array(4).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[57].courseID, //Bio1A03
        instructor: "Katie Moisse",
        term: (i % 2) ? Term.WINTER : Term.FALL,
        year: 2015 + (i % 2)
    })),
    ...Array(6).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[59].courseID, //BIO
        instructor: "Katie Moisse",
        term: (i % 2) ? Term.WINTER : Term.FALL,
        year: 2017 + (i % 2)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[58].courseID, //BIO
        instructor: "Janet Pritchard",
        term: Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[33].courseID, //LIFESCI
        instructor: "Jonathan Reeves",
        term: Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[34].courseID, //LIFESCI
        instructor: "Jonathan Reeves",
        term: Term.WINTER,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[35].courseID, //LIFESCI
        instructor: "Jonathan Reeves",
        term: Term.WINTER,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[36].courseID, //LIFESCI
        instructor: "Stephen Russel",
        term: Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[37].courseID, //CHEMENG
        instructor: "Stephen Russel",
        term: Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[38].courseID, //CHEMENG
        instructor: "Michele George",
        term: Term.WINTER,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[41].courseID, //CHEMENG
        instructor: "Stephen Russel",
        term: Term.WINTER,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[44].courseID, //ENGPHYS
        instructor: "Kim Jones",
        term: Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[45].courseID, //ENGPHYS
        instructor: "Kim Jones",
        term: Term.WINTER,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[46].courseID, //ENGPHYS
        instructor: "Kim Jones",
        term: Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[49].courseID, //COMMERCE
        instructor: "Ashfin Vafael",
        term: Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[50].courseID, //COMMERCE
        instructor: "Ashfin Vafael",
        term: Term.WINTER,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[53].courseID, //COMMERCE
        instructor: "Ashfin Vafael",
        term: (i % 2) ? Term.WINTER : Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[63].courseID, //MOLBIOL
        instructor: "Kim Jones",
        term: (i % 2) ? Term.WINTER : Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[64].courseID, //MOLBIOL
        instructor: "Kim Jones",
        term: Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[65].courseID, //MOLBIOL
        instructor: "Claude Eilers",
        term: Term.WINTER,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[67].courseID, //CLASSICS
        instructor: "Kathryn Mattison",
        term: (i % 2) ? Term.WINTER : Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[68].courseID, //CLASSICS
        instructor: "Kathryn Mattison",
        term: Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[72].courseID, //GREEK
        instructor: "Patricia White",
        term: Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[73].courseID, //GREEK
        instructor: "Patricia White",
        term: Term.WINTER,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[74].courseID, //GREEK
        instructor: "Patricia White",
        term: (i % 2) ? Term.WINTER : Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[75].courseID, //LATIN
        instructor: "Patricia White",
        term: Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[76].courseID, //LATIN
        instructor: "Patricia White",
        term: Term.WINTER,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[77].courseID, //LATIN
        instructor: "Patricia White",
        term: (i % 2) ? Term.WINTER : Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[78].courseID, //KINESIOL
        instructor: "Spencer Pope",
        term: Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[79].courseID, //KINESIOL
        instructor: "Spencer Pope",
        term: Term.WINTER,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[80].courseID, //KINESIOL
        instructor: "Sankar Renganathan",
        term: (i % 2) ? Term.WINTER : Term.FALL,
        year: 2010 + (i)
    })),
    ...Array(10).fill(undefined).map((_, i) => ({
        instanceID: uuidv4(),
        courseID: courses[1].courseID,
        instructor: "George Karakostas", //SFWRENG 2C03
        term: Term.FALL,
        year: 2010 + (i)
    })),
]

/**
 * The academic records in our fake database.
 */
export const records: Record[] = [
    {
        recordID: uuidv4(),
        status: Status.IN_PROGRESS,
        instanceID: instances[8].instanceID,
        userID: USERID,
    },
    {
        recordID: uuidv4(),
        status: Status.TAKEN,
        instanceID: instances[19].instanceID,
        userID: USERID,
        grade: 12
    },
    {
        recordID: uuidv4(),
        status: Status.TAKEN,
        instanceID: instances[37].instanceID,
        userID: USERID,
        grade: 9
    },
    {
        recordID: uuidv4(),
        status: Status.TAKEN,
        instanceID: instances[47].instanceID,
        userID: USERID,
        grade: 6
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
    },
    {
        breakdownID: uuidv4(),
        instanceID: instances[39].instanceID,
        userID: users[3].userID,
        datetime: moment().valueOf(),
        marks: [
            {
                type: Assessments.MIDTERMS,
                weight: 30,
                count: 3
            },
            {
                type: Assessments.EXAMS,
                weight: 50,
                count: 1
            },
            {
                type: Assessments.ASSIGNMENTS,
                weight: 20,
                count: 5
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
        comment: `This assessments for this course are hit or miss in terms of what you are able to learn from them. The coding portions of the assignments were easy and helpful, especially when we need to use unit testing which helped us learn about the test driven development process. The downside to the assignments was that we were required to construct a formal specification document for select assignments. The task here was to create a set of specs that mathematically describe the inputs and the correlating outputsThe irony here is that the instructions were so vague given that the document had to be very specific (so specific that mathematical language needed to be used to reduce any ambiguity). I had to use a 100% of 10% of my brain power to complete these specs at a satisfactory level. My complaints don't just stop there. The midterm and exam for this course is so next level that you would probably need to take an escalator just to understand the first question you see. One of the questions on the exam was designed so 90% of the class would be prevented from saying that they got that question right. And this was after the professor had said that we won't be blindsided in the exam and that the exam would be straightforward. Well I guess it was as as they; you can trust a dishonest man to be dishonest. After the course when I had a chance to stop and reflect at what I had learned, I realized that all I really learned was that unit testing is useful, which is cool I guess. Also I have been told that barely anyone uses formal specs in the industry (except for specific teams) so its good to know I went through all that effort for nothing.`,
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
        comment: `Ok, so this course was doable in terms of difficulty. The assigments were super hard while the midterms and quizzes were things I could handle. There was too much work and a lot of it seemed unnecessary. I did not enjoy doing the assignments as they were very tedious to finish.`,
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