import React from 'react'
import DoctorDetailPage from './DoctorDetailPage'

describe('<DoctorDetailPage />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<DoctorDetailPage />)
  })
})