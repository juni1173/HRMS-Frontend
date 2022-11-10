import {Form, Spinner, Table, Modal, ModalBody, ModalHeader } from 'reactstrap'
  import { Fragment, useState, useEffect } from 'react'
  import {Edit, Search, XCircle} from 'react-feather'
  
  import PositionHelper from '../../../../Helpers/PositionHelper'
  import UpdatePosition from './updatePosition'

const positionsList = ({ count }) => {
    const Helper = PositionHelper()
    // let [list] = useState(null)
    const [editModal, setEditModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [Activelist, setActiveList] = useState(null)
    // const [searchQuery, setSearch] = useState(null)
    const [updateId, setUpdateId] = useState(null)
    const [updateIdData, setupdateIdData] = useState(null)
    // let [NotActivelist] = useState(null)
    

    // const generateLists = data => {
    //     // list = data.position
    //         if (Object.values(data.positionActive).length > 0) {
    //             setActiveList(data.positionActive)
    //         }
        
    //     // NotActivelist = data.positionNotActive
    // }
    const fetchList = async () => {
        setLoading(true)
        setActiveList(null)
           await Helper.fetchPositions().then(data => {
                if (Object.values(data).length > 0) {
                    if (Object.values(data.positionActive).length > 0) {
                        setActiveList(data.positionActive)
                    }
                    
                }
            })
            setTimeout(() => {
                setLoading(false)
              }, 1000)
    }
    const deletePosition = (id) => {
         Helper.deletePosition(id).then(() => {
            fetchList()
         })
        
       } 
    const updateCallBack = () => {
      setEditModal(false)
      fetchList()
    }   
    // const Search = () => {
    //     alert(searchQuery)
    // }
    const updateModal = (data) => {
      setUpdateId(data.id)
      setupdateIdData(data)
      setEditModal(true)
    }
    useEffect(() => {
        if (count !== 0) {
            fetchList()
        } else {
            fetchList()
        }
      }, [count])
    return (
        <Fragment>
            {/* <Form onSubmit={e => e.preventDefault()}>
                <input
                        type="text"
                        placeholder="Search"
                        onChange={e => setSearch(e.target.value)}
                    /> 
                    <button onClick={Search}>Search</button>
            </Form> */}
            
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
              Code
            </th>
            <th scope="col" className="text-nowrap">
              Experience
            </th>
            <th scope="col" className="text-nowrap">
              Salary Range
            </th>
            
            <th scope="col" className="text-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        
        <tbody className='text-center'>
        {loading && <tr><td colSpan={5}><Spinner /></td></tr>}
          {(Activelist && !loading) ? (
            <>
            {Object.values(Activelist).map((item, key) => (
                    
                    <tr key={key}>
                  <td>{item.title}</td>
                  <td>{item.code}</td>
                  {/* { const experience = item.experience } */}
                  <td>{Helper.experience[item.years_of_experience - 1].label ? Helper.experience[item.years_of_experience - 1].label : `N/A`}</td>
                  <td>Min Salary: {item.min_salary ? item.min_salary : `N/A`} <br/><hr/> Max Salary: {item.max_salary ? item.max_salary : `N/A`}</td>
                  <td>
                    <div className="d-flex row">
                      <div className="col text-center">
                        <button
                          className="border-0"
                          onClick={() => {
                            updateModal(item) 
                          }}
                        >
                          <Edit color="orange" />
                        </button>
                      </div>
                      <div className="col">
                        <button
                          className="border-0"
                          onClick={() => deletePosition(item.id)}
                        >
                          <XCircle color="red" />
                        </button>
                      </div>
                    </div>
                  </td>
                  </tr>
                
              ))}
            </>
          ) : (
            !loading && (
                <tr>
                    <td colSpan={5}>No Data Found</td>
                </tr>
            )
            
          )}
          
        </tbody>
      </Table>
      <Modal isOpen={editModal} toggle={() => setEditModal(!editModal)} className='modal-dialog-centered modal-lg'>
        <ModalHeader className='bg-transparent' toggle={() => setEditModal(!editModal)}></ModalHeader>
        <ModalBody className='px-sm-5 mx-50 pb-5'>

             {updateId ? <UpdatePosition CallBack={updateCallBack} updateIdData={updateIdData} /> : "No Data"}
        </ModalBody>
      </Modal>
    </Fragment>
   
    )
    
}
positionsList.defaultProps = {
    count: 1
}
export default positionsList