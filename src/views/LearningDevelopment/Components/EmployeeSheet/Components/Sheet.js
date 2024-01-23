import {useState, useEffect} from 'react'
import { Card, CardBody, Table, Button, Badge, Spinner, Col, InputGroup, InputGroupText, Input } from 'reactstrap'
import { Search } from 'react-feather'
import apiHelper from '../../../../Helpers/ApiHelper'
import SearchHelper from '../../../../Helpers/SearchHelper/SearchByObject'
const Sheet = () => {
    const Api = apiHelper()
    const searchHelper = SearchHelper()
    const [searchResults, setSearchResults] = useState([])
    const [searchQuery] = useState([])
    
    const [sheetData, setSheetData] = useState([])
    const [loading, setLoading] = useState(false)
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
    const getSheetData = async () => {
        setLoading(true)
            await Api.get(`/learning-and-development/worksheets/`).then(result => {
                if (result) {
                    if (result.status === 200) {
                        setSheetData(result.data)
                        setSearchResults(result.data)
                    } else {
                        Api.Toast('error', result.message)
                    }
                }
            })
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }
    useEffect(() => {
        getSheetData()
    }, [setSheetData])
  return (
    <>
    <div>
     <Card>
         <CardBody>
         <div className='row  my-1'>
            <Col md={6}>
                <h3>Employee L&D Enrollment Sheet</h3>
            </Col>
            <Col md={6}>
                <InputGroup className='input-group-merge mb-2'>
                    <InputGroupText>
                        <Search size={14} />
                    </InputGroupText>
                    <Input placeholder='Search Training Name...'  onChange={e => { getSearch({list: sheetData, key: 'training_name', value: e.target.value }) } }/>
                </InputGroup>
            </Col>
          </div>
             <Table bordered striped responsive>
                 <thead className='table-dark text-center'>
                     <tr>
                         {/* <th>Employee ID</th> */}
                         <th>Trainee Name</th>
                         <th>Training Category</th> 
                         <th>Paid/Unpaid</th>
                         <th>Training Name</th>
                         <th>Training Tenure</th>
                         <th>Trainer</th>
                         <th>Start Date</th>
                         <th>End Date</th>
                         <th>Status</th>
                     </tr>
                 </thead>

                 <tbody>

                 {!loading ? (
                    Object.values(searchResults).length > 0 ? (
                        searchResults.map((data, index) => (
                            <tr key={index}>
                                {/* <td>{data.trainee_name.length > 0 ? (data.trainee_name[0].employee_id ? data.trainee_name[0].employee_id : <Badge color="light-danger">N/A</Badge>) : <Badge color="light-danger">N/A</Badge>}</td> */}
                                <td>{data.trainee_name.length > 0 ? (
                                    data.trainee_name.map((item) => (
                                       <p>{item.trainee_name ? item.trainee_name : <Badge color="light-danger">N/A</Badge>}</p>
                                    ))) : <Badge color="light-danger">N/A</Badge>}</td>
                                <td>{data.training_category ? data.training_category : <Badge color="light-danger">N/A</Badge>}</td> 
                                <td>{data.course_session_type_title ? data.course_session_type_title : <Badge color="light-danger">N/A</Badge>}</td>
                                <td className="text-nowrap">
                                    {data.training_name ? data.training_name : <Badge color="light-danger">N/A</Badge>}
                                </td>
                                <td>{data.duration ? data.duration : <Badge color="light-danger">N/A</Badge>} </td>
                                <td className="text-nowrap">
                                    {data.instructors.length > 0 ? (data.instructors[0].instructor_name ? data.instructors[0].instructor_name : <Badge color="light-danger">N/A</Badge>) : <Badge color="light-danger">N/A</Badge>}
                                </td>
                                <td className="text-nowrap">
                                   {data.start_date ? data.start_date : <Badge color="light-danger">N/A</Badge>}
                                </td>
                                <td className="text-nowrap">{data.end_date ? data.end_date : <Badge color="light-danger">N/A</Badge>}</td>
                                <td>{data.session_status ? data.session_status : <Badge color="light-danger">N/A</Badge>}</td>
                            </tr>
    
                        ))
                         ) : (
                            <tr className="text-center">
                                <td colSpan={9}> No Candidates Available</td>
                            </tr>
                        )
                 ) : (
                        <tr className="text-center">
                            <td colSpan={9}> <Spinner /></td>
                        </tr>
                 )
                 
                 }
                 
                 
                 </tbody>
             </Table>
            
         </CardBody>
     </Card>
         
     </div>
 </>
  )
}

export default Sheet