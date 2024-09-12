import React, { lazy } from 'react'
// Lazy-loaded components
const RequisitionRequest = lazy(() => import('./components/RequistionRequest'))
// const Approval = lazy(() => import('./compensatoryapproval'))

const Index = () => {

    return (
                    <RequisitionRequest />
    )
}

export default Index
