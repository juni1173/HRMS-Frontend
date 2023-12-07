import React, {useState, lazy, Suspense} from 'react'
// import Attributes from './components/attributes'
// import AddonAttributes from './components/addonattribute'
// import DeductionAttributes from './components/deductionattribute'
// import AddAttribute from './components/addpayrollattributes'
// import CustomizedAttributes from './components/customizedattributes'
const Attributes = lazy(() => import('./components/attributes'))
const AddonAttributes = lazy(() => import('./components/addonattribute'))
const DeductionAttributes = lazy(() => import('./components/deductionattribute'))
const AddAttribute = lazy(() => import('./components/addpayrollattributes'))
const CustomizedAttributes = lazy(() => import('./components/customizedattributes'))
import { Row, Col } from 'reactstrap'
const index = () => {
  const [dataUpdated, setDataUpdated] = useState(false)
  const callBack = () => {
    setDataUpdated(!dataUpdated)
  }

  return (
    <div className='row'>
        <div className='col-lg-12'>
        <Suspense fallback={<div>Loading...</div>}>
          <Attributes />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <AddAttribute callBack={callBack} />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <AddonAttributes callBack={callBack} />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <DeductionAttributes callBack={callBack} />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <CustomizedAttributes callBack={callBack} />
        </Suspense>
        </div>
    </div>
  )
}

export default index