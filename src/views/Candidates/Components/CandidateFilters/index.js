import {React} from 'react'
import { Input, InputGroup, InputGroupText, Spinner } from "reactstrap"
import { Search } from "react-feather"
const CandidateFilters = ({getSearch, candidateList}) => {

  return (
    <div className='row'>
        <div className='col-lg-6'>
                <InputGroup className='input-group-merge mb-2'>
                    <InputGroupText>
                       <Search size={14} />
                    </InputGroupText>
                    <Input placeholder='search name...' onChange={e => { getSearch({list: candidateList, key: 'candidate_name', value: e.target.value }) } }/>
                </InputGroup>
        </div>
        <div className='col-lg-6'>
             <InputGroup className='input-group-merge mb-2'>
                    <InputGroupText>
                       <Search size={14} />
                    </InputGroupText>
                    <Input placeholder='search title...' onChange={e => { getSearch({list: candidateList, key: 'job_title', value: e.target.value }) } }/>
                </InputGroup>
        </div>
       
    </div>
  )
}

export default CandidateFilters