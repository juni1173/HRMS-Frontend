import { lazy } from 'react'

// ** Document title
const TemplateTitle = '%s - HRM'

// ** Default Route
const DefaultRoute = '/login'

// ** Merge Routes
const Routes = [
  {
    path: '/home',
    component: lazy(() => import('../../views/Home'))
  },
  {
    path: '/positions',
    component: lazy(() => import('../../views/Jobs-Setup/positions'))
  },
  {
    path: '/job-description',
    component: lazy(() => import('../../views/Jobs-Setup/job-description'))
  },
  {
    path: '/Jobs',
    component: lazy(() => import('../../views/Jobs'))
  },
  {
    path: '/second-page',
    component: lazy(() => import('../../views/SecondPage'))
  },
  {
    path: '/organizationHome',
    component: lazy(() => import('../../views/Organization/index'))
  },
  {
    path: '/organization-setup',
    component: lazy(() => import('../../views/Organization/setup-form/index')),
    meta: {
      navLink: '/organizationHome'
    }
  },
  {
    path: '/candidates',
    component: lazy(() => import('../../views/Candidates/index'))
  },
  {
    path: '/apply',
    component: lazy(() => import('../../views/Candidates/Components/applyform')),
    layout: 'BlankLayout',
    meta: {
      authRoute: false
    }
  },
  {
    path: '/login',
    component: lazy(() => import('../../views/auth/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/register',
    component: lazy(() => import('../../views/auth/Register')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
]

export { DefaultRoute, TemplateTitle, Routes }
