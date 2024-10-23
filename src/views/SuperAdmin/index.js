import React, {Fragment} from 'react'
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/authentication'
const index = () => {
    const dispatch = useDispatch()
  return (
    <Fragment>
        <div className='container'>
            <nav className="navbar navbar-light bg-light p-2">
                <a className="navbar-brand" href="#">Super Panel</a>

                <div className="ml-auto">
                    <button className="btn btn-outline-danger" onClick={() => dispatch(handleLogout())}>
                    Logout
                    </button>
                </div>
            </nav>
        </div>
    </Fragment>
  )
}

export default index