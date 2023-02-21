import React, { Fragment } from 'react'
import CalenderComponent from './Calender'
import { Card, CardBody } from 'reactstrap'
const Dashboard = () => {
  return (
    <Fragment>
        <Card className='shadow-none border-0 mb-0 rounded-0'>
            <CardBody className='pb-0'>
                <CalenderComponent/>
            </CardBody>
        </Card>
    </Fragment>
  )
}

export default Dashboard