import { useState } from "react" 
// import { toast, Slide } from 'react-toastify'
import apiHelper from "../ApiHelper"
const CourseHelper = () => {
    const Api = apiHelper()
   
    const [CourseList] = useState([])
    
  
    const fetchCourseList = async () => {
        const response = await Api.get('/courses/', { headers: {Authorization: Api.token} })
        if (response) {
            if (response.status === 200) {
                CourseList.splice(0, CourseList.length)
                const List = response.data 
                if (Object.values(List).length > 0) {
                    for (let i = 0; i < List.length; i++) {
                        if (List[i].is_active) {
                            CourseList.push(List[i])
                        } 
                      }  
                      return CourseList
                }
            } else {
                Api.Toast('error', response.message)
            }
        }
    }
  const postCourse = async (data) => {
    
            await Api.jsonPost(`/courses/`, data)
                .then((result) => {
                    if (result.status === 200) {
                    Api.Toast('success', result.message)
                    } else {
                        Api.Toast('error', 'not working')
                    }
                })
            .catch((error) => {
                Api.Toast('error', error)
            }) 
    
  } 
  const updateCourse = async (data, slug, uuid) => {
                await Api.jsonPatch(`/courses/${slug}/${uuid}`, data)
                .then((result) => {
                    if (result.status === 200) {
                    Api.Toast('success', result.message)
                    } else {
                        Api.Toast('error', 'not working')
                    }
                })
            .catch((error) => {
                Api.Toast('error', error)
            }) 
    
  } 
  const deleteCourse = async (uuid, slug) => {
    if (uuid && slug) {
        await  Api.deleteData(`/courses/${slug}/${uuid}/`, {method: 'Delete'})
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
        Api.Toast('error', "Course Not Found!")
      }
      
       return false
     
  }  

    return {
        postCourse,
        fetchCourseList,
        deleteCourse,
        updateCourse
    }
}
export default CourseHelper