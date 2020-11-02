import { Course, Term, Record, Status } from "../data/types";
import { v4 as uuidv4 } from 'uuid'

/**
SFWRENG 2C03 - Data Structures and Algorithms
SFWRENG 2DA4 - Digital Systems and Interfacing
SFWRENG 2DM3 - Discrete Mathematics with Applications I
SFWRENG 2FA3 - Discrete Mathematics and Applications II
SFWRENG 2GA3 - Computer Architecture
SFWRENG 2MD3 - Data Structures, Algorithms, and Language Concepts for Mechatronics
SFWRENG 2MP3 - Programming for Mechatronics
SFWRENG 2S03 - Principles of Programming
SFWRENG 2XA3 - Software Engineering Practice and Experience: Software Development Skills
SFWRENG 2XB3 - Software Engineering Practice and Experience: Binding Theory to Practice
SFWRENG 3A04 - Software Design III - Large System Design
SFWRENG 3BB4 - Software Design II - Concurrent System Design
SFWRENG 3DB3 - Databases
SFWRENG 3DX4 - Dynamic Systems and Control
SFWRENG 3FP3 - Functional Programming
SFWRENG 3GB3 - Game Design
SFWRENG 3GC3 - Computer Graphics
SFWRENG 3I03 - Communication Skills
SFWRENG 3K04 - Software Development
SFWRENG 3MD3 - Safe Software-Intensive Medical Devices
SFWRENG 3MX3 - Signals and Systems
SFWRENG 3O03 - Linear Optimization
SFWRENG 3RA3 - Software Requirements and Security Considerations
SFWRENG 3S03 - Software Testing
SFWRENG 3SH3 - Operating Systems
SFWRENG 3XA3 - Software Engineering Practice and Experience: Software Project Management
SFWRENG 4AA4 - Real-Time Systems and Control Applications
SFWRENG 4AD3 - Advanced Databases
SFWRENG 4C03 - Computer Networks and Security
SFWRENG 4E03 - Performance Analysis of Computer Systems
SFWRENG 4F03 - Parallel Computing
SFWRENG 4G06 - Software Design IV - Capstone Design Project
SFWRENG 4HC3 - Human Computer Interfaces
SFWRENG 4J03 - Communications Systems
SFWRENG 4TE3 - Continuous Optimization
SFWRENG 4TH3 - Theory of Computation
SFWRENG 4X03 - Scientific Computation
COMPSCI 1DM3 - Discrete Mathematics for Computer Science
COMPSCI 1JC3 - Introduction to Computational Thinking
COMPSCI 1MD3 - Introduction to Programming
COMPSCI 1TA3 - Elementary Computing and Computer Use
COMPSCI 1XC3 - Computer Science Practice and Experience: Development Basics
COMPSCI 1XD3 - Computer Science Practice and Experience: Introduction to Software Design Using Web Programming
COMPSCI 2AC3 - Automata and Computability
COMPSCI 2C03 - Data Structures and Algorithms
COMPSCI 2DB3 - Databases
COMPSCI 2DM3 - Discrete Mathematics with Applications I
COMPSCI 2FA3 - Discrete Mathematics with Applications II
COMPSCI 2GA3 - Computer Architecture
COMPSCI 2LC3 - Logical Reasoning for Computer Science
COMPSCI 2ME3 - Introduction to Software Development
COMPSCI 2S03 - Principles of Programming
COMPSCI 2SD3 - Concurrent Systems
COMPSCI 2XA3 - Computer Science Practice and Experience: Software Development Skills
COMPSCI 2XB3 - Computer Science Practice and Experience: Binding Theory to Practice
COMPSCI 2XC3 - Computer Science Practice and Experience: Algorithms and Software Design
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
COMPSCI 4Z03 - Directed Readings
COMPSCI 4ZP6 - Capstone Project
 */

const coursesdb: [[Term, number], [string, string], string, string][] = [
    [[Term.FALL, 2017], ["SFWRENG", "2AA4"], "Spencer Smith"            , "Software Design I - Introduction to Software Development"],
    [[Term.FALL, 2017], ["SFWRENG", "2C03"], "George Karakostas"        , "Data Structures and Algorithms"],
    [[Term.FALL, 2017], ["SFWRENG", "2DA4"], "Ryan Leduc"               , "Digital Systems and Interfacing"],
    [[Term.FALL, 2017], ["SFWRENG", "2DM3"], "Wolfram Kahl"             , "Discrete Mathematics with Applications I"],
    [[Term.FALL, 2017], ["SFWRENG", "2FA3"], "William Farmer"           , "Discrete Mathematics and Applications II"],
    [[Term.FALL, 2017], ["SFWRENG", "2GA3"], "Ryan Leduc"               , "Computer Architecture"],
    [[Term.FALL, 2017], ["SFWRENG", "2MD3"], "?"                        , "Data Structures, Algorithms, and Language Concepts for Mechatronics"],
    [[Term.FALL, 2017], ["SFWRENG", "2MP3"], "?"                        , "Programming for Mechatronics"],
    [[Term.FALL, 2017], ["SFWRENG", "2S03"], "Ned Nedialkov"            , "Principles of Programming"],
    [[Term.FALL, 2017], ["SFWRENG", "2XA3"], "Franya Franek"            , "Software Engineering Practice and Experience: Software Development Skills"],
    [[Term.FALL, 2017], ["SFWRENG", "2XB3"], "Reza Samavi"              , "Software Engineering Practice and Experience: Binding Theory to Practice"],
    [[Term.FALL, 2017], ["SFWRENG", "3A04"], "Ridha Khedri"             , "Software Design III - Large System Design"],
    [[Term.FALL, 2017], ["SFWRENG", "3BB4"], "Emil Sekerenski"          , "Software Design II - Concurrent System Design"],
    [[Term.FALL, 2017], ["SFWRENG", "3DB3"], "Asghar Bokhari"           , "Databases"],
    [[Term.FALL, 2017], ["SFWRENG", "3DX4"], "Mark Lawford"             , "Dynamic Systems and Control"],
    [[Term.FALL, 2017], ["SFWRENG", "3FP3"], "?"                        , "Functional Programming"],
    [[Term.FALL, 2017], ["SFWRENG", "3GB3"], "?"                        , "Game Design"],
    [[Term.FALL, 2017], ["SFWRENG", "3GC3"], "?"                        , "Computer Graphics"],
    [[Term.FALL, 2017], ["SFWRENG", "3I03"], "Fei Chiang"               , "Communication Skills"],
    [[Term.FALL, 2017], ["SFWRENG", "3K04"], "?"                        , "Software Development"],
    [[Term.FALL, 2017], ["SFWRENG", "3MD3"], "?"                        , "Safe Software-Intensive Medical Devices"],
    [[Term.FALL, 2017], ["SFWRENG", "3MX3"], "Martin v. Mohrenschildt"  , "Signals and Systems"],
    [[Term.FALL, 2017], ["SFWRENG", "3O03"], "Antoine Deza"             , "Linear Optimization"],
    [[Term.FALL, 2017], ["SFWRENG", "3RA3"], "Ryzard Janicki"           , "Software Requirements and Security Considerations"],
    [[Term.FALL, 2017], ["SFWRENG", "3S03"], "Alicia Marinach"          , "Software Testing"],
    [[Term.FALL, 2017], ["SFWRENG", "3SH3"], "Ghada Badawy"             , "Operating Systems"],
    [[Term.FALL, 2017], ["SFWRENG", "3XA3"], "?", "?"],
    [[Term.FALL, 2017], ["SFWRENG", "4AA4"], "?", "?"],
    [[Term.FALL, 2017], ["SFWRENG", "4AD3"], "?", "?"],
    [[Term.FALL, 2017], ["SFWRENG", "4C03"], "?", "?"],
    [[Term.FALL, 2017], ["SFWRENG", "4E03"], "?", "?"],
    [[Term.FALL, 2017], ["SFWRENG", "4F03"], "?", "?"],
    [[Term.FALL, 2017], ["SFWRENG", "4G06"], "?", "?"],
    [[Term.FALL, 2017], ["SFWRENG", "4HC3"], "?", "?"],
    [[Term.FALL, 2017], ["SFWRENG", "4J03"], "?", "?"],
    [[Term.FALL, 2017], ["SFWRENG", "4TE3"], "?", "?"],
    [[Term.FALL, 2017], ["SFWRENG", "4TH3"], "?", "?"],
    [[Term.FALL, 2017], ["SFWRENG", "4X03"], "?", "?"]
]

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

export const records: Record[] = [
    {
        recordID: uuidv4(),
        status: Status.IN_PROGRESS,
        courseID: courses[0].courseID
    }
]
