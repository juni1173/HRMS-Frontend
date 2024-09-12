import { Home, CheckSquare, PieChart, Bookmark, HelpCircle, Book, Clock, Trello, Paperclip, Video } from 'react-feather'
let nav = []
 nav =  [
  ...nav,
    {
      id: 'nsv-Dashboard',
      title: 'Dashboard',
      icon: <Home size="20" />,
      navLink: '/employee/dashboard',
      isAccess: 'Admin'
    },

    {
        id: 'nav-requests',
        title: 'ESS Requests',
        icon: <HelpCircle size={30} />,
        navLink: '/requests'
    },
    {
        id: 'nav-attendance',
        title: 'Time',
        icon: <Clock size={30} />,
        navLink: '/attendancelist'
      },
  {
    id: 'nav-kpi',
    title: 'KPI',
    icon: <PieChart size={30} />,
    navLink: '/employee/kpi'
  },
  {
    id: 'nav-payroll',
    title: 'Payroll',
    icon: <Book size={30} />,
    navLink: '/employee/payroll'
  },
  {
    id: 'nav-ticket',
    title: 'Help Desk',
    icon: <Paperclip size={30} />,
    navLink: '/employee/tickets'
  },
  {
    id: 'nav-interview',
    title: 'Interviews',
    icon: <Trello size={12} />,
    navLink: '/employee/interviews'
  }
]

export default nav
