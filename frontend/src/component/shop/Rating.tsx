import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

const RatingData = [
  {
    id: 1,
    rating: 5,
    text: "The craftsmanship of this Ankara dress is exceptional! The fit is perfect and the fabric quality is outstanding. I've received countless compliments.",
    name: "Aisha Mohammed",
    date: "02-08-2024",
  },
  {
    id: 2,
    rating: 5,
    text: "Absolutely stunning Senator suit! The attention to detail and the perfect measurements made me look elegant at my business meeting.",
    name: "Michael Okonkwo",
    date: "01-08-2024",
  },
  {
    id: 3,
    rating: 4.5,
    text: "Beautiful traditional attire with a modern twist. The colors are vibrant and the design is unique. Just wish the delivery was faster.",
    name: "Sarah Adebayo",
    date: "31-07-2024",
  },
  {
    id: 4,
    rating: 5,
    text: "My wedding dress was absolutely perfect! The beadwork and details exceeded my expectations. Thank you for making my day special!",
    name: "Grace Okafor",
    date: "30-07-2024",
  },
  {
    id: 5,
    rating: 4,
    text: "Great office wear collection. The blazer set fits well and looks professional. The fabric is comfortable for all-day wear.",
    name: "David Adekunle",
    date: "29-07-2024",
  },
  {
    id: 6,
    rating: 5,
    text: "The customization options are amazing! They perfectly incorporated my design ideas into the final piece. Worth every penny!",
    name: "Chioma Peters",
    date: "28-07-2024",
  },
  {
    id: 7,
    rating: 4,
    text: "Love my new Ankara jumpsuit! Modern, comfortable, and stylish. The pockets are a great addition.",
    name: "Fatima Ibrahim",
    date: "27-07-2024",
  },
  {
    id: 8,
    rating: 5,
    text: "Exceptional quality and service! The measurement process was thorough and the final fit is impeccable.",
    name: "Samuel Johnson",
    date: "26-07-2024",
  },
  {
    id: 9,
    rating: 4.5,
    text: "The evening gown is stunning! Perfect for my dinner party. The mix of traditional and modern elements is brilliant.",
    name: "Elizabeth Okoro",
    date: "25-07-2024",
  },
  {
    id: 10,
    rating: 5,
    text: "Impressive craftsmanship on my traditional wedding attire. The beading work is exquisite and the fit is perfect.",
    name: "Abdul Rahman",
    date: "24-07-2024",
  },
  {
    id: 11,
    rating: 4,
    text: "Beautiful work on my corporate dresses. The fabric quality is great and the style is perfect for office wear.",
    name: "Victoria Eze",
    date: "23-07-2024",
  },
  {
    id: 12,
    rating: 5,
    text: "The party dress exceeded my expectations! The design is unique and the finish is flawless. Definitely coming back for more!",
    name: "Blessing Osei",
    date: "22-07-2024",
  },
  {
    id: 13,
    rating: 4.5,
    text: "Love the modern take on traditional styles. The outfit is comfortable and the colors are exactly as shown.",
    name: "Hassan Ahmed",
    date: "21-07-2024",
  },
  {
    id: 14,
    rating: 5,
    text: "Outstanding quality! The dress fits perfectly and the fabric is breathable. Perfect for Lagos weather!",
    name: "Joy Oluwaseun",
    date: "20-07-2024",
  },
  {
    id: 15,
    rating: 4,
    text: "Great experience with the virtual fitting. The final product fits just as well as if I had been there in person.",
    name: "Taiwo Adeleke",
    date: "19-07-2024",
  },
  {
    id: 16,
    rating: 5,
    text: "The bridal train dresses are gorgeous! Everyone loved the unique design and perfect coordination.",
    name: "Precious Nnamdi",
    date: "18-07-2024",
  },
  {
    id: 17,
    rating: 4.5,
    text: "Excellent work on my maternity dress. The design is flattering and the fabric is so comfortable.",
    name: "Amina Yusuf",
    date: "17-07-2024",
  },
  {
    id: 18,
    rating: 5,
    text: "The prom dress was a hit! The combination of Ankara with modern style made it stand out beautifully.",
    name: "Rebecca Olatunji",
    date: "16-07-2024",
  },
  {
    id: 19,
    rating: 4,
    text: "Very satisfied with my business suits. The tailoring is precise and the style is contemporary.",
    name: "Daniel Igwe",
    date: "15-07-2024",
  },
  {
    id: 20,
    rating: 5,
    text: "The ceremonial attire is magnificent! The embroidery work is detailed and the fit is perfect.",
    name: "Folake Adelaja",
    date: "14-07-2024",
  },
];

const Rating: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === RatingData.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? RatingData.length - 1 : prev - 1));
  };

  return (
    <div className="mb-10 w-full grid grid-cols-1 md:grid-cols-2 h-auto gap-4 md:gap-6 lg:gap-8">
      <div className="px-3 border border-gray-200 shadow w-full h-auto grid grid-cols-2">
        <div className="w-full h-full flex flex-col justify-center mb-2">
          <Star className="h-30 w-30 text-yellow-500" />
          <span className="text-gray-500 md:text-lg">
            120 Reviews and Ratings
          </span>
        </div>
        <div className="flex flex-col space-y-3 justify-evenly py-3">
          <div className="flex space-x-3 items-center ">
            <div className="w-fit flex space-x-2 items-center">
              <Star className="text-yellow-500 h-5 w-5" />
              <span className="text-gray-500 font-semibold md:text-lg">5:</span>
            </div>
            <meter className="w-full" min="0" max="120" value="80"></meter>
          </div>

          <div className="flex space-x-3 items-center">
            <div className="w-fit flex space-x-2 items-center">
              <Star className="text-yellow-500 h-5 w-5" />
              <span className="text-gray-500 font-semibold md:text-lg">4:</span>
            </div>
            <meter className="w-full" min="0" max="120" value="30"></meter>
          </div>

          <div className="flex space-x-3 items-center">
            <div className="w-fit flex space-x-2 items-center">
              <Star className="text-yellow-500 h-5 w-5" />
              <span className="text-gray-500 font-semibold md:text-lg">3:</span>
            </div>
            <meter className="w-full" min="0" max="120" value="5"></meter>
          </div>
          <div className="flex space-x-3 items-center">
            <div className="w-fit flex space-x-2 items-center">
              <Star className="text-yellow-500 h-5 w-5" />
              <span className="text-gray-500 font-semibold md:text-lg">2:</span>
            </div>
            <meter className="w-full" min="0" max="120" value="3"></meter>
          </div>
          <div className="flex space-x-3 items-center">
            <div className="w-fit flex space-x-2 items-center">
              <Star className="text-yellow-500 h-5 w-5" />
              <span className="text-gray-500 font-semibold md:text-lg">1:</span>
            </div>
            <meter className="w-full" min="0" max="120" value="2"></meter>
          </div>
        </div>
      </div>

      <div className="px-3 border border-gray-200 shadow w-full h-full relative">
        <div className="flex items-center justify-between absolute top-1/2 -translate-y-1/2 w-full px-2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full -ml-10 bg-yellow-500/20 hover:bg-yellow-500/30 transition-colors"
          >
            <ChevronLeft className="text-yellow-500" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 -mr-4 rounded-full bg-yellow-500/20 hover:bg-yellow-500/30 transition-colors"
          >
            <ChevronRight className="text-yellow-500" />
          </button>
        </div>

        <div className="py-6 px-4">
          {RatingData.map((review, index) => (
            <div
              key={review.id}
              className={`transition-opacity duration-300 ${
                index === currentIndex ? "block" : "hidden"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < review.rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                      fill={i < review.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-lg">{review.date}</span>
              </div>
              <p className="text-gray-500 md:text-lg mb-4">{review.text}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="font-bold text-lg">{review.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rating;
