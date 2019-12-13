import React from 'react'
import Moment from 'react-moment'
import PropTypes from 'prop-types'

const ProfileExperience = ({
  experience: { company, from, to, title, description }
}) => {
  return (
    <div>
      <h3 className='text-dark'>{company}</h3>
      <p>
        <Moment format='DD MMM YYYY'>{from}</Moment> -{' '}
        {to !== null ? <Moment format='DD MMM YYYY'>{to}</Moment> : 'Current'}
      </p>
      <p>
        <strong>Position: </strong>
        {title}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </div>
  )
}

ProfileExperience.propTypes = {
  experience: PropTypes.object.isRequired
}

export default ProfileExperience
