import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className={`landing`}>
      <h1>landing</h1>
      <Link to = '/home'>
        <button className={`landing-button`}>Enter</button>
      </Link>
    </div>
  )
}