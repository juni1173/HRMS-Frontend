import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "./ApiHelper"
import Swal from "sweetalert2"
import withReactContent from 'sweetalert2-react-content'
const JobHelper = () => {
    const Api = apiHelper()
    const MySwal = withReactContent(Swal)
    const [result] = useState({
        Staff_Classification:[],
        Department:[],
        Position:[],
        Job_Types:[],
        JD:[]
    })
    const fetchFormPreData = async () => {
        const response = await Api.get(`/jobs/pre/data/${Api.org.id}/`, { headers: {Authorization: Api.token} })
        // console.warn(response)
        if (response.status === 200) {
            const data = response.data 
            if (Object.values(data).length > 0) {
                const SC = data.staff_classification
                const Dep = data.department
                const Pos = data.position
                const JT = data.job_types
                const JD = data.jd
                for (let i = 0; i < SC.length; i++) {
                    result.Staff_Classification.push({value: SC[i].id, label: SC[i].title})
                }
                for (let i = 0; i < Dep.length; i++) {
                    result.Department.push({value: Dep[i].id, label: Dep[i].title})
                }
                for (let i = 0; i < Pos.length; i++) {
                    result.Position.push({value: Pos[i].id, label: Pos[i].title})
                }
                for (let i = 0; i < JT.length; i++) {
                    result.Job_Types.push({value: JT[i].id, label: JT[i].title})
                }
                for (let i = 0; i < JD.length; i++) {
                    result.JD.push({value: JD[i].id, label: JD[i].title})
                }
                return result
            } else {
                Api.Toast('error', response.message)
            }
        } else {
            Api.Toast('error', response.message)
        }
    }    
    const deleteJob = async uuid => {
        if (uuid) {
            await  Api.deleteData(`/jobs/${uuid}/`, {method: 'Delete', headers: {Authorization: Api.token}})
            .then((result) => {
              const data = {status:result.status, result_data:result.data, message: result.message }
              if (data.status === 200) {
             
                Api.Toast('success', result.message)
                
              } else {
                Api.Toast('error', result.message)
              }
            })
            .catch((error) => {
              console.error(error)
              Api.Toast('error', "Invalid Request")
            }) 
            
          } else {
            Api.Toast('error', "Position Not Found!")
          }
          
           return false
         
      }  
      const sweetAlert = async (id) => {
        return  MySwal.fire({  
            title: 'Are you sure?',  
            text: 'This entry will be deleted!',  
            icon: 'warning',  
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ms-1'
            },
            buttonsStyling: false
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              deleteJob(id).then((result) => { 
                MySwal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: result.message,
                    customClass: {
                      confirmButton: 'btn btn-success'
                    }
                  })
              })
            } else {
                MySwal.fire({
                    title: 'Cancelled',
                    icon: 'error',
                    customClass: {
                      confirmButton: 'btn btn-success'
                    }
                  })
            }
        })
          
        
    }
    return {
        fetchFormPreData,
        deleteJob,
        sweetAlert
    }
}
export default JobHelper