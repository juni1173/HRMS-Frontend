import {useState, useEffect, Fragment} from 'react'
import { Spinner, Card, CardBody, Table, Badge, Button } from 'reactstrap'
import { File } from 'react-feather'
import apiHelper from '../../../Helpers/ApiHelper'
const CandidatePool = ({data}) => {
    // console.warn(data)
    const Api = apiHelper()
    const [loading, setLoading] = useState(false)
    const [candidateList, setCandidateList] = useState([])  
    const [checkedItems, setCheckedItems] = useState([])

    const handleCheck = (event) => {
      const { id } = event.target
      const isChecked = event.target.checked
  
      if (isChecked) {
        setCheckedItems([...checkedItems, id])
      } else {
        setCheckedItems(checkedItems.filter((item) => item !== id))
      }
    }
    const getCandidate = async () => {
        setLoading(true)
       await Api.get(`/candidates/list/by/position/exclude/job/candidates/${data.uuid}/`)
            .then((result) => {
                if (result) {
                    if (result.status === 200) {
                        setCandidateList(result.data)
                        
                    } else {
                        Api.Toast('error', result.message)
                    }
                } else {
                    setCandidateList([])
                    Api.Toast('error', 'Server not respnding')
                }
              
            })
        setTimeout(() => {
            setLoading(false)
        }, 500)
            
    }
    const multipleAddCandidates = async () => {
        // console.warn(checkedItems)
        // return false
        if (checkedItems.length > 0) {
            
            // for (let i = 0; i < checkedItems.length; i++) {
            //     employee_arr.push({candidates: parseInt(checkedItems[i])})
            // }
              
                await Api.jsonPost(`/candidates/add/list/to/job/post/${data.uuid}/`, {candidates: checkedItems})
                .then(result => {
                    if (result) {
                        if (result.status === 200) {
                        Api.Toast('success', result.message)
                        getCandidate()
                        } else {
                            Api.Toast('error', result.message)
                        }
                    } else {
                        Api.Toast('error', 'Server not responding!')
                    }
                })
        
        } else {
            Api.Toast('error', 'Please select an employee to add!')
        }
    }
    useEffect(() => {
        getCandidate()
      }, [setCandidateList])
  return (
    <Fragment>
        <div className="row">

        {!loading ? (
            Object.values(candidateList).length > 0 ? (
                <>
                <Card>
                <CardBody>
                    <h2>Candidate Pool</h2>
                    {checkedItems.length > 0 && (
                        <Button className='btn btn-primary mb-1' onClick={multipleAddCandidates}>
                            Add Selected Candidates to {data.title}
                        </Button>
                    )}
                    <Table bordered striped responsive>
                        <thead className='table-dark text-center'>
                            <tr>
                                <th scope="col" className="text-nowrap">
                                    Select
                                </th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>CNIC</th> 
                                <th>Job title</th>
                                <th>Resume</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>

                        {Object.values(candidateList).length > 0 ? (
                            candidateList.map((candidate, index) => (
                                <tr key={index}>
                                    <td><input className='form-check-primary' type="checkbox" id={candidate.candidate_uuid} onChange={handleCheck} /></td>
                                    <td>{candidate.candidate_name ? candidate.candidate_name : <Badge color="light-danger">N/A</Badge>}</td>
                                    <td>{candidate.email ? candidate.email : <Badge color="light-danger">N/A</Badge>}</td>
                                    <td className="text-nowrap">{candidate.cnic_no ? candidate.cnic_no : <Badge color="light-danger">N/A</Badge>}</td> 
                                    <td>{candidate.job_title ? candidate.job_title : <Badge color="light-danger">N/A</Badge>}</td>
                                    <td>
                                        <a className="btn btn-primary btn-sm" target="_blank" href={`${process.env.REACT_APP_BACKEND_URL}${candidate.resume}`}><File/></a>
                                    </td>
                                    <td>{(Object.values(candidate.candidate_job_assessments).length > 0) ? (
                                        <>
                                        <p className="d-flex"><Badge color="light-success">Non-Tech</Badge> {candidate.candidate_job_assessments.non_tech_test ? `${candidate.candidate_job_assessments.non_tech_test[0].percentage}%` : <Badge color="light-danger">N/A</Badge>}</p>
                                        <p className="d-flex"><Badge color="light-success">Tech</Badge> {candidate.candidate_job_assessments.tech_test ? `${candidate.candidate_job_assessments.tech_test[0].percentage}%` : <Badge color="light-danger">N/A</Badge>}</p>
                                        </>
                                        ) : <Badge color="light-danger">N/A</Badge>} </td>
                                </tr>
        
                            ))
                        ) : (
                            <tr className="text-center">
                                <td colSpan={9}> No Candidates Available</td>
                            </tr>
                        )}
                        
                        
                        </tbody>
                    </Table>
                   
                </CardBody>
            </Card>
            
               </>
               ) : (
                   <Card>
                       <CardBody>
                           No Candidates Found...
                       </CardBody>
                   </Card>
           )
        ) : (
            <div className='text-center'><Spinner/></div>
        )
        
        }
        </div>
    </Fragment>
  )
}

export default CandidatePool