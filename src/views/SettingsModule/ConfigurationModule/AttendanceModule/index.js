import React, { Fragment } from 'react'
import { Card, CardBody } from 'reactstrap'
import MachineAttendance from './Components/MachineAttendance'
const index = () => {
  return (
    
    <Fragment>
    <Card>
        <CardBody>
        <div className='nav-vertical configuration_panel'>
        <MachineAttendance />
        </div>
        </CardBody>
    </Card>
</Fragment>
  )
}

export default index