// import { useState } from "react"
import { useState, useEffect } from "react"
import { Check, Search } from "react-feather"
import { Spinner, Table, Input, InputGroup, InputGroupText } from "reactstrap"
import apiHelper from "../../../Helpers/ApiHelper"
import SearchHelper from "../../../Helpers/SearchHelper/SearchByObject"
const DeletedJobsList = ({data, count, CallBack}) => {
    const Api = apiHelper()
    const searchHelper = SearchHelper()
    const [Loading, setLoading] = useState(true)
    const [notActiveJobsList, setNotActiveJobList] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [searchQuery] = useState([])


    const getNotActiveJobs = () => {
        const notActiveListArray = []
        setLoading(true)
        Api.get(`/jobs/`)
            .then((result) => {
                if (result.status === 200) {
                     
                    if (result.data.length > 0) {
                        
                        for (let i = 0; i < result.data.length; i++) {
                            if (result.data[i].is_active === false) {
                                notActiveListArray.push(result.data[i]) 
                            }
                            
                        }
                       
                        setLoading(false)
                        setNotActiveJobList(notActiveListArray)
                        setSearchResults(notActiveListArray)
                    }
                } else {
                    Api.Toast('error', result.message)
                }
              
            })
            setTimeout(() => {
                setLoading(false)
            }, 1000)
    }
     
    const ActivateJob = (item) => {
      
         item.is_active = true
         const url = `${process.env.REACT_APP_API_URL}/jobs/${item.uuid}/`
         fetch(url, {
           method: "Patch",
           headers:{'Content-Type': 'application/json', Authorization: Api.token},
           body:JSON.stringify(item)
           })
         .then((response) => response.json())
         .then((result) => {
             console.log(result)
             if (result.status === 200) {
                 Api.Toast('success', result.message)
                 getNotActiveJobs()
                 CallBack()
                 } else {
                     Api.Toast('error', result.message)
                 }
         })
         
         console.log(item)
          
    }
      
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
        Object.values(searchResults).map((item, key) => ( 
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
                       
                      <div className="col">
                        <button
                          className="border-0"
                          onClick={() => ActivateJob(item)}
                        >
                          <Check color="green"/>
                          
                        </button>
                      </div>
                    </div>
                  </td>
                  </tr>
        ))
        ) : (
            <tr>
              <td colSpan={9}><Spinner /></td>
            </tr>
            
          
        )
        }
            
        </tbody>
      </Table>

        </>
    )
}
export default DeletedJobsList