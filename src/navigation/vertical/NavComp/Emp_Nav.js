import { Home, CheckSquare, Bookmark, HelpCircle, Book, Clock } from 'react-feather'
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
    id: 'nsv-Dashboard',
    title: 'Dashboard',
    icon: <Home size={20} />,
    navLink: '/employee/dashboard'
  },
  
//   {
//     id: 'nav-Learning-Development',
//     title: 'Learning & Development',
//     icon: <BookOpen size={30}/>,
//     children: [     
//       {
//         id: 'L&D_Dashboard',
//         title: 'Dashboard',
//         icon: <Circle size={12} />,
//         navLink: '/learning_development/dashboard'
//       },
//       {
//         id: 'Employee Sheet',
//         title: 'Employee Sheet',
//         icon: <Circle size={12} />,
//         navLink: '/learning_development/employee/sheet'
//       },
//       {
//         id: 'Subjects',
//         title: 'Subjects',
//         icon: <Circle size={12} />,
//         navLink: '/subjects'
//       },
//       {
//         id: 'Programs',
//         title: 'Programs',
//         icon: <Circle size={12} />,
//         navLink: '/programs'
//       },
//       {
//         id: 'Courses',
//         title: 'Courses',
//         icon: <Circle size={12} />,
//         navLink: '/courses'
//       },
//       {
//         id: 'Instructor',
//         title: 'Instructors',
//         icon: <Circle size={12} />,
//         navLink: '/instructor'
//       },
//       {
//         id: 'Sessions',
//         title: 'Sessions',
//         icon: <Circle size={12} />,
//         navLink: '/course-sessions'
//       },
//       {
//         id: 'applicants_trainees',
//         title: 'Applicants/Trainees',
//         icon: <Circle size={12} />,
//         navLink: '/applicants/trainees'
//       }
//     ] 
    
//   },

//   {
//     id: 'nav-projects',
//     title: 'Projects',
//     icon: <CheckSquare size={30} />,
//     navLink: '/projects'
//   },
    {
        id: 'nav-requests',
        title: 'ESS Requests',
        icon: <HelpCircle size={30} />,
        navLink: '/requests'
    },
    {
        id: 'nav-attendance',
        title: 'Attendance',
        icon: <Clock size={30} />,
        navLink: '/attendancelist'
      },
  {
    id: 'nav-kind_notes',
    title: 'Kind Notes',
    icon: <Bookmark size={30} />,
    navLink: '/kind_notes'
  },
  
  {
    id: 'nav-kpi',
    title: 'KPI',
    icon: <Bookmark size={30} />,
    navLink: '/employee/kpi'
  },
  {
    id: 'nav-manuals',
    title: 'SOP / EPM',
    icon: <Bookmark size={30} />,
    navLink: '/employee/manuals'
  },
  {
    id: 'nav-l&d',
    title: 'Learning & Development',
    icon: <Book size={30} />,
    navLink: '/employeelearninganddevelopment'
  }
//   {
//     id: 'nav-roles-permissions',
//     title: 'Roles & Permissions',
//     icon: <Bookmark size={30} />,
//     navLink: '/rolesandpermissions'
//   },

//   {
//         id: 'nav-configurations',
//         title: 'Configurations',
//         icon: <Settings size={12} />,
//         navLink: '/configurations'
//   }
]

export default nav
