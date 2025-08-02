import React from 'react'
import Hero from '../../component/user/Hero'
import Portfolio from '../../component/user/Portfolio'
import Testimonial from '../../component/user/Testimonial'
import NewsLetter from '../../component/user/NewsLetter'

const Home: React.FC = () => {
  return (
    <div>
      <main>
        <Hero />
        <Portfolio/>
        <Testimonial/>
        <NewsLetter/>
      </main>
    </div>
  )
}

export default Home
