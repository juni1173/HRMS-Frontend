import React, {Children, useState} from 'react'
import { Card, CardBody, CardTitle, Row, Col } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { Home, User, Book, Layers, Coffee, Users, Calendar, Clipboard, BookOpen, ArrowRight, Circle, Bookmark, Aperture, Award, Globe, Smile } from 'react-feather'
const menuItems = [    
      {
        id: 'L&D_Dashboard',
        title: 'Dashboard',
        icon: <Globe size={20} />,
        navLink: '/learning_development/dashboard'
      },
      {
        id: 'Employee Sheet',
        title: 'Employee Sheet',
        icon: <Clipboard size={20} />,
        navLink: '/learning_development/employee/sheet'
      },
      {
        id: 'Subjects',
        title: 'Subjects',
        icon: <Book size={20} />,
        navLink: '/subjects'
      },
      {
        id: 'Programs',
        title: 'Programs',
        icon: <BookOpen size={20} />,
        navLink: '/programs'
      },
      {
        id: 'Courses',
        title: 'Courses',
        icon: <Award size={20} />,
        navLink: '/courses'
      },
      {
        id: 'Instructor',
        title: 'Instructors',
        icon: <Users size={20} />,
        navLink: '/instructor'
      },
      {
        id: 'Sessions',
        title: 'Sessions',
        icon: <Coffee size={20} />,
        navLink: '/course-sessions'
      },
      {
        id: 'applicants_trainees',
        title: 'Applicants/Trainees',
        icon: <Smile size={20} />,
        navLink: '/applicants/trainees'
      }
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