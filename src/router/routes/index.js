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
    path: '/questions',
    component: lazy(() => import('../../views/Interview-Questions/index'))
  },
  {
    path: '/exam',
    component: lazy(() => import('../../views/timer/index')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/apply/:uuid',
    component: lazy(() => import('../../views/Candidates/Components/applyform')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/assessment/test/:uuid',
    component: lazy(() => import('../../views/Candidates/Components/AssessmentTest/index')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
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
  // employee routes
  {
    path: '/employeeInformation',
    component: lazy(() => import('../../views/Employee-Information/index'))
  },
  {
    path: '/employeeList',
    component: lazy(() => import('../../views/Employee-Information/EmployeeList/index'))
  },
  {
    path: '/employeeDetail/:uuid',
    component: lazy(() => import('../../views/Employee-Information/EmployeeDetail/index'))
  },
  {
    path: '/email_templates',
    component: lazy(() => import('../../views/SettingsModule/index'))
  },
  {
    path: '/subjects',
    component: lazy(() => import('../../views/LearningDevelopment/Components/Subjects'))
  },
  {
    path: '/programs',
    component: lazy(() => import('../../views/LearningDevelopment/Components/Programs'))
  },
  {
    path: '/courses',
    component: lazy(() => import('../../views/LearningDevelopment/Components/Courses'))
  },
  {
    path: '/course-sessions',
    component: lazy(() => import('../../views/LearningDevelopment/Components/Sessions'))
  },
  {
    path: '/instructor',
    component: lazy(() => import('../../views/LearningDevelopment/Components/Instructors'))
  },
  {
    path: '/applicants/trainees',
    component: lazy(() => import('../../views/LearningDevelopment/Components/Sessions/ApplicantsAndTrainees'))
  },
  {
    path: '/learning_development/dashboard',
    component: lazy(() => import('../../views/LearningDevelopment/Components/Dashboard'))
  },
  {
    path: '/kind_notes',
    component: lazy(() => import('../../views/Kind-Notes'))
  },
  {
    path: '/public/kind_notes',
    component: lazy(() => import('../../views/Public-Kind-Notes')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/projects',
    component: lazy(() => import('../../views/Projects'))
  },
  {
    path: '/configurations',
    component: lazy(() => import('../../views/SettingsModule/ConfigurationModule/Configuration'))
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  }
]

export { DefaultRoute, TemplateTitle, Routes }
