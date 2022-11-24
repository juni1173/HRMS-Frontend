import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "./ApiHelper"
 

const PositionHelper = () => {
  
    const Api = apiHelper()
    const [positionActive] = useState([])
    const [positionNotActive] = useState([])
    const [positionResult] = useState({
        position: {},
        positionActive: {},
        positionNotActive: {}
    } 
    )
    const [SCActive] = useState([])
    const [SCNotActive] = useState([])
    const [SCResult] = useState({
        SC: {},
        SCActive: {},
        SCNotActive: {}
    } 
    )
    const Status = [
        { value: 0, label: 'Inactive' },
        { value: 1, label: 'Active' }
      ]
    const experience = [
        {value: 1, label: '0-2 years'},
        {value: 2, label: '2-4 years'},
        {value: 3, label: '4-6 years'},
        {value: 4, label: '6-8 years'},
        {value: 5, label: '8-10 years'},
        {value: 6, label: '10+ years'}
    ]
    const Qualification = [
        {value: 1, label: 'Bachelors'},
        {value: 2, label: 'Masters'},
        {value: 3, label: 'MPhil'},
        {value: 4, label: 'Others'}
    ] 
  const fetchPositions = async () => {
    
    const response = await Api.get(`/organization/${Api.org.id}/positions/`)
    // console.warn(response)
    if (response.status === 200) {
    
        // emptying the array
    
    positionActive.splice(0, positionActive.length)
    positionNotActive.splice(0, positionNotActive.length)

        const position = response.data 
        
        // console.warn(result)
        if (Object.values(position).length > 0) {
            for (let i = 0; i < position.length; i++) {
                if (position[i].is_active) {
                    
                  positionActive.push(position[i])
                } else {
                  
                   positionNotActive.push(position[i])
                    
                }
              }  
        }
    positionResult.position = position
    positionResult.positionActive = positionActive
    positionResult.positionNotActive = positionNotActive
    return  positionResult
    } else {
        Api.Toast('error', response.message)
    }
    return positionResult
    // console.warn(positionResult)
   
    }
    const fetchStaffClassifications = async () => {
    
      const response = await Api.get(`/organization/staff_classification/`)
      // console.warn(response)
      if (response.status === 200) {
      
          // emptying the array
      
      SCActive.splice(0, SCActive.length)
      SCNotActive.splice(0, SCNotActive.length)
  
          const SC = response.data 
          
          // console.warn(result)
          if (Object.values(SC).length > 0) {
              for (let i = 0; i < SC.length; i++) {
                  if (SC[i].is_active) {
                      
                    SCActive.push(SC[i])
                  } else {
                    
                     SCNotActive.push(SC[i])
                      
                  }
                }  
          }
      SCResult.SC = SC
      SCResult.SCActive = SCActive
      SCResult.SCNotActive = SCNotActive
      return  SCResult
      } else {
          Api.Toast('error', response.message)
      }
      return SCResult
     
      }
  const deletePosition = async id => {
    if (id) {
        await  Api.deleteData(`/organization/${Api.org.id}/positions/${id}/`, {method: 'Delete'})
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
    return {
        fetchPositions,
        fetchStaffClassifications,
        deletePosition,
        experience,
        Status,
        Qualification
    }
}
export default PositionHelper