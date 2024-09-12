import React, {Children, useState} from 'react'
import { Card, CardBody, CardTitle, Row, Col } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { Home, User, Book, Layers, Coffee, Users, Calendar, Clipboard, BookOpen, ArrowRight } from 'react-feather'
const menuItems = [    
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
      },
      {
        id: 'nav-courses',
        title: 'Courses',
        icon: <Book size={30} />,
        navLink: '/hr/courses'
        // Children: []
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


const Menu = () => {
  const history = useHistory()
  const [hoveredItem, setHoveredItem] = useState(null)
return (

    <div>
    <Row>
    {menuItems.map((item) => (
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