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
    path: '/careers',
    component: lazy(() => import('../../views/website/careers')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/kavskill',
    component: lazy(() => import('../../views/Kavskills/index')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/track/:uuid',
    component: lazy(() => import('../../views/Candidates/Components/trackform')),
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
    path: '/course/detail/:slug/:uuid',
    component: lazy(() => import('../../views/LearningDevelopment/Components/Courses/CourseDetail'))
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
    path: '/employee/certifications',
    component: lazy(() => import('../../views/LearningDevelopment/Components/Certification'))
  },
  {
    path: '/hr/certifications',
    component: lazy(() => import('../../views/LearningDevelopment/Components/Certification/HRApprovals'))
  },
  {
    path: '/hr/trainings',
    component: lazy(() => import('../../views/LearningDevelopment/Components/Trainings/index'))
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
    path: '/jira',
    component: lazy(() => import('../../views/Projects/Components/JiraProjectComponents/JiraIndex'))
  },
  {
    path: '/requests',
    component: lazy(() => import('../../views/EmployeeHRrequests/index'))
  },
  {
    path: '/statusrequests',
    component: lazy(() => import('../../views/HRApprovals/index'))
  },
  {
    path: '/attendancelist',
    component: lazy(() => import('../../views/EmployeeAttendance/index'))
  },
  {
    path: '/employeelearninganddevelopment',
    component: lazy(() => import('../../views/Employee-Learning-Development/index'))
  },
  {
    path: '/employee_profile',
    component: lazy(() => import('../../views/auth/AccountSettings'))
  },
  {
    path: '/rolesandpermissions',
    component: lazy(() => import('../../views/SettingsModule/ConfigurationModule/RolesConfiguration/Roles'))
  },
  {
    path: '/configurations',
    component: lazy(() => import('../../views/SettingsModule/ConfigurationModule/Configuration'))
  },
  {
    path: '/reports',
    component: lazy(() => import('../../views/Reports/index'))
  },
  {
    path: '/admin/dashboard',
    component: lazy(() => import('../../views/Dashboard/Components/AdminDashboard'))
  },
  {
    path: '/employee/dashboard',
    component: lazy(() => import('../../views/Dashboard/Components/EmployeeDashboard'))
  },
  {
    path: '/employee/kpi',
    component: lazy(() => import('../../views/KpiModule/index'))
  },

  {
    path: '/hr/kpi',
    component: lazy(() => import('../../views/KpiModule/HRkpi/index'))
  },
  {
    path: '/hr/kavskills',
    component: lazy(() => import('../../views/Kavskills/hr_kavskills/index'))
  },
  {
    path: '/learning_development/employee/sheet',
    component: lazy(() => import('../../views/LearningDevelopment/Components/EmployeeSheet'))
  },
  {
    path: '/employee/manuals',
    component: lazy(() => import('../../views/EmployeeSOPModule/index'))
  },
  {
    path: '/admin/attendance',
    component: lazy(() => import('../../views/Admin_Attendance/index'))
  },

  {
    path: '/forgot-password',
    component: lazy(() => import('../../views/auth/ForgotPassword/ForgotPasswordForm')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  // Payroll Routes
  {
    path: '/payroll-configuration',
    component: lazy(() => import('../../views/admin-payroll/Components/PayrollConfigurations'))
  },
  {
    path: '/salary-permissions',
    component: lazy(() => import('../../views/admin-payroll/Components/emp-salary'))
  },
  {
    path: '/hr/payroll',
    component: lazy(() => import('../../views/admin-payroll/Components/hrpayroll'))
  },
  {
    path: '/accountant/payroll',
    component: lazy(() => import('../../views/admin-payroll/Components/AccountantView.js/Tabs'))
  },
  {
    path: '/payroll/salarybatch',
    component: lazy(() => import('../../views/admin-payroll/Components/hrpayrollcomponents/AllPayrollBatches'))
  },
  {
    path: '/payroll/attributes',
    component: lazy(() => import('../../views/admin-payroll/Components/PayrollConfigurations/Addons_Deductions/List'))
  },
  {
    path: '/payroll/selectbatch',
    component: lazy(() => import('../../views/admin-payroll/Components/AccountantView.js/AllSalaryBatches'))
  },
  {
    path: '/payroll/salary/batches',
    component: lazy(() => import('../../views/admin-payroll/Components/SalaryRecords/SalaryBatches'))
  },
  {
    path: '/payroll/salary/record',
    component: lazy(() => import('../../views/admin-payroll/Components/SalaryRecords/Record'))
  },
  {
    path: '/reset-password/:id/:token',
    component: lazy(() => import('../../views/auth/ForgotPassword/ResetPassword')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/employee/payroll',
    component: lazy(() => import('../../views/employee-payroll/'))
  },
  //Tickets routes

  {
    path: '/employee/tickets',
    component: lazy(() => import('../../views/TicketsModule/index'))
  },
  {
    path: '/hr/tickets',
    component: lazy(() => import('../../views/TicketsModule/HRModule/index'))
  },
  {
    path: '/error',
    component: lazy(() => import('../../views/Error')),
    layout: 'BlankLayout'
  },
  {
    path: '/Resume',
    component: lazy(() => import('../../views/emp_resume'))
  },
  // Zoom routes
  {
    path: '/zoom',
    component: lazy(() => import('../../views/Zoom/index'))
  },
  {
    path: '/zoommeeting/:id/:pass/:token/:role',
    component: lazy(() => import('../../views/Zoom/Components/JoinMeeting')),
    layout:'BlankLayout'
  },
  // Email Routes
  {
    path: '/email/connect',
    component: lazy(() => import('../../views/EmailIntegrations/index'))
  },
  {
    path: '/email/panel',
    exact: true,
    appLayout: true,
    className: 'email-application',
    component: lazy(() => import('../../views/EmailIntegrations/EmailComponents/Panel'))
  }
]

export { DefaultRoute, TemplateTitle, Routes }
