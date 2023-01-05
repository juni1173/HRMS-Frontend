import { Circle, Home, Briefcase, User, Settings, Mail, BookOpen } from 'react-feather'

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
      }
    ] 
    
  },
  
  {
    id: 'nav-settings',
    title: 'Settings',
    icon: <Settings size={30} />,
    children: [     
      {
        id: 'nav-email-templates',
        title: 'Email Templates',
        icon: <Mail size={12} />,
        navLink: '/email_templates'
      }
    ] 
    
  }
  
  
]
