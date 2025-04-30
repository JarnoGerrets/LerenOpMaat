//Deze worden geladen als de gebruiker nog geen leerroute/ niet complete leerroute heeft.
export const dummySemester1 = {
    Id: 600000,
    Year: new Date().getFullYear(),
    SemesterNumber: 1,
    Module: {
        Id: 200000,
        Name: "Selecteer je module",
        description: "Selecteer je module",
    },
    locked: false,
    Description: `2027-01-01T00:00:00Z`,
};

export const dummySemester2 = {
    Id: 500000,
    Year: new Date().getFullYear(),
    SemesterNumber: 2,
    Module: {
        Id: 300000,
        Name: "Selecteer je module",
        Description: "Selecteer je module",
    },
    locked: false,
    startDate: `2027-10-07T00:00:00Z`,
};

//Dummy modules data
export const modulesDummyData = [
    { Id: 1, Name: "Introduction to Programming", Description: "Introduction to Programming", Category: 'SE' },
    { Id: 2, Name: "Web Development Basics", Description: "Web Development Basics", Category: 'BIM' },
    { Id: 3, Name: "Data Structures and Algorithms", Description: "Data Structures and Algorithms", Category: 'IDNS' },
    { Id: 4, Name: "Database Management Systems", Description: "Database Management Systems", Category: 'SE' },
    { Id: 5, Name: "Introduction to Programming", Description: "Introduction to Programming", Category: 'BIM' },
    { Id: 6, Name: "Web Development Basics", Description: "Web Development Basics", Category: 'IDNS' },
    { Id: 7, Name: "Data Structures and Algorithms", Description: "Data Structures and Algorithms", Category: 'SE' },
    { Id: 8, Name: "Database Management Systems", Description: "Database Management Systems", Category: 'BIM' },
    { Id: 9, Name: "Introduction to Programming", Description: "Introduction to Programming", Category: 'IDNS' },
    { Id: 10, Name: "Web Development Basics", Description: "Web Development Basics", Category: 'SE' },
    { Id: 11, Name: "Data Structures and Algorithms", Description: "Data Structures and Algorithms", Category: 'BIM' },
    { Id: 12, Name: "Database Management Systems", Description: "Database Management Systems", Category: 'IDNS' },
    { Id: 13, Name: "Data Structures and Algorithms", Description: "Data Structures and Algorithms", Category: 'BIM' },
    { Id: 14, Name: "Database Management Systems", Description: "Database Management Systems", Category: 'IDNS' },
    { Id: 15, Name: "Database Management Systems", Description: "Database Management Systems", Category: 'IDNS' }
]

