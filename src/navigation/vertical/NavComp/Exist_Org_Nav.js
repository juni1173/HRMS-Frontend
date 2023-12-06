import { Circle, Home, Briefcase, User, Settings, CheckSquare, BookOpen, Bookmark, Trello, Book } from 'react-feather'
// const checkVisibility = (list, apiList) => {
  
//   for (let i = 0; i < apiList.length; i++) {
//       const index = list.findIndex(obj => obj.title.toLowerCase() === apiList[i].title.toLowerCase())
//       // if (apiList[i].)
//       if (index !== -1) {
//         // final_nav = [...list, {id: apiList[i].id,
//         // title: apiList[i].title,
//         // icon: <CheckSquare size={20} />,
//         // navLink: apiList[i].navLink ? apiList[i].navLink : '/'}]
//     list.splice(index, 1)
//     }
//     return list
//   }
// }
let nav = []
 nav =  [
  ...nav,
  {
    id: 'nsv-Organization',
    title: 'Organization',
    icon: <Home size={20} />,
    navLink: '/organizationHome'
  },
  
  {
    id: 'nav-employee-information',
    title: 'Employees',
    icon: <User size={30} />,
    navLink:'/employeeList'
    
  },
  {
    id: 'nav-attendance',
    title: 'Attendance',
    icon: <User size={30} />,
    navLink:'/admin/attendance'
    
  },
  {
    id: 'Recruitment',
    title: 'Recruitment',
    icon: <Briefcase size={20} />,
    children: [
      {
        id: 'nav-job-setting',
        title: 'Jobs Setup',
        icon: <Circle size={20} />,
        children: [     
          {
            id: 'nav-job',
            title: 'Jobs List',
            icon: <Circle size={12} />,
            navLink: '/jobs'
          }, 
          {
            id: 'nav-position',
            title: 'Positions',
            icon: <Circle size={12} />,
            navLink: '/positions'
          },
          {
            id: 'nav-job-description',
            title: 'Job Description',
            icon: <Circle size={12} />,
            navLink: '/job-description'
          },
          {
            id: 'nav-interview-questions',
            title: 'Interview Questions',
            icon: <Circle size={12} />,
            navLink: '/questions'
          }
        ]
      },
      {
        id: 'nav-candidates',
        title: 'Candidates',
        icon: <User size={20} />,
        navLink: '/candidates'
      }
      
    ]
    
  },
  {
    id: 'nav-Learning-Development',
    title: 'Learning & Development',
    icon: <BookOpen size={30}/>,
    children: [     
      {
        id: 'nav-certifications',
        title: 'Certifications',
        icon: <Book size={30} />,
        navLink: '/hr/certifications'
      },
      {
        id: 'nav-trainings',
        title: 'Trainings',
        icon: <Book size={30} />,
        navLink: '/hr/trainings'
      }
      // {
      //   id: 'L&D_Dashboard',
      //   title: 'Dashboard',
      //   icon: <Circle size={12} />,
      //   navLink: '/learning_development/dashboard'
      // },
      // {
      //   id: 'Employee Sheet',
      //   title: 'Employee Sheet',
      //   icon: <Circle size={12} />,
      //   navLink: '/learning_development/employee/sheet'
      // },
      // {
      //   id: 'Subjects',
      //   title: 'Subjects',
      //   icon: <Circle size={12} />,
      //   navLink: '/subjects'
      // },
      // {
      //   id: 'Programs',
      //   title: 'Programs',
      //   icon: <Circle size={12} />,
      //   navLink: '/programs'
      // },
      // {
      //   id: 'Courses',
      //   title: 'Courses',
      //   icon: <Circle size={12} />,
      //   navLink: '/courses'
      // },
      // {
      //   id: 'Instructor',
      //   title: 'Instructors',
      //   icon: <Circle size={12} />,
      //   navLink: '/instructor'
      // },
      // {
      //   id: 'Sessions',
      //   title: 'Sessions',
      //   icon: <Circle size={12} />,
      //   navLink: '/course-sessions'
      // },
      // {
      //   id: 'applicants_trainees',
      //   title: 'Applicants/Trainees',
      //   icon: <Circle size={12} />,
      //   navLink: '/applicants/trainees'
      // }
    ] 
    
  },

  {
    id: 'nav-projects',
    title: 'Projects',
    icon: <CheckSquare size={30} />,
    navLink: '/projects'
  },
  {
    id: 'nav-jira-projects',
    title: 'Jira',
    icon: <CheckSquare size={30} />,
    navLink: '/jira'
  },
  
  {
    id: 'nav-kind_notes',
    title: 'Kind Notes',
    icon: <Bookmark size={30} />,
    navLink: '/kind_notes'
  },
  // {
  //   id: 'nav-roles-permissions',
  //   title: 'Roles & Permissions',
  //   icon: <Bookmark size={30} />,
  //   navLink: '/rolesandpermissions'
  // },
  {
    id: 'nav-status-approvals',
    title: 'Allowances Requests',
    icon: <Bookmark size={30} />,
    navLink: '/statusrequests'
  },

  {
        id: 'nav-configurations',
        title: 'Configurations',
        icon: <Settings size={12} />,
        navLink: '/configurations'
  },
  {
    id: 'nav-manuals',
    title: 'SOP / EPM',
    icon: <Bookmark size={30} />,
    navLink: '/employee/manuals'
  },
  {
    id: 'nav-kpi',
    title: 'KPI',
    icon: <Settings size={12} />,
    navLink: '/hr/kpi'
},
  {
      id: 'nav-kavskills',
      title: 'KavSkills',
      icon: <Settings size={12} />,
      navLink: '/hr/kavskills'
  },
  {
    id: 'nav-reports',
    title: 'Reports',
    icon: <Trello size={12} />,
    navLink: '/reports'
}
]

export default nav
