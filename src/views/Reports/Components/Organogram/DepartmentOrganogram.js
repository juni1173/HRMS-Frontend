import React, {useState} from 'react'
import { CardBody, Card, Badge, Modal, ModalHeader, ModalBody, Button } from 'reactstrap'
import user_blank  from "../../../../assets/images/avatars/user_blank.png"
// import SearchHelper from '../../../Helpers/SearchHelper/SearchByObject'
// const TreeNode = ({ node }) => {
//   if (!node.employees) {
//     return null
//   }
  // const renderChildren = (childData, level) => {
  //   if (level <= 0 || childData.data.length === 0) {
  //     return (
  //       childData.children && (
  //         <>
  //         {renderChildren(childData.children, level - 1)}
  //         </>
  //       )
  //     )
  //   }
  //   return (
  //     <>
  //      <div className='d-flex'>
  //       {childData.data.map((employee) => (
  //             <Card className='m-1' key={employee.id} style={{width: "22rem"}}>
  //                   <CardBody className='p-0'>
  //                       <div className="row">
  //                           <div className="col-md-3">
  //                               <Badge color='light-warning'>
  //                               {employee.profile_image ?  <img src={employee.profile_image} style={{height: '50px', width: "50px"}} alt="logo" /> : <img src={user_blank} style={{height:"50px", width: "50px"}} alt="logo" />}   
  //                               </Badge> 
  //                           </div>
  //                           <div className="col-md-9">
  //                               <strong>{employee.name ? employee.name : <Badge color="light-danger">N/A</Badge>}</strong>
  //                               <br></br>
  //                               <Badge color='light-info p-0'>
  //                                   {employee.staff_classification_title && employee.staff_classification_title}
  //                               </Badge>
  //                           </div>
  //                       </div>
  //                   </CardBody>
  //             </Card> 
  //       ))}
  //      </div>
  //      {(childData.children) && (
  //       <>
  //       {renderChildren(childData.children, level - 1)}
  //       </>
  //     )}
  //     </>
  //   )
  // }

//   return (
    
//        <div className='border-right'>
//        <h3 className='px-2'>{node.title}</h3>
//     {(node.employees.children) && (
//           renderChildren(node.employees.children, node.total_levels - 1)
//         )} 
//         </div>
//   )
// }

const TreeComponent = ({ treeData }) => {
  const [centeredModal, setCenteredModal] = useState(false)
  const departmentNames = Object.keys(treeData)
  let maxLevel = 0
  // Calculate the maximum level across all departments
  departmentNames.forEach((departmentName) => {
    const departmentData = treeData[departmentName]
    const levels = Object.keys(departmentData)

    levels.forEach((levelName) => {
      // Extract the level number from the level name (assuming level names are like "level1", "level2", etc.)
      const levelNumber = parseInt(levelName.replace("level", ""), 10)

      if (levelNumber > maxLevel) {
        maxLevel = levelNumber
      }
    })
  })
  return (
    <div className=''>
      
      <Button className='mb-2' color='primary' outline onClick={() => setCenteredModal(!centeredModal)}>
          Full Screen
        </Button>
      <div style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap' }}>
      <table border="1" className='table  table-bordered"'>
        <thead>
          <tr>
            <th>Staff Level</th>
            {departmentNames.map((departmentName) => (
              <th key={departmentName} className='nowrap'>{departmentName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {[...Array(maxLevel).keys()].map((rowIndex) => (
  <tr key={rowIndex}>
    <td>{`${rowIndex + 1}`}</td>
    {departmentNames.map((departmentName) => {
      const employees = treeData[departmentName][`${rowIndex + 1}`]
      return (
        <td key={departmentName}>
          {employees && (
            <>
            {employees.map((employee) => (
            <div key={employee.id}>
              <Card className='m-1' key={employee.id} style={{ width: "22rem" }}>
                <CardBody className='p-0'>
                  <div className="row">
                    <div className="col-md-3">
                      <Badge color='light-warning'>
                        {employee.profile_image ? <img src={`${process.env.REACT_APP_SPACE_URL}${employee.profile_image}`}  style={{ height: '50px', width: "50px" }} alt="logo" /> : <img src={user_blank} style={{ height: "50px", width: "50px" }} alt="logo" />}
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
            </div>
            ))}
            </>
          )}
        </td>
      )
    })}
  </tr>
))}


        </tbody>
      </table>
      </div>
      <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered modal-fullscreen'>
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Organogram</ModalHeader>
          <ModalBody>
              <table border="1" className='table  table-bordered"'>
        <thead>
          <tr>
            <th>Staff Level</th>
            {departmentNames.map((departmentName) => (
              <th key={departmentName} className='nowrap'>{departmentName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        {[...Array(maxLevel).keys()].map((rowIndex) => (
  <tr key={rowIndex}>
    <td>{`${rowIndex + 1}`}</td>
    {departmentNames.map((departmentName) => {
      const employees = treeData[departmentName][`${rowIndex + 1}`]

      return (
        <td key={departmentName}>
          {employees && (
            <>
            {employees.map((employee) => (
            <div key={employee.id}>
              <Card className='m-1' key={employee.id} style={{ width: "22rem" }}>
                <CardBody className='p-0'>
                  <div className="row">
                    <div className="col-md-3">
                      <Badge color='light-warning'>
                        {employee.profile_image ? <img src={employee.profile_image} style={{ height: '50px', width: "50px" }} alt="logo" /> : <img src={user_blank} style={{ height: "50px", width: "50px" }} alt="logo" />}
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
            </div>
            ))}
            </>
          )}
        </td>
      )
    })}
  </tr>
))}
        </tbody>
      </table>
              
          </ModalBody>
          
        </Modal>
      </div>
  )
  
}

export default TreeComponent
