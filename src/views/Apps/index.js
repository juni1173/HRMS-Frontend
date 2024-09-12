import React, { useEffect, useState} from 'react'
import { Card, CardBody, CardTitle, Row, Col } from 'reactstrap'
import { Home, User, Book, Layers, Coffee, Users, Clock, Briefcase, Circle, BookOpen, CheckSquare, Bookmark, Settings, Trello, ArrowRight, FilePlus, Link } from 'react-feather'
import { useHistory } from 'react-router-dom'

const menuItems = [
        {
          id: 'nsv-Organization',
          title: 'Organization',
          icon: <Home size={20} />,
          navLink: '/organizationHome',
          isAccess: 'Admin'
        },  
        {
          id: 'nav-Learning-Development',
          title: 'Learning & Development',
          icon: <BookOpen size={20}/>,
          navLink: '/admin/learning&development',
          isAccess: 'Admin',
          children: [     
            {
              id: 'nav-certifications',
              title: 'Certifications',
              icon: <Book size={20} />,
              navLink: '/hr/certifications' 
            },
            {
              id: 'nav-trainings',
              title: 'Trainings',
              icon: <Book size={20} />,
              navLink: '/hr/trainings'
            }
        ]
        },     
        {
          id: 'nav-projects',
          title: 'Projects',
          icon: <CheckSquare size={20} />,
          navLink: '/projects',
          isAccess: 'Admin'
        },
        // {
        //   id: 'nav-jira-projects',
        //   title: 'Jira',
        //   icon: <CheckSquare size={20} />,
        //   navLink: '/jira'
        // },
        {
          id: 'nav-kind_notes',
          title: 'Kind Notes',
          icon: <Bookmark size={20} />,
          navLink: '/kind_notes',
          isAccess: 'Admin'
        },
        // {
        //   id: 'nav-payroll',
        //   title: 'Payroll',
        //   icon: <BookOpen size={20}/>,
        //   children: [  
        //     {
        //       id: 'Payroll-Configuration',
        //       title: 'Payroll Configuration',
        //       icon: <Circle size={20} />,
        //       navLink: '/payroll-configuration'
        //     },   
        //     {
        //       id: 'Salary-permissions',
        //       title: 'Salary Permissions',
        //       icon: <Circle size={20} />,
        //       navLink: '/salary-permissions'
        //     },
        //     {
        //       id: 'Salary-Batch',
        //       title: 'Salary Batch',
        //       icon: <Circle size={20} />,
        //       navLink: '/payroll/salarybatch'
        //     },
        //     {
        //       id: 'Emp-Salary',
        //       title: 'Emp Slary',
        //       icon: <Circle size={20} />,
        //       navLink: '/payroll/selectbatch'
        //     }, 
        //      {
        //       id: 'Salary-Record',
        //       title: 'Salary Record',
        //       icon: <Circle size={20} />,
        //       navLink: '/payroll/salary/batches'
        //     }
        //   ] 
        // },
        // {
        //       id: 'nav-configurations',
        //       title: 'Configurations',
        //       icon: <Settings size={20} />,
        //       navLink: '/configurations'
        // },
        {
          id: 'nav-manuals',
          title: 'SOP / EPM',
          icon: <Bookmark size={20} />,
          navLink: '/employee/manuals',
          isAccess: 'Admin'
        },
        {
            id: 'nav-kavskills',
            title: 'KavSkills',
            icon: <Settings size={20} />,
            navLink: '/hr/kavskills',
          isAccess: 'Admin'
        },
        {
          id: 'nav-requisition',
          title: 'Requisition',
          icon: <FilePlus size={20} />,
          navLink: '/hr/requisition',
          isAccess: 'Admin'
        }
        // {
        //   id: 'nav-integerations',
        //   title: 'Integerations',
        //   icon: <Link size={20} />,
        //   navLink: '/integerations'
        // }
        // {
        //   id: 'nav-approvals',
        //   title: 'Approval Flow',
        //   icon: <Link size={20} />,
        //   navLink: '/approvalflow'
        // }
      //   {
      //     id: 'nav-tickets',
      //     title: 'Tickets',
      //     icon: <CheckSquare size={20} />,
      //     navLink: '/hr/tickets'
      // },
    //     {
    //       id: 'nav-reports',
    //       title: 'Reports',
    //       icon: <Trello size={20} />,
    //       navLink: '/reports'
    //   }
]
const employeeMenuItems = [
  {
    id: 'nav-tasks',
    title: 'Tasks',
    icon: <Link size={20} />,
    navLink: '/tasks',
    isAccess: 'Employee'
  },
  {
    id: 'nav-kind_notes',
    title: 'Kind Notes',
    icon: <Bookmark size={20} />,
    navLink: '/kind_notes',
    isAccess: 'Employee'
  },
  {
    id: 'nav-manuals',
    title: 'SOP / EPM',
    icon: <Bookmark size={20} />,
    navLink: '/employee/manuals',
    isAccess: 'Employee'
  },
  {
    id: 'nav-l&d',
    title: 'Learning & Development',
    icon: <Book size={20} />,
    navLink: '/employeelearninganddevelopment',
    isAccess: 'Employee'
  },
  {
    id: 'nav-certifications',
    title: 'Certifications',
    icon: <Book size={20} />,
    navLink: '/employee/certifications',
    isAccess: 'Employee'
  },
  {
    id: 'nav-resume',
    title: 'Resume',
    icon: <Trello size={20} />,
    navLink: '/Resume',
    isAccess: 'Employee'
  },
  {
    id: 'nav-requisition',
    title: 'Requisition',
    icon: <FilePlus size={20} />,
    navLink: '/requisition',
    isAccess: 'Employee'
  }
  // {
  //   id: 'nav-integerations',
  //   title: 'Integerations',
  //   icon: <Link size={20} />,
  //   navLink: '/integerations'
  // }

]
const Menu = () => {
  const [items, setItems] = useState()
    const history = useHistory()
    const [hoveredItem, setHoveredItem] = useState(null)
    useEffect(() => {

      if (JSON.parse(localStorage.getItem('userData')).user_role === 'employee') {
        setItems(employeeMenuItems)
      } else {
        setItems(menuItems)
      }
      console.log(items)
    }, [setItems])
  return (

      <div>
      <Row>
      {items && items.map((item) => (
                    <Col key={item.id} md={4}>
                        <div
                            className={`card-wrapper`}
                            onMouseEnter={() => setHoveredItem(item.id)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onClick={() => history.push(item.navLink)}
                        >
                                                       <Card className='cursor-pointer'>
                                <CardBody className='d-flex justify-content-between align-items-center'>
                                    <div>
                                        <span className='mr-2'>
                                           
                                            {item.icon}
                                        </span>
                                        <strong className='ps-1'>{item.title}</strong>
                                    </div>
                                    {item.id === hoveredItem ? <ArrowRight/>   : <ArrowRight color='#AAAFB4'/>}
                                </CardBody>
                            </Card>

                        </div>
                    </Col>
                ))}
      </Row>
    </div> 
  )
}

export default Menu