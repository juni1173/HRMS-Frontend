import {Nav, NavItem, NavLink}  from "reactstrap"
import { useState } from "react"
const CandidateListNavBar = () => {

   const [active, setActive] = useState('all')
   const toggle = tab => {
        setActive(tab)
        }

   return (
        <div className="col-lg-6">
            <Nav tabs>
                <div className='col-md-1'>
                    <NavItem>
                    <NavLink
                        active={active === 'all'}
                        onClick={() => {
                        toggle('all')
                        }} 
                    >
                    ALL
                    </NavLink>
                    </NavItem>
                </div>
                <div className='col-md-3'>
                    <NavItem>
                    <NavLink
                    active={active === 'qualified'}
                    onClick={() => {
                    toggle('qualified')
                    }}  
                    >
                    Qualified
                    </NavLink>
                    </NavItem>
                </div>
                <div className='col-md-3'>
                    <NavItem>
                    <NavLink
                        active={active === 'disqualified'}
                        onClick={() => {
                        toggle('disqualified')
                        }} 
                    >
                    Disqualified
                    </NavLink>
                    </NavItem>
                </div>
                <div className='col-md-2'>
                    <NavItem>
                    <NavLink
                        active={active === 'deleted'}
                        onClick={() => {
                        toggle('deleted')
                        }} 
                    >
                    Deleted
                    </NavLink>
                    </NavItem>
                </div>
            </Nav>
        </div>
    )
}

const CandidateListNavBarButton = ({callFilters}) => {

   const [active, setActive] = useState('all')
   const toggle = tab => {
        setActive(tab)
        }

   return (
        <div className="row ">
            <div className="col-lg-8">
                <Nav tabs>
                    {/* <div className='col-md-4'>
                    <button className="btn btn-primary">ADD CANDIDATES</button>
                    </div> */}
                    <div className='col-md-3 '>
                        <NavItem>
                        <NavLink
                             active={active === 'editColumn'}
                             onClick={() => {
                             toggle('editColumn')
                             }} 
                        >
                        EDIT COLUMNS
                        </NavLink>
                        </NavItem>
                    </div>
                    <div className='col-md-2 '>
                
                        <NavItem>
                        <NavLink
                             active={active === 'filters'}
                             onClick={() => {
                             callFilters()
                             }} 
                        >
                    FILTERS
                        </NavLink>
                        </NavItem>
                    </div>
                    
                </Nav>
            </div>
        </div> 
   )
}
export {CandidateListNavBar, CandidateListNavBarButton} 