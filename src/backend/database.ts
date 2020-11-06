import { Course, Term, Record, Status, User, Breakdown, Review } from "../data/types";
import { v4 as uuidv4 } from 'uuid'

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

const coursesdb: [[Term, number], [string, string], string, string][] = [
    [[Term.FALL, 2017], ["SFWRENG", "2AA4"], "Spencer Smith"            , "Software Design I - Introduction to Software Development"],
    [[Term.FALL, 2017], ["SFWRENG", "2C03"], "George Karakostas"        , "Data Structures and Algorithms"],
    [[Term.FALL, 2017], ["SFWRENG", "2DA4"], "Ryan Leduc"               , "Digital Systems and Interfacing"],
    [[Term.FALL, 2017], ["SFWRENG", "2DM3"], "Wolfram Kahl"             , "Discrete Mathematics with Applications I"],
    [[Term.FALL, 2017], ["SFWRENG", "2FA3"], "William Farmer"           , "Discrete Mathematics and Applications II"],
    [[Term.FALL, 2017], ["SFWRENG", "2GA3"], "Ryan Leduc"               , "Computer Architecture"],
    [[Term.FALL, 2017], ["SFWRENG", "2S03"], "Ned Nedialkov"            , "Principles of Programming"],
    [[Term.FALL, 2017], ["SFWRENG", "2XA3"], "Franya Franek"            , "Software Engineering Practice and Experience: Software Development Skills"],
    [[Term.FALL, 2017], ["SFWRENG", "2XB3"], "Reza Samavi"              , "Software Engineering Practice and Experience: Binding Theory to Practice"],
    [[Term.FALL, 2017], ["SFWRENG", "3A04"], "Ridha Khedri"             , "Software Design III - Large System Design"],
    [[Term.FALL, 2017], ["SFWRENG", "3BB4"], "Emil Sekerenski"          , "Software Design II - Concurrent System Design"],
    [[Term.FALL, 2017], ["SFWRENG", "3DB3"], "Asghar Bokhari"           , "Databases"],
    [[Term.FALL, 2017], ["SFWRENG", "3DX4"], "Mark Lawford"             , "Dynamic Systems and Control"],
    [[Term.FALL, 2017], ["SFWRENG", "3I03"], "Fei Chiang"               , "Communication Skills"],
    [[Term.FALL, 2017], ["SFWRENG", "3MX3"], "Martin v. Mohrenschildt"  , "Signals and Systems"],
    [[Term.FALL, 2017], ["SFWRENG", "3O03"], "Antoine Deza"             , "Linear Optimization"],
    [[Term.FALL, 2017], ["SFWRENG", "3RA3"], "Ryzard Janicki"           , "Software Requirements and Security Considerations"],
    [[Term.FALL, 2017], ["SFWRENG", "3S03"], "Alicia Marinach"          , "Software Testing"],
    [[Term.FALL, 2017], ["SFWRENG", "3SH3"], "Ghada Badawy"             , "Operating Systems"],
    [[Term.FALL, 2017], ["SFWRENG", "3XA3"], "Asghar Bokhari"           , "Software Engineering Practice and Experience: Software Project Management"],
    [[Term.FALL, 2017], ["SFWRENG", "4AA4"], "Wenbo He"                 , "Real-Time Systems and Control Applications"],
    [[Term.FALL, 2017], ["SFWRENG", "4C03"], "Rong Zheng"               , "Computer Networks and Security"],
    [[Term.FALL, 2017], ["SFWRENG", "4E03"], "Douglas Down"             , "Performance Analysis of Computer Systems"],
    [[Term.FALL, 2017], ["SFWRENG", "4F03"], "Peter Robinson"           , "Parallel Computing"],
    [[Term.FALL, 2017], ["SFWRENG", "4G06"], "Alan Wassyng"             , "Software Design IV - Capstone Design Project"],
    [[Term.FALL, 2017], ["SFWRENG", "4HC3"], "Kevin Browne"             , "Human Computer Interfaces"],
    [[Term.FALL, 2017], ["SFWRENG", "4X03"], "Ned Nedialkov"            , "Scientific Computation"]
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
]

/**
 * The current logged in userID
 */
export const USERID = users[0].userID;

/**
 * The courses in our fake database
 */
export const courses: Course[] = coursesdb.map(([[term, year], [subject, code], instructor, name]) => {
    return {
        courseID: uuidv4(),
        identifier: {
            code: code,
            subject: subject
        },
        instructor: instructor,
        name: name,
        semester: {
            term: term,
            year: year
        }
    }
})

/**
 * The academic records in our fake database.
 */
export const records: Record[] = [
    {
        recordID: uuidv4(),
        status: Status.IN_PROGRESS,
        courseID: courses[0].courseID,
        userID: users[0].userID
    },
    {
        recordID: uuidv4(),
        status: Status.TAKEN,
        courseID: courses[4].courseID,
        userID: users[0].userID,
        grade: 12
    },
    {
        recordID: uuidv4(),
        status: Status.TAKEN,
        courseID: courses[7].courseID,
        userID: users[1].userID,
        grade: 9
    }
]

/**
 * The breakdowns in our fake database.
 */
export const breakdowns: Breakdown[] = [

]

/**
 * The reviews in our fake database.
 */
export const reviews: Review[] = [

]