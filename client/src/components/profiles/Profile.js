import React, { Fragment, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Spinner from '../layout/Spinner'
import ProfileTop from './ProfileTop'
import ProfileAbout from './ProfileAbout'
import ProfileExperience from './ProfileExperience'
import ProfileEducation from './ProfileEducation'
import { getProfileById, getGithubRepos } from '../../actions/profile'
import ProfileGithubRepo from './ProfileGithubRepo'

const Profile = ({
  getProfileById,
  getGithubRepos,
  profile: { profile, repos, loading },
  auth,
  match
}) => {
  useEffect(() => {
    getProfileById(match.params.id)
  }, [getProfileById, match.params.id])

  useEffect(() => {
    if (profile !== null && !loading) {
      getGithubRepos(profile.githubusername)
    }
  }, [profile, loading, getGithubRepos])

  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <Link to='/profiles' className='btn btn-light'>
            Back to profiles
          </Link>
          {auth.isAuthenticated &&
          auth.loading === false &&
          auth.user._id === profile.user._id ? (
            <Link to='/edit-profile' className='btn btn-dark'>
              Edit profile
            </Link>
          ) : (
            ''
          )}
          <div className='profile-grid my-1'>
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className='profile-exp bg-white p-2'>
              <h2 className='text-primary'>Experience</h2>
              {profile.experience.length > 0 ? (
                profile.experience.map(exp => (
                  <ProfileExperience
                    key={exp._id}
                    experience={exp}
                  ></ProfileExperience>
                ))
              ) : (
                <h4>No experience</h4>
              )}
            </div>
            <div className='profile-edu bg-white p-2'>
              <h2 className='text-primary'>Education</h2>
              {profile.education.length > 0 ? (
                profile.education.map(edu => (
                  <ProfileEducation
                    key={edu._id}
                    education={edu}
                  ></ProfileEducation>
                ))
              ) : (
                <h4>No education</h4>
              )}
            </div>
            <div className='profile-github'>
              <h2 className='text-primary my-1'>
                <i className='fab fa-github'></i> Github Repos
              </h2>
              {repos.length > 0 ? (
                repos.map(repo => (
                  <ProfileGithubRepo
                    key={repo.id}
                    repo={repo}
                  ></ProfileGithubRepo>
                ))
              ) : (
                <h4>No GitHub repo</h4>
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  getGithubRepos: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
})

export default connect(mapStateToProps, { getProfileById, getGithubRepos })(
  Profile
)
