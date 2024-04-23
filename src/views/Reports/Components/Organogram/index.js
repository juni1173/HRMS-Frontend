import {useState, useEffect} from 'react'
import apiHelper from '../../../Helpers/ApiHelper'
import TreeComponent from './DepartmentOrganogram'
import Select from 'react-select'
const index = () => {
    const Api = apiHelper()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [department, setdepartment] = useState('')
    const [departmentsdropdown] = useState([])
    const preDataApi = async () => {
      const response = await Api.get('/reports/pre/data/')
      if (response.status === 200) {
        const data = response.data
        if (Object.values(data).length > 0) {
            departmentsdropdown.splice(0, data.length)
           data.forEach(element => {
            departmentsdropdown.push({value: element.id, label: element.title})
           })
          }
    } else {
          return Api.Toast('error', 'Data not found')
      }
  }
  useEffect(() => {
      preDataApi()
      // console.log('pre ')
      // console.log(position)
      }, [])
    useEffect(() => {
        setLoading(true)
        const formdata = new FormData()
        formdata['department_id'] = department
        Api.jsonPost(`/reports/organogram/departments/`, formdata)
        .then(result => {
            if (result) {
                if (result.status === 200) {
                    setData(result.data)
                } else {
                    Api.Toast('error', result.message)
                }
            } else {
                Api.Toast('error', 'Server not responding!')
            }
        })
        setTimeout(() => {
            setLoading(false)
        }, 500)
    }, [department])
  return (
    <>
    {!loading && (
        Object.values(data).length > 0 && (
            // <div className='overflowx-scroll'>
            <>
            <div className='col-lg-6'>
            <Select
                     isClearable={true}
                     options={departmentsdropdown}
                     className='react-select mb-1'
                     classNamePrefix='select'
                     placeholder="Search by department"
                     onChange={(selectedOption) => {
                       if (selectedOption !== null) {
                           setdepartment(selectedOption.value)
                           console.log(department)
                       } else {
                           setdepartment('')
                       } 
                 
                   }}
                 />
            </div>
            <TreeComponent treeData={data} />
            </>
            // </div>
        )
        
    )}
    </>
  )
}

export default index