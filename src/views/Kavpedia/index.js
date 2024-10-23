import React, {Fragment, useState, useCallback, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/authentication'
import apiHelper from '../Helpers/ApiHelper'
import SearchComponent from './Components/searchComponent'
import DocumentsList from './Components/list'
import AddDocument from './Components/Add'
import { Spinner, Card, CardBody, Modal, ModalHeader, ModalBody } from 'reactstrap'
const index = () => {
    const dispatch = useDispatch()
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [basicModal, setBasicModal] = useState(false)
    const [projectsDropdown, setProjectsDropdown] = useState([])
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
                    Api.Toast('error', result.message)
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
   
  return (
    <Fragment>
        <div className='container'>
            <nav className="navbar navbar-light bg-light p-2">
                <a className="navbar-brand" href="#">Kavpedia</a>
                <div className="ml-auto">
                    <button className="btn btn-outline-primary mr-1 cursor-pointer" onClick={() => setBasicModal(!basicModal)}>
                        Add Document
                    </button>
                    <button className="btn btn-outline-danger cursor-pointer" onClick={() => dispatch(handleLogout())}>
                    Logout
                    </button>
                </div>
            </nav>
        
        <Card className='mt-1'>
            <CardBody>
                <SearchComponent Callback={CallBack} projectsDropdown={projectsDropdown}/>
            </CardBody>
        </Card> 
        {Object.values(data).length > 0 ? (
            <Card>
                <CardBody className='mx-3'>
                {!loading ? (
                        <DocumentsList data={data} />
                ) : (
                    <div className="text-center"><Spinner /></div>
                )}
                </CardBody>
            </Card>
           
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