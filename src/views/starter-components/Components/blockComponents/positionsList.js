import {
    Row,
    Form,
    Col,
    Modal,
    Input,
    Label,
    Button,
    ModalBody,
    ModalHeader,
    // FormFeedback,
    Table
  } from 'reactstrap'
const positionsList = () => {
    
    return (
        <>
        
        <div className='divider'>
            <div className='divider-text'><h3 className='my-1'>Positions List</h3></div>
        </div>
        <Table bordered striped responsive>
        <thead className='table-dark text-center'>
        <tr>
            <th scope="col" className="text-nowrap">
            Title
            </th>
            <th scope="col" className="text-nowrap">
            Department
            </th>
            <th scope="col" className="text-nowrap">
            Qualification
            </th>
            <th scope="col" className="text-nowrap">
            Experience
            </th>
            <th scope="col" className="text-nowrap">
            Actions
            </th>
        </tr>
        </thead>
        <tbody className='text-center'>
            <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            </tr>
            
        {/* {groupHeadList ? (
            <>
            {Object.values(groupHeadList).map((item, key) => (
                !item.is_active ? null : (
                    <tr key={key}>
                <td>{item.title}</td>
                <td>{item.grouphead_type === 1 ? groupType[0].label : groupType[1].label}</td>
                <td>{item.is_status ? 'Active' : 'InActive'}</td>
                <td>
                    <div className="d-flex row">
                    <div className="col text-center">
                        <button
                        className="border-0"
                        onClick={() => {
                            getGHeadByID(item.id) 
                        }}
                        >
                        <Edit color="orange" />
                        </button>
                    </div>
                    <div className="col">
                        <button
                        className="border-0"
                        onClick={() => deleteGHeadID(item.id)}
                        >
                        <XCircle color="red" />
                        </button>
                    </div>
                    </div>
                </td>
                </tr>
                )
            ))}
            </>
        ) : (
            <tr>
            <td>No Data Found</td>
            </tr>
        )} */}
        
        </tbody>
        </Table>
    </>
    )
}
export default positionsList