import React from 'react'
import Hero from '../../component/landing/Hero'
import Portfolio from '../../component/landing/Portfolio'
import Testimonial from '../../component/landing/Testimonial'
import NewsLetter from '../../component/landing/NewsLetter'

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
