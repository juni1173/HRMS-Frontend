import { useState, useEffect } from "react"
import { Item } from "react-contexify"
import { Edit, User, XCircle, Search} from "react-feather"
import { Card, CardBody, CardTitle, CardText, Spinne, Table, Modal, ModalBody, ModalHeader, Input, InputGroup, InputGroupText} from "reactstrap"
import apiHelper from "../../../Helpers/ApiHelper"
import JobHelper from "../../../Helpers/JobHelper"
import UpdateJobList from "./UpdateJobList"
import SearchHelper from "../../../Helpers/SearchHelper/SearchByObject"
import Swal from "sweetalert2"
const ActiveJobsList = ({count, data, CallBack}) => {
    const Api = apiHelper()
    const Helper = JobHelper()
    const searchHelper = SearchHelper()
    const [Loading, setLoading] = useState(true)
    const [activeJobsList, setActiveJobList] = useState([])
    const [editModal, setEditModal] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    // const [deleteModal, setDeleteModal] = useState(false)  
    const [searchQuery] = useState([])
    const [updatedModalData, setUpdateModalData] = useState(null)

    // const [deleteId, setDeleteId] = useState('')
     
    const updateModal = (data) => {
        // setUpdateId(data.id)
        setUpdateModalData(data)
        setEditModal(true)
      }
    const getActiveJobs = () => {
        const activeListArray = []
        setLoading(true)
        const url = `${process.env.REACT_APP_API_URL}/jobs/`
        fetch(url, {
            method: "GET",
            headers: {Authorization: Api.token }
            })
            .then((response) => response.json())
            .then((result) => {
                if (result.status === 200) {
                    if (result.data.length > 0) {
                      for (let i = 0; i < result.data.length; i++) {
                        console.log(result.data[i].is_active)
                        if (result.data[i].is_active === true) {
                          activeListArray.push(result.data[i]) 
                        }
                        
                      }
                      setLoading(false)
                      setActiveJobList(activeListArray)
                      setSearchResults(activeListArray)
                    }
                } else {
                    Api.Toast('error', result.message)
                }
              
            })
            setTimeout(() => {
                setLoading(false)
              }, 1000)
    }

    
    const updateCallBack = () => {
        setEditModal(false)
        getActiveJobs()
    }
 
  const deleteModalOpen = (id) => {
    Helper.sweetAlert(id).then(() => {
            getActiveJobs()
            CallBack()
               
        })
  }

  const getSearch = options => {
    if (options.value === '' || options.value === null || options.value === undefined) {

        if (options.key in searchQuery) {
            delete searchQuery[options.key]
        } 
        if (Object.values(searchQuery).length > 0) {
            options.value = {query: searchQuery}
        } else {
            options.value = {}
        }
        setSearchResults(searchHelper.searchObj(options))
        
    } else {
        
        searchQuery[options.key] = options.value
        options.value = {query: searchQuery}
        setSearchResults(searchHelper.searchObj(options))
    }
}


    useEffect(() => {
        if (count !== 0) {
            getActiveJobs()
        } else {
            getActiveJobs()
        }
        
    }, [count])
    return (
        
        <>
        <div className="row">
            <div className="col-lg-6"></div>
            <div className="col-lg-6">
            
            <InputGroup className='input-group-merge mb-2'>
                <InputGroupText>
                <Search size={14} />
                </InputGroupText>
                <Input placeholder='search title...' onChange={e => { getSearch({list: activeJobsList, key: 'title', value: e.target.value }) } }/>
            </InputGroup>
               
        </div>
        </div>
        <Card>
            <CardBody>
                <Table bordered striped responsive>
                <thead className='table-dark text-center'>
                <tr>
                    <th scope="col" className="text-nowrap">
                        Title
                    </th>
                    <th scope="col" className="text-nowrap">
                    Department
                    </th>
                
                    <th scope="col" className="text-nowrap">
                    Staff Classifications
                    </th>
                    <th scope="col" className="text-nowrap">
                    Position
                    </th>
                    <th scope="col" className="text-nowrap">
                    Job Type
                    </th>
                    <th scope="col" className="text-nowrap">
                    No Of Individual
                    </th>
                    <th scope="col" className="text-nowrap">
                    Job Code
                    </th>
                    <th scope="col" className="text-nowrap">
                    Job Description
                    </th>
                    
                    <th scope="col" className="text-nowrap">
                    Actions
                    </th>
                </tr>
                </thead>
                <tbody className='text-center'>
                    {Object.values(searchResults).map((item, key) => (
                        
                        <tr key={key}>
                        <td>{item.title}</td>      
                        <td>{data.Department.find(pre => pre.value === item.department) ? data.Department.find(pre => pre.value === item.department).label : 'N/A'}</td>  
                        <td>{data.Staff_Classification.find(pre => pre.value === item.staff_classification) ? data.Staff_Classification.find(pre => pre.value === item.staff_classification).label : 'N/A'}</td>
                        <td>{data.Position.find(pre => pre.value === item.position) ? data.Position.find(pre => pre.value === item.position).label : 'N/A'}</td>
                        <td>{data.Job_Types.find(pre => pre.value === item['job_posts'][0].job_type) ? data.Job_Types.find(pre => pre.value === item['job_posts'][0].job_type).label : 'N/A'}</td>
                        <td>{item['job_posts'][0].no_of_individuals}</td>
                        <td>{item['job_posts'][0].job_post_code}</td>
                        <td>{data.JD_Selection.find(pre => pre.value === item['job_posts'][0].jd_selection) ? data.JD_Selection.find(pre => pre.value === item['job_posts'][0].jd_selection).label : 'N/A'}</td>
                        <td>
                            <div className="d-flex row">
                            <div className="col text-center">
                                <button
                                className="border-0"
                                onClick={() => {
                                    updateModal(item) 
                                }}
                                >
                                <Edit color="orange" />
                                </button>
                            </div>
                            <div className="col">
                                <button
                                className="border-0"
                                onClick={() => deleteModalOpen(item.uuid)}
                                >
                                <XCircle color="red" />
                                </button>
                            </div>
                            </div>
                        </td>
                        </tr>
                    ))}
                
                </tbody>
                </Table>
            </CardBody>
        </Card>
      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
              {updatedModalData ? <UpdateJobList CallBack={updateCallBack} data={updatedModalData}/> : "No Data"}
        </ModalBody>
      </Modal>
        </>
    )
}
export default ActiveJobsList