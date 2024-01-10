// ** React Imports
import { useState, lazy, Suspense } from 'react'
import { Settings } from 'react-feather'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
const SalaryComposition = lazy(() => import('./SalaryComposition'))
const Attributes = lazy(() => import('./SalaryAttributes'))
const Index = lazy(() => import('./Addons_Deductions'))
const Tax = lazy(() => import('./Tax'))
const Configuration = () => {
  const isSuperuser = JSON.parse(localStorage.getItem('is_superuser'))
  const [active, setActive] = useState('1')

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  return (
    <div className='nav-vertical configuration_panel'>
      <Nav tabs className='nav-left'>
        <NavItem>
           <h3 className='brand-text'> <Settings/> Configurations</h3>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '1'}
            onClick={() => {
              toggle('1')
            }}
          >
            Payroll Batches
          </NavLink>
        </NavItem>
        {isSuperuser ? <NavItem>
          <NavLink
            active={active === '2'}
            onClick={() => {
              toggle('2')
            }}
          >
            Salary Attributes
          </NavLink>
        </NavItem> : null}
        <NavItem>
          <NavLink
            active={active === '3'}
            onClick={() => {
              toggle('3')
            }}
          >
            Add/Ons - Deductions
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === '4'}
            onClick={() => {
              toggle('4')
            }}
          >
            Tax
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <Suspense fallback={<div>Loading...</div>}>
          {(() => {
            switch (active) {
              case '1':
                return <TabPane tabId='1' className='tab-pane-blue'><SalaryComposition /></TabPane>
              case '2':
                return <TabPane tabId='2' className='tab-pane-blue'><Attributes /></TabPane>
              case '3':
                return <TabPane tabId='3' className='tab-pane-blue'><Index /></TabPane>
              case '4':
                return <TabPane tabId='4' className='tab-pane-blue'><Tax /></TabPane>
              default:
                return null
            }
          })()}
        </Suspense>
      </TabContent>
    </div>
  )
}
export default Configuration
