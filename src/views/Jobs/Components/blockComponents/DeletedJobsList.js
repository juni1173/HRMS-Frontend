// import { useState } from "react"
import { useState, useEffect } from "react"
import { Check, Search } from "react-feather"
import { Spinner, Table, Input, InputGroup, InputGroupText, Modal, ModalBody, ModalHeader } from "reactstrap"
import apiHelper from "../../../Helpers/ApiHelper"
import CreateReopenedJob from "./CreateReopenedJob"
import SearchHelper from "../../../Helpers/SearchHelper/SearchByObject"
// import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
const DeletedJobsList = ({data, count, CallBack}) => {
    const Api = apiHelper()
    const searchHelper = SearchHelper()
    const [Loading, setLoading] = useState(true)
    const [notActiveJobsList, setNotActiveJobList] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [searchQuery] = useState([])
    const [ReopenModal, setReopenModal] = useState(false)
    const [ReopenData, setReopenData] = useState([])
    // const MySwal = withReactContent(Swal)

    const getNotActiveJobs = async () => {
        const notActiveListArray = []
        setLoading(true)
        await Api.get(`/jobs/`)
            .then((result) => {
              if (result) {
                if (result.status === 200) {
                  if (result.data.length > 0) {
                      
                      for (let i = 0; i < result.data.length; i++) {
                          if (result.data[i].is_active === false) {
                              notActiveListArray.push(result.data[i]) 
                          }
                      }
                      searchResults.splice(0, searchResults.length)
                      notActiveJobsList.splice(0, notActiveJobsList.length)
                      setNotActiveJobList(notActiveListArray)
                      setSearchResults(notActiveListArray)
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
     
    // const ActivateJob = async (item) => {
    //   MySwal.fire({
    //     title: 'Are you sure?',
    //     text: "Do you want to ReActivate the Job!",
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonText: 'Yes, Activate it!',
    //     customClass: {
    //     confirmButton: 'btn btn-primary',
    //     cancelButton: 'btn btn-danger ms-1'
    //     },
    //     buttonsStyling: false
    // }).then(function (result) {
    //     if (result.value) {
    //        Api.jsonPatch(`/jobs/${item.uuid}/activate/`, item)
    //         .then((deleteResult) => {
    //             if (deleteResult.status === 200) {
    //                 MySwal.fire({
    //                     icon: 'success',
    //                     title: 'Job Activated!',
    //                     text: 'Acvtivation Successfull',
    //                     customClass: {
    //                     confirmButton: 'btn btn-success'
    //                     }
    //                 }).then(function (result) {
    //                     if (result.isConfirmed) {
    //                       Api.Toast('success', deleteResult.message)
    //                       getNotActiveJobs()
    //                       CallBack()
    //                     }
    //                 }) 
    //             } else {
    //                 MySwal.fire({
    //                     icon: 'error',
    //                     title: deleteResult.message ? deleteResult.message : 'Job can not be activated!',
    //                     text: 'Job activation unsuccessfull.',
    //                     customClass: {
    //                     confirmButton: 'btn btn-danger'
    //                     }
    //                 })
    //             }
                        
    //             })
    //     } 
    // })
    // // await Api.jsonPatch(`/jobs/${item.uuid}/activate/`, item)
    // // .then((result) => {
    // //     if (result.status === 200) {
    // //         Api.Toast('success', result.message)
    // //         getNotActiveJobs()
    // //         CallBack()
    // //         } else {
    // //             Api.Toast('error', result.message)
    // //         }
    // // })
          
    // }
      
    const getSearch = options => {
      setLoading(true)
      
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
      setTimeout(() => {
          setLoading(false)
      }, 1000)
    }

    const ReopenJob = item => {
      setReopenData(item)
      setReopenModal(true)
    }
    const ReopenCallBack = () => {
      setReopenModal(false)
      getNotActiveJobs()
      CallBack()
    }

    useEffect(() => {
        if (count !== 0) {
            getNotActiveJobs()
        } else {
            getNotActiveJobs()
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
                    <Input placeholder='search title...' onChange={e => { getSearch({list: notActiveJobsList, key: 'title', value: e.target.value }) } }/>
                </InputGroup>
               
            </div>
          </div>

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

        { !Loading ? (
             Object.values(searchResults).length > 0 ? (
              Object.values(searchResults).map((item, key) => ( 
                <tr key={key}>
                  <td>{item.title ? item.title : 'N/A'}</td>      
                  <td>{data.Department.find(pre => pre.value === item.department) ? data.Department.find(pre => pre.value === item.department).label : 'N/A'}</td>  
                  <td>{data.Staff_Classification.find(pre => pre.value === item.staff_classification) ? data.Staff_Classification.find(pre => pre.value === item.staff_classification).label : 'N/A'}</td>
                  <td>{data.Position.find(pre => pre.value === item.position) ? data.Position.find(pre => pre.value === item.position).label : 'N/A'}</td>
                  <td>{data.Job_Types.find(pre => pre.value === item.job_type) ? data.Job_Types.find(pre => pre.value === item.job_type).label : 'N/A'}</td>
                  <td>{item.no_of_individuals}</td>
                  <td>{item.job_post_code}</td>
                  <td>{data.JD_Selection.find(pre => pre.value === item.jd_selection) ? data.JD_Selection.find(pre => pre.value === item.jd_selection).label : 'N/A'}</td>
                  <td>
                    <div className="d-flex row">
                       
                      {/* <div className="col">
                        <button
                          className="border-0"
                          onClick={() => ActivateJob(item)}
                        >
                          <Check color="green"/>
                          
                        </button>
                      </div> */}
                      <div className="col">
                        <button
                          className="btn btn-primary border-0"
                          onClick={() => ReopenJob(item)}
                        >
                          Reopen
                        </button>
                      </div>
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
      <Modal isOpen={ReopenModal} toggle={() => setReopenModal(!ReopenModal)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setReopenModal(!ReopenModal)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
          {ReopenData ? <CreateReopenedJob CallBack={ReopenCallBack} data={ReopenData}/> : "No Data"}
        </ModalBody>
      </Modal>
        </>
    )
}
export default DeletedJobsList