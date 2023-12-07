import React, { Fragment, useState, useEffect, useCallback } from 'react'
import {TabContent, TabPane, Nav, NavItem, NavLink, Badge} from "reactstrap"
import apiHelper from '../../../Helpers/ApiHelper'
import TrainingList from './Components/TrainingList'
const index = () => {
  const Api = apiHelper()
  const [active, setActive] = useState('1')
    const [data, setData] = useState([
        {
                pending: '',
                inProgress: '',
                completed: ''
            }
        ])
    const toggle = tab => {
        setActive(tab)
        }        
    const preDataApi = async () => {
      const response = await Api.get('/training/employee/training/data/')
      if (response.status === 200) {
        console.warn(response.data)
        const responseData = response.data
        setData(prev => ({
            ...prev,
            pending: responseData.filter((element) => {
                return element.training_status === 1
            }),
            inProgress: responseData.filter((element) => {
                return element.training_status === 2
            }),
            completed: responseData.filter((element) => {
                return element.training_status === 3
            })
        }))
         
      } else {
          return Api.Toast('error', 'Data not found')
      }
  }
  useEffect(() => {
      preDataApi()
      }, [])
      const handleDataProcessing = useCallback(() => {
        preDataApi()
      }, [data])
  return (
    <Fragment>
        <h2>Trainings</h2>
        <div className='nav-vertical configuration_panel'>
            <Nav tabs className='nav-left'>
                                
                                    <NavItem >
                                    <NavLink
                                        active={active === '1'}
                                        onClick={() => {
                                        toggle('1')
                                        }}
                                    >
                                    Pending Trainings <Badge className="bg-danger ml-5"> {(data && data.pending && Object.keys(data.pending).length > 0) ? Object.keys(data.pending).length : 0}</Badge>
                                    </NavLink>
                                    </NavItem>
                                
                                    <NavItem >
                                    <NavLink
                                        active={active === '2'}
                                        onClick={() => {
                                        toggle('2')
                                        }}
                                    >
                                        In Progress Trainings <Badge className="bg-danger ml-5"> {(data && data.inProgress && Object.keys(data.inProgress).length > 0) ? Object.keys(data.inProgress).length : 0}</Badge>
                                    </NavLink>
                                    <NavLink
                                        active={active === '3'}
                                        onClick={() => {
                                        toggle('3')
                                        }}
                                    >
                                        Complete Trainings <Badge className="bg-danger ml-5"> {(data && data.completed && Object.keys(data.completed).length > 0) ? Object.keys(data.completed).length : 0}</Badge>
                                    </NavLink>
                                    </NavItem>
                                
                                {/* </div> */}
            </Nav>
            <TabContent className='py-50' activeTab={active}>
                        <TabPane tabId={'1'} className='tab-pane-blue'>
                            <TrainingList data={data.pending} CallBack={handleDataProcessing}/>
                        </TabPane>
                        <TabPane tabId={'2'} className='tab-pane-blue'>
                            <TrainingList data={data.inProgress} CallBack={handleDataProcessing}/>
                        </TabPane>
                        <TabPane tabId={'3'} className='tab-pane-blue'>
                            <TrainingList data={data.completed} CallBack={handleDataProcessing}/>
                        </TabPane>
            </TabContent>
        </div> 
    </Fragment>
  )
}

export default index