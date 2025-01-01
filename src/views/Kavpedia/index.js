import React, {Fragment, useState, useCallback, useEffect} from 'react'
// import { useDispatch } from 'react-redux'
// import { handleLogout } from '@store/authentication'
import apiHelper from '../Helpers/ApiHelper'
import SearchComponent from './Components/searchComponent'
import DocumentsList from './Components/list'
import AddDocument from './Components/Add'
import { Row, Col, Spinner, Card, CardBody, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { Folder } from 'react-feather'
const index = () => {
    // const dispatch = useDispatch()
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [basicModal, setBasicModal] = useState(false)
    const [projectsDropdown, setProjectsDropdown] = useState([])
    const [selectedProject, setSelectedProject] = useState('')
    const getData = async (filters = null) => {
        if (filters) {
            setLoading(true)
            const formData = new FormData()
            if (filters.searchQuery && filters.searchQuery !== '') formData['title'] = filters.searchQuery 
            if (filters.tags && filters.tags !== '') formData['tags'] = filters.tags.join(', ')
            if (filters.projects && filters.projects !== '') formData['project'] = filters.projects 
        await Api.jsonPost(`/datahive/list/data/`, formData).then(result => {
            if (result) {
                if (result.status === 200) {
                    const resultData = result.data
                    setData(resultData)
                } else {
                    setData([])
                    // Api.Toast('error', result.message)
                }
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 500)
        }
        
    }
    const getProjects = async () => {
        await Api.get(`/taskify/get/project/`).then(result => {
            if (result) {
                if (result.status === 200) {
                    const projectsData = result.data
                    const projectArr = []
                    if (Object.values(projectsData).length > 0) {
                        for (const proj of projectsData) {
                            projectArr.push({value: proj.id, label: proj.name})
                        }
                    }
                    setProjectsDropdown(projectArr)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server error!')
            }
        })
      }
    const CallBack = useCallback((filterState) => {
        if (filterState) {
            // const TagsString = filterState.tags.join(', ')
            console.warn(filterState.tags)
        }
        getData(filterState)
    }, [])
    useEffect(() => {
        getProjects()
    }, [setProjectsDropdown])
   const projectClick = project => {
    if (project) {
        const filter = {}
        filter.projects = project
        setSelectedProject(project)
        return getData(filter)
    }

   }
  return (
    <Fragment>
        <div className='container kavpedia-container'>
            <nav className="navbar navbar-light bg-light p-2">
                <a className="navbar-brand" href="#"><h3>Kavpedia</h3></a>
                <div className="ml-auto">
                    <button style={{backgroundColor: '#EB7623FF', color:'#fff'}} className="btn btn-md mr-1 cursor-pointer" onClick={() => setBasicModal(!basicModal)}>
                        Add or Create
                    </button>
                    {/* <button className="btn btn-outline-danger cursor-pointer" onClick={() => dispatch(handleLogout())}>
                    Logout
                    </button> */}
                </div>
            </nav>
            <Row className='mt-1'>
            {(projectsDropdown && projectsDropdown.length > 0) && projectsDropdown.map((item, index) => (
                <Col md='3' key={index}>
                <Card onClick={() => projectClick(item.value)} className={selectedProject === item.value ? 'cursor-pointer active' : 'cursor-pointer'} >
                    <CardBody>
                            <div className='d-flex justify-content-start'>
                                <div className='content-center' style={{marginRight: '5px'}}>
                                    <Folder color={selectedProject === item.value ? '#fff' : '#EB7623FF'} size={'18'}/>
                                </div>
                                <div className='content-center'>
                                    <b className='m-0'>{item.label}</b>
                                </div>
                            </div>
                    </CardBody>
                </Card>
                </Col>
            )) }
        </Row>
        <Card className='mt-1'>
            <CardBody>
                <SearchComponent Callback={CallBack} projects={selectedProject} projectsDropdown={projectsDropdown}/>
            </CardBody>
        </Card> 
        {Object.values(data).length > 0 ? (
            <Row>
                <Col md='12'>
                        {!loading ? (
                            <>
                            <DocumentsList data={data} projects={projectsDropdown}/>
                            </>
                        ) : (
                            <div className="text-center"><Spinner /></div>
                        )}
                </Col>
            </Row>
            
           
        ) : (
            <Card>
            <CardBody className='mx-3'>
                No any document found...
            </CardBody>
            </Card> 
        )}
        </div>
        <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-lg'>
          <ModalHeader toggle={() => setBasicModal(!basicModal)}>Upload Document</ModalHeader>
          <ModalBody>
            <AddDocument projectsDropdown={projectsDropdown}
             modalCancel={() => setBasicModal(false)}
             Api={Api}
             CallBack={CallBack}
             />
          </ModalBody>
        </Modal>
    </Fragment>
    
  )
}

export default index