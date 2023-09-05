import React, {useState} from 'react'
import { CardBody, Card, Badge, Modal, ModalHeader, ModalBody, Button } from 'reactstrap'
import user_blank  from "../../../../assets/images/avatars/user_blank.png"
const TreeNode = ({ node }) => {
  if (!node.employees) {
    return null
  }
  const renderChildren = (childData, level) => {
    if (level <= 0 || childData.data.length === 0) {
      return (
        childData.children && (
          <>
          {renderChildren(childData.children, level - 1)}
          </>
        )
      )
    }
    return (
      <>
       <div className='d-flex'>
        {childData.data.map((employee) => (
              <Card className='m-1' key={employee.id} style={{width: "22rem"}}>
                    <CardBody className='p-0'>
                        <div className="row">
                            <div className="col-md-3">
                                <Badge color='light-warning'>
                                {employee.profile_image ?  <img src={employee.profile_image} style={{height: '50px', width: "50px"}} alt="logo" /> : <img src={user_blank} style={{height:"50px", width: "50px"}} alt="logo" />}   
                                </Badge> 
                            </div>
                            <div className="col-md-9">
                                <strong>{employee.name ? employee.name : <Badge color="light-danger">N/A</Badge>}</strong>
                                <br></br>
                                <Badge color='light-info p-0'>
                                    {employee.staff_classification_title && employee.staff_classification_title}
                                </Badge>
                            </div>
                        </div>
                    </CardBody>
              </Card> 
        ))}
       </div>
       {(childData.children) && (
        <>
        {renderChildren(childData.children, level - 1)}
        </>
      )}
      </>
    )
  }

  return (
    
      <div className='border-right'>
      <h3 className='px-2'>{node.title}</h3>
      {(node.employees.children) && (
          renderChildren(node.employees.children, node.total_levels - 1)
        )}
        </div>
  )
}

const TreeComponent = ({ treeData }) => {
  const [centeredModal, setCenteredModal] = useState(false)
  return (
    <div className=''>
      <Button className='mb-2' color='primary' outline onClick={() => setCenteredModal(!centeredModal)}>
          Full Screen
        </Button>
      <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap' }}>
     { treeData.map((node) => (
      <div className='col' key={node.id}>
        <TreeNode key={node.id} node={node} />
      </div>
      ))}
      </div>
      <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered modal-fullscreen'>
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Organogram</ModalHeader>
          <ModalBody>
          <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap' }}>
            { treeData.map((node) => (
              <div className='col' key={node.id}>
                <TreeNode key={node.id} node={node} />
              </div>
              ))}
              </div>
          </ModalBody>
          
        </Modal>
      </div>
  )
  
}

export default TreeComponent
