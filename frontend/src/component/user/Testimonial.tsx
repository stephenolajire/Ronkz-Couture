import React from "react";

const Testimonial: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      text: "Ronkz Couture transformed my wardrobe! Their Ankara dresses are stunning and unique. The attention to detail is impeccable.",
      name: "Jane Doe",
      role: "Fashion Enthusiast",
      rating: 5,
      location: "Lagos, Nigeria",
      date: "2023-10-01",
    },
    {
      id: 2,
      text: "I love the quality and design of Ronkz Couture's dresses. They make me feel beautiful! The customer service is also top-notch.",
      name: "Mary Smith",
      role: "Satisfied Customer",
      rating: 4.5,
      location: "Abuja, Nigeria",
      date: "2023-09-15",
    },
    {
      id: 3,
      text: "Ronkz Couture's Ankara collection is a game-changer! The colors and patterns are vibrant, and the fit is perfect. Highly recommend!",
      name: "Alice Johnson",
      role: "Style Icon",
      rating: 5,
      location: "Port Harcourt, Nigeria",
      date: "2023-08-20",
    },
    {
      id: 4,
      text: "I had an amazing experience shopping at Ronkz Couture. The dresses are not only beautiful but also comfortable to wear. Will definitely shop again!",
      name: "Emily Davis",
      role: "Happy Customer",
      rating: 4.8,
      location: "Ibadan, Nigeria",
      date: "2023-07-10",
    },
  ];
  return (
    <div className="h-auto py-15 md:py-20 lg:py-25 bg-red-100 px-4 sm:px-10 md:px-30 lg:px-50">
      <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 text-center">
        What Our <span className="text-yellow-500">Clients Say</span>
      </h1>
      <p className="mt-4 text-lg md:text-2xl text-gray-500 text-center">
        Don't just take our word for it - hear from the amazing women who wear
        our <br /> designs.
      </p>

      <div className="mt-10 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center mt-4">
              {[...Array(Math.round(testimonial.rating))].map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-yellow-500"
                >
                  <path d="M12 .587l3.668 7.568 8.332 1.214-6.042 5.882 1.428 8.316L12 18.896l-7.386 3.861 1.428-8.316L.001 9.369l8.332-1.214L12 .587z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-700 text-lg md:text-2xl italic mt-4">
              "{testimonial.text}"
            </p>
            <div>
              <div className="mt-4">
                <h3 className="text-xl font-semibold">{testimonial.name}</h3>
                <p className="text-gray-500">{testimonial.role}</p>
              </div>
                <p className="text-gray-400 text-base mt-1">
                    {testimonial.location} - {new Date(testimonial.date).toLocaleDateString()}  
                </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
