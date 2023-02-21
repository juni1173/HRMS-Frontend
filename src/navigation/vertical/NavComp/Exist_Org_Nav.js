import { Circle, Home, Briefcase, User, Settings, CheckSquare, BookOpen, Bookmark } from 'react-feather'

export default [
  {
    id: 'nsv-Organization',
    title: 'Organization',
    icon: <Home size={20} />,
    navLink: '/organizationHome'
  },
  
  {
    id: 'nav-employee-information',
    title: 'Employee',
    icon: <User size={30} />,
    children: [     
      {
        id: 'nav-add-employee',
        title: 'Add Employee',
        icon: <Circle size={12} />,
        navLink: '/employeeInformation'
      },
      {
        id: 'nav-view-employee',
        title: 'Employee List',
        icon: <Circle size={12} />,
        navLink: '/employeeList'
      }
    ] 
    
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
        id: 'L&D_Dashboard',
        title: 'Dashboard',
        icon: <Circle size={12} />,
        navLink: '/learning_development/dashboard'
      },
      {
        id: 'Subjects',
        title: 'Subjects',
        icon: <Circle size={12} />,
        navLink: '/subjects'
      },
      {
        id: 'Programs',
        title: 'Programs',
        icon: <Circle size={12} />,
        navLink: '/programs'
      },
      {
        id: 'Courses',
        title: 'Courses',
        icon: <Circle size={12} />,
        navLink: '/courses'
      },
      {
        id: 'Instructor',
        title: 'Instructors',
        icon: <Circle size={12} />,
        navLink: '/instructor'
      },
      {
        id: 'Sessions',
        title: 'Sessions',
        icon: <Circle size={12} />,
        navLink: '/course-sessions'
      },
      {
        id: 'applicants_trainees',
        title: 'Applicants/Trainees',
        icon: <Circle size={12} />,
        navLink: '/applicants/trainees'
      }
    ] 
    
  },

  {
    id: 'nav-projects',
    title: 'Projects',
    icon: <CheckSquare size={30} />,
    navLink: '/projects'
  },
  
  {
    id: 'nav-kind_notes',
    title: 'Kind Notes',
    icon: <Bookmark size={30} />,
    navLink: '/kind_notes'
  },

  {
    id: 'nav-settings',
    title: 'Settings',
    icon: <Settings size={30} />,
    children: [     
      {
        id: 'nav-configurations',
        title: 'Configurations',
        icon: <Settings size={12} />,
        navLink: '/configurations'
      }
    ] 
    
  }
  
  
]
