import { useState, useEffect } from "react"
import { Edit, XCircle, Search, PlusCircle} from "react-feather"
import { Card, CardBody, Table, Modal, ModalBody, ModalHeader, Input, InputGroup, InputGroupText, Button, Spinner, Badge} from "reactstrap"
import apiHelper from "../../Helpers/ApiHelper"
import CandidatePool from "../../Jobs/Components/blockComponents/CandidatePool"
import SearchHelper from "../../Helpers/SearchHelper/SearchByObject"
import JobHelper from "../../Helpers/JobHelper"
const ActiveJobsList = ({selectedData, assignCallBack}) => {
    const Api = apiHelper()
    const Job_Helper = JobHelper()
    const searchHelper = SearchHelper()
    const [Loading, setLoading] = useState(true)
    const [activeJobsList, setActiveJobList] = useState([])
    const [selectedItem, setSelectedItem] = useState()
    const [candidatePoolModal, setCandidatePoolModal] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    // const [deleteModal, setDeleteModal] = useState(false)  
    const [searchQuery] = useState([])
    const [candidatePoolModalData, setCandidatePoolModalData] = useState(null)
    const [data] = useState([])
    const handleCardClick = item => {
        if (selectedItem === item) {
            setSelectedItem(null)
        } else {
            setSelectedItem(item)
            console.log(selectedData)
            if (item.jd_selection !== selectedData.jd_selection) {
                Api.Toast('info', 'Selected Job Description does not match with the employee requested JD!')
            }
        }
    }
    const fetchPreData = async () => {
        setLoading(true)
        await Job_Helper.fetchFormPreData().then(dataResult => {
          if (dataResult) {
                data['Staff_Classification'] = dataResult.Staff_Classification
                data['Department'] = dataResult.Department
                data['Position'] = dataResult.Position
                data['Job_Types'] = dataResult.Job_Types
                data['JD_Selection'] = dataResult.JD
                setLoading(false)
          } else {
            setLoading(false)
          }
        //   console.log(data)
          return data
        })
        // setTimeout(() => {
            setLoading(false)
        // }, 1000)
      }
     
    const candidatePoolFunc = (data) => {
        // setUpdateId(data.id)
        setCandidatePoolModalData(data)
        setCandidatePoolModal(true)
      }
    const getActiveJobs = async () => {
        const activeListArray = []
        setLoading(true)
            await Api.get(`/jobs/`)
            .then((result) => {
                if (result) {
                    if (result.status === 200) {
                        if (result.data.length > 0) {
                          for (let i = 0; i < result.data.length; i++) {
                            if (result.data[i].is_active === true) {
                              activeListArray.push(result.data[i]) 
                            }
                            
                          }
                          setLoading(false)
                          searchResults.splice(0, searchResults.length)
                          activeJobsList.splice(0, activeJobsList.length)
                          setActiveJobList(activeListArray)
                          setSearchResults(activeListArray)
                        }
                    } else {
                            Api.Toast('error', result.message)
                        
                    }
                } else {
                    Api.Toast('error', 'Server not responding')
                }
            })
            setTimeout(() => {
                setLoading(false)
              }, 1000)
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
const updateIndividual = async (jobUuid, newCount, postID, job_active, jd, job_type) => {
    const formInput = new FormData()
    formInput['no_of_individuals'] = parseInt(newCount)
    formInput['job_post_id'] = postID
    formInput['job_is_active'] = job_active
    formInput['jd_selection'] = jd
    formInput['job_type'] = job_type
    // formInput.append('no_of_individuals', newCount)
    const result = await Api.jsonPatch(`/jobs/${jobUuid}/`, formInput)
    if (result.status === 200) {
      Api.Toast('success', result.message)
    } else {
      Api.Toast('error', result.message)
    }
  }
const incrementIndividuals = (index) => {
    const updatedList = [...activeJobsList]
    const selectedJob = updatedList[index]
    selectedJob.no_of_individuals += 1

    setActiveJobList(updatedList)
    setSearchResults(updatedList)
    
    if (selectedJob.job_id === selectedData.job_id) {
      Api.Toast("info", "The number of individuals for the selected job has increased.")
    }

    updateIndividual(selectedJob.job_uuid, selectedJob.no_of_individuals, selectedJob.job_post_id, selectedJob.job_is_active, selectedJob.jd_selection, selectedJob.job_type)
}
const assign = async () => {
    setLoading(true) 
    if (selectedItem !== null && selectedItem !== undefined) {
    const formData = new FormData()
    formData['job'] = selectedItem.job_id
   const response =  await Api.jsonPatch(`/requisition/hr/update/${selectedData.id}/`, formData)
   if (response) {
     if (response.status === 200) {
        assignCallBack()
        Api.Toast('success', response.message)
        setLoading(false)    
     } else {
       Api.Toast('error', response.message)
       setLoading(false)
     }
   } else {
    Api.Toast('error', "Unable to connect to server")
   }
} else {  
    Api.Toast('error', 'Something went wrong please try again')
}
}

useEffect(async() => {
   await fetchPreData()
   await getActiveJobs()
}, [])
    return (
        
        <>
        <div className="row">
            <div className="col-lg-6">{selectedItem !== null && selectedItem !== undefined ? <Button className='btn btn-primary' onClick={() => assign()}>Assign Job</Button> : null}</div>
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
                <p>Titles with asterisks (*) match with the job description the employee provided.</p>
                <Table bordered responsive>
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
                    <th>
                    Applicants
                    </th>
                    <th scope="col" className="text-nowrap">
                    Candidate Pool
                    </th>
                </tr>
                </thead>
                <tbody className='text-center'>

                { !Loading ? (
                    Object.values(searchResults).length > 0 ? (
                         Object.values(searchResults).map((item, key) => (
                        
                            <tr key={key} onClick={() => handleCardClick(item)} style={{ cursor: 'pointer', backgroundColor: selectedItem === item  ? 'lightgray' : 'white' }}>
                            <td>{item.title ? item.title : 'N/A'} {selectedData.jd_selection === item.jd_selection ? <Badge color='light-danger'>*</Badge> : null}</td>      
                            <td>{data.Department.find(pre => pre.value === item.department) ? data.Department.find(pre => pre.value === item.department).label : 'N/A'}</td>  
                            <td>{data.Staff_Classification.find(pre => pre.value === item.staff_classification) ? data.Staff_Classification.find(pre => pre.value === item.staff_classification).label : 'N/A'}</td>
                            <td>{item.position_title ? item.position_title : 'N/A'}</td>
                            <td>{data.Job_Types.find(pre => pre.value === item.job_type) ? data.Job_Types.find(pre => pre.value === item.job_type).label : 'N/A'}</td>
                            <td>{item.no_of_individuals}
                            {selectedItem === item ? <PlusCircle color="red" size={15} className="ms-1"  
                            onClick={(e) => {
                            e.stopPropagation()
                            incrementIndividuals(key)
                          }}/> : null}
                           </td>
                            <td>{item.job_post_code}</td>
                            <td>{data.JD_Selection.find(pre => pre.value === item.jd_selection) ? data.JD_Selection.find(pre => pre.value === item.jd_selection).label : 'N/A'}</td>
                            <td>{item.total_applicants ? item.total_applicants : 0}</td>
                            <td>
                                <div className="text-center">
                                    <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        candidatePoolFunc(item) 
                                    }}
                                    >
                                    Candidate Pool
                                    </button>
                                </div>
                                
                            </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9}>No Jobs Found...</td>
                        </tr>
                    )
                    ) : (
                        <tr>
                          <td colSpan={9}><Spinner /></td>
                        </tr>
                    )
                  }
                </tbody>
                </Table>
            </CardBody>
        </Card>
      <Modal isOpen={candidatePoolModal} toggle={() => setCandidatePoolModal(!candidatePoolModal)} className='modal-dialog-centered modal-xl'>
        <ModalHeader className='bg-transparent' toggle={() => setCandidatePoolModal(!candidatePoolModal)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
              {candidatePoolModalData ? <CandidatePool CallBack={updateCallBack} data={candidatePoolModalData}/> : "No Data"}
        </ModalBody>
      </Modal>
        </>
    )
}
ActiveJobsList.defaultProps = {
    count: 1
}
export default ActiveJobsList