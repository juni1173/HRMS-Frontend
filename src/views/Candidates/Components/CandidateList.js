import "@styles/react/apps/app-users.scss"
import { Input, Col, InputGroup, InputGroupText, TabContent, TabPane, Nav, NavItem, NavLink, Offcanvas, OffcanvasHeader, OffcanvasBody, Card, CardBody, CardTitle, CardText } from "reactstrap"
import CandidateListTable from "./CandidateListTable"
import { Search } from "react-feather"
import {CandidateListNavBar, CandidateListNavBarButton} from "./CandidateListNavBar"
import apiHelper from "../../Helpers/ApiHelper"
import { Fragment, useState, useEffect  } from "react"  

const CandidateList = () => {

    const [candidateList, setCandidateList] = useState([])  

    const Api = apiHelper() 

    const getCandidate = () => {
        const url = `${process.env.REACT_APP_API_URL}/candidate/apply/form/`
        fetch(url, {
            method: "GET",
            headers: {Authorization: Api.token }
            })
            .then((response) => response.json())
            .then((result) => {
            //   console.log(result.data)
              setCandidateList(result.data)
            })
         
    }
    useEffect(() => {
        getCandidate()
      }, [])
    console.log(candidateList)
    return (
        <div className="row mt-6">
            <CandidateListNavBar/>
            <div className="col-lg-6">
                <InputGroup className='input-group-merge mb-2'>
                    <InputGroupText>
                       <Search size={14} />
                    </InputGroupText>
                    <Input placeholder='search...' />
                </InputGroup>
            </div>
            <CandidateListNavBarButton/>
            <CandidateListTable data={candidateList}/>
        </div>    
    )
}

export default CandidateList