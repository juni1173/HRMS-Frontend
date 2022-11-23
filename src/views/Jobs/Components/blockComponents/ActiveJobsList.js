import { useState, useEffect } from "react"
import { Edit, XCircle } from "react-feather"
import { Table, Modal, ModalBody, ModalHeader} from "reactstrap"
import apiHelper from "../../../Helpers/ApiHelper"
import JobHelper from "../../../Helpers/JobHelper"
import UpdateJobList from "./UpdateJobList"
const ActiveJobsList = ({count, data}) => {
    console.warn(data)
    const Api = apiHelper()
    const Helper = JobHelper()
    const [Loading, setLoading] = useState(true)
    const [activeJobsList, setActiveJobList] = useState([])
    const [editModal, setEditModal] = useState(false)
    const [updatedModalData, setUpdateModalData] = useState(null)
    const updateModal = (data) => {
        // setUpdateId(data.id)
        setUpdateModalData(data)
        setEditModal(true)
      }
    const getActiveJobs = () => {
        setLoading(true)
        Api.get(`/jobs`)
            .then((result) => {
                if (result.status === 200) {
                    if (result.data.length > 0) {
                        setLoading(false)
                        setActiveJobList(result.data)
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
    const deleteJob = (uuid) => {
        Helper.deleteJob(uuid).then(() => {
            getActiveJobs()
        })
       
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
        {Object.values(activeJobsList).map((item, key) => (
                    
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
                          onClick={() => deleteJob(item.uuid)}
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

      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>
              {updatedModalData ? <UpdateJobList CallBack={updateCallBack} data={updatedModalData}/> : "No Data"}
             {/* {updateId ? <UpdatePosition CallBack={updateCallBack} updateIdData={updateIdData} /> : "No Data"} */}
        </ModalBody>
      </Modal>
        
        </>
    )
}
export default ActiveJobsList