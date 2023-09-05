import React, { Fragment } from 'react'
import { Card, CardBody } from 'reactstrap'
import Manual from './Components/Manual'
const index = () => {
  
  return (
    <Fragment>
        <Card>
            <CardBody>
            <div className='nav-vertical configuration_panel'>
              <Manual />
            </div>
            </CardBody>
        </Card>
    </Fragment>
  )
}

export default index