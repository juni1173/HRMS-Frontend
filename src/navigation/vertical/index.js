import { Circle, Home, Briefcase, User } from 'react-feather'

export default [
  {
    id: 'nsv-Organization',
    title: 'Organization',
    icon: <Home size={20} />,
    navLink: '/organizationHome'
  },
  // {
  //   header: 'Jobs'
  // },
  {
    id: 'nav-job-setting',
    title: 'Jobs Setup',
    icon: <Briefcase size={20} />,
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
  // {
  //   id: 'home',
  //   title: 'Home',
  //   icon: <Home size={20} />,
  //   navLink: '/home'
  // }
  // {
  //   id: 'secondPage',
  //   title: 'Second Page',
  //   icon: <Mail size={20} />,
  //   navLink: '/second-page'
  // }
]
