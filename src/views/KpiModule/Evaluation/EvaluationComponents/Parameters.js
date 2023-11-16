import React from 'react'
import { CardBody, Card, Row } from 'reactstrap'

const Parameters = ({ data }) => {
  return (
    <>
    <h3>Parameters</h3>
    {data && (
        data.map((item, key) => (
            <>
            <Row>
            <Card key={key} className="dark-shadow">
                <CardBody>
                {item.title}
                </CardBody>
            </Card>
            </Row>
            </>
        ))
    )
    }
    
    </>
  )
}

export default Parameters