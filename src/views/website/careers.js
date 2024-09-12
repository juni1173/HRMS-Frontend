import {React, useEffect, useState} from 'react'
import { Helmet } from 'react-helmet'
import { Facebook, Instagram, Linkedin, MapPin, Phone } from 'react-feather'
import apiHelper from '../Helpers/ApiHelper'
import { Spinner } from 'reactstrap'

const CareersPage = () => {
    const Api = apiHelper()
    // const baseUrl = 'http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/'
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const getJobs = async () => {
        setLoading(true)
        await Api.get(`/jobs/kavtech/website/`).then(result => {
          if (result) {
            if (result.status === 200) {
              setData(result.data)
            } else {
              setData([])
            }
          } else {
            Api.Toast('error', 'Server not responding!')
          }
        })
        setTimeout(() => {
          setLoading(false)
        }, 1000)
    }
    useEffect(() => {
        // Load jQuery and Bootstrap scripts
        const loadScripts = async () => {
          const jqueryScript = document.createElement('script')
          jqueryScript.src = 'http://code.jquery.com/jquery-3.3.1.min.js'
          jqueryScript.integrity = 'sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8='
          jqueryScript.crossOrigin = 'anonymous'
          document.body.appendChild(jqueryScript)
    
          const popperScript = document.createElement('script')
          popperScript.src = '//cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js'
          document.body.appendChild(popperScript)
    
          const bootstrapScript = document.createElement('script')
          bootstrapScript.src = '//stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js'
          document.body.appendChild(bootstrapScript)
    
          const templateScript = document.createElement('script')
          templateScript.src = 'https://kavtech.net/assets/js/template.js'
          document.body.appendChild(templateScript)
        }
    
        loadScripts()
        getJobs()
        return () => {
          // Cleanup function to remove added scripts
          document.body.removeChild(jqueryScript)
          document.body.removeChild(popperScript)
          document.body.removeChild(bootstrapScript)
          document.body.removeChild(templateScript)
        }
      }, [])
  return (
    <div className='career-body body'>
        <Helmet>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
        <link rel="stylesheet" href="https://kavtech.net/style.css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
        {/* <link rel="stylesheet" href="http://kavtech.sgp1.cdn.digitaloceanspaces.com/staging/assets/font-awesome-4.7.0/css/font-awesome.min.css" /> */}
        <link href="https://kavtech.net/assets/css/template.css" rel="stylesheet" type="text/css" />
        <title>Careers</title>
      </Helmet>
      <div className="container-fluid" style={{ height: '65px' }}>
            <div className="nav">
                 <div className="nav-animation"></div>
                 <div data-collapse="medium" data-animation="default" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="navbar w-nav">
                    <div className="container nav-container" style={{backgroundColor: 'transparent'}}>
                       <a href="https://kavtech.net/index.html" className="brand w-nav-brand"><img src="https://kavtech.net/images/logo-white.png" width="200" loading="lazy" alt="Kavtech logo"/></a>
                       <nav role="navigation" className="nav-menu w-nav-menu">
                          <a href="https://kavtech.net/about.html" className="nav-link w-nav-link">About</a><a href="https://kavtech.net/our-people.html" className="nav-link w-nav-link">Team</a><a href="https://kavtech.net/careers.html" className="nav-link w-nav-link">Careers</a><a href="https://kavtech.net/case-studies.html" className="nav-link w-nav-link">Case Studies</a>
                          <div className="nav-button-wrapper">
                             <div className="button-wrapper">
                                <a href="https://kavtech.net/contact.html" className="button w-button">Give us a call</a>
                                <div className="button-background"></div>
                             </div>
                          </div>
                       </nav>
                       <div className="menu-button w-nav-button">
                          <div className="hamburger-menu">
                             <div className="hamburger-line line-one"></div>
                             <div className="hamburger-line line-two"></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
      </div>

      <div className="row page-header-section">
              <div className="col-md-7" style={{padding: '100px'}}>
                  <h1 className="sub-title text-white">Careers</h1>
                  <p style={{textAlign:'inherit'}}>Where Passion Meets Purpose </p>
              </div>
              <div className="col-md-5 float-right">
                  <img src="https://kavtech.net/images/Careers-Image.png" className="banner-img-width" />
              </div>
          </div>

      <div className="careers-background">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        <h2 className="sub-title text-center text-white">Careers at Kavtech</h2>
                        <p className="text-center">As we continue to expand our horizons and push the boundaries of technology, we are on the lookout for passionate individuals to join our dynamic team. We are not just seeking candidates; we are on a quest for individuals who are ready to embark on a journey of growth, creativity, and excellence. If you are driven by a thirst for knowledge, fueled by curiosity, and inspired to make a meaningful impact, then Kavtech is the place for you. Explore our open vacancies below and discover the exciting opportunities that await you in shaping the future of technology with us.</p>
                        <div className="d-flex justify-content-center mb-5">
                                <a href="#job_div"><button type="button" className="btn btn-primary rounded-pill">Explore Open Roles</button></a>
                        </div>
                        <hr></hr>    
                    </div>
                    <div className="col-md-2"></div>
                </div>
                    
                <div className="row justify-content-center mt-2" id='job_div'>
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <h3 className="sub-title text-center text-white">Our Roles</h3>
                        <p className="text-center">Join our talent Community</p>
                    </div>
                    <div className="col-md-3"></div>
                    <div className="col-md-12">
                        <div className="col-md-12 mb-5" id="">
                            
                            {!loading ? (
                                Object.values(data).length > 0 ? (
                                    Object.values(data).map((item, index) => (
                                        <a href={`http://kav.smartpems.com/apply/${item.uuid}`} index={index} target="_blank">
                                        <div  className="card text-white careers-card bg-dark" style={{cursor: 'pointer'}}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h4 className='text-white'>{item.jd_title ? item.jd_title : 'No title found!'}</h4>
                                                </div>
                                                <div className="col-md-6"><p className="float-right">Openings <span className="fa fa-arrow-down"></span></p></div>
                                            </div>
                                        </div>
                                        </div>
                                        </a>
                                    ))
                                    
                                ) : (
                                    <div  className="card text-white careers-card bg-dark" style={{cursor: 'pointer'}}>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <h4 className='text-white'>No Job Found!</h4>
                                                </div>
                                            </div>
                                        
                                        </div>
                                        </div>
                                )
                            ) : (
                                <div className='text-center'><Spinner color='white' type='grow'/></div>
                            )
                            
                            }
                           
                           
                </div>
                    </div>
                </div>
            </div>
      </div>

      {/* Footer section */}
      <div className="container footer">
            <div className="row">
                  {/* <div class="col-md-6">
                      <h5 className='text-white'>Corporate Lahore</h5>
                      <div class="row">
                        <div class="col-lg-1"><MapPin color='white'/></div>
                        <div class="col-lg-10"><p>Office 910, Floor 9, Haly Tower, Sector R, DHA Phase 2, Lahore</p>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-1"><Phone color='white'/>
                        </div>
                        <div class="col-lg-10">
                          <p><a href="tel:04232291104">(042) 32291104</a></p>
                        </div>
                      </div>
                  </div> */}
                  <div class="col-md-6">
                      <h5 className='text-white'>Los Angeles, USA</h5>
                      <div class="row">
                        <div class="col-lg-1"><MapPin color='white'/></div>
                        <div class="col-lg-10"><p>1001 Wilshire Boulevard #1164, Los Angeles, California, Zip 90017</p>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-1"><Phone color='white'/></div>
                        <div class="col-lg-10"><p><a href="tel:+13159617073">+13159617073</a></p>
                        </div>
                      </div>
                  </div>
                  <div class="col-md-6">
                      <h5 className='text-white'>Lahore, Pakistan</h5>
                      <div class="row">
                        <div class="col-lg-1"><MapPin color='white'/></div>
                        <div class="col-lg-10"><p>P.M Bhatti Building, Major Mustafa Sabir Shaheed Rd, Block D Divine Gardens, Lahore</p>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-lg-1"><Phone color='white'/></div>
                        <div class="col-lg-10"><p><a href="tel:04232291104">(042) 32291104</a></p>
                        </div>
                      </div>
                  </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                  <div class="d-flex justify-content-start">
                    <div class="p-2">
                      <a href="https://kavtech.net/services.html">Services</a>
                    </div>
                    <div class="p-2">
                      <a href="https://kavtech.net/pricing.html">Pricing</a>
                    </div>
                    <div class="p-2">
                      <a href="https://kavtech.net/our-values.html">Our Values</a>
                    </div>
                      <div class="p-2">
                      <a href="https://kavtech.net/contact.html">Contact</a>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="d-flex justify-content-end">
                <div class="p-2">
                  <a href="https://www.facebook.com/KavTechSolutions/" target="_blank"><Facebook color='white' /></a>
                </div>
                <div class="p-2">
                  <a href="https://www.instagram.com/kavtechsolutionspvtltd/" target="_blank"><Instagram color='white'/></a>
                </div>
                <div class="p-2">
                  <a href="https://pk.linkedin.com/company/kavtech-solutions-pvt.-ltd." target="_blank"><Linkedin color='white'/></a>
                </div>
              </div>
                </div>
            </div>
     </div>
      
    </div>
  )
}

export default CareersPage
