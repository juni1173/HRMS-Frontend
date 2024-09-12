import React, {Children, useState} from 'react'
import { Card, CardBody, CardTitle, Row, Col } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { Home, User, Book, Layers, Coffee, Users, Calendar, Clipboard, BookOpen, ArrowRight, Circle, Bookmark, Aperture, Award, Globe, Smile, Paperclip, Shield } from 'react-feather'
const menuItems = [    
    {
                id: 'nav-job',
                title: 'Jobs List',
                icon: <Clipboard size={20} />,
                navLink: '/jobs'
              }, 
              {
                id: 'nav-position',
                title: 'Positions',
                icon: <Shield size={20} />,
                navLink: '/positions'
              },
              {
                id: 'nav-job-description',
                title: 'Job Description',
                icon: <BookOpen size={20} />,
                navLink: '/job-description'
              },
              {
                id: 'nav-candidates',
                title: 'Candidates',
                icon: <Users size={20} />,
                navLink: '/candidates'
              },
              {
                id: 'nav-interview-questions',
                title: 'Interview Questions',
                icon: <Paperclip size={20} />,
                navLink: '/questions'
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