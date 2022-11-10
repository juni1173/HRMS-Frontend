import "@styles/react/apps/app-users.scss"
import { Input, Col, InputGroup, InputGroupText, TabContent, TabPane, Nav, NavItem, NavLink, Offcanvas, OffcanvasHeader, OffcanvasBody, Card, CardBody, CardTitle, CardText } from "reactstrap"
import CandidateListTable from "./CandidateListTable"
import { Search } from "react-feather"
import {CandidateListNavBar, CandidateListNavBarButton} from "./CandidateListNavBar"
const CandidateList = () => {
    
    return (
        <div className="row mt-4">
            <CandidateListNavBar/>
            <div className="col-lg-4">
                <InputGroup className='input-group-merge mb-2'>
                    <InputGroupText>
                       <Search size={14} />
                    </InputGroupText>
                    <Input placeholder='search...' />
                </InputGroup>
            </div>
            <CandidateListNavBarButton/>
            <CandidateListTable/>
        </div>    
    )
}

export default CandidateList