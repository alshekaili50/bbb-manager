'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    content: "Setting up BBB used to take days. Now it's just a few clicks. This is a game-changer for our online courses.",
    author: "Sarah Johnson",
    role: "Director of E-Learning, Tech University",
    image: "/testimonials/sarah.jpg"
  },
  {
    content: "The auto-scaling feature is brilliant. We save money during quiet periods and never worry about capacity during peak times.",
    author: "Michael Chen",
    role: "IT Manager, Global Education Inc",
    image: "/testimonials/michael.jpg"
  },
  {
    content: "The analytics help us understand how our virtual classrooms are being used. It's invaluable for improving our teaching methods.",
    author: "Emma Davis",
    role: "Head of Digital Learning, Future Academy",
    image: "/testimonials/emma.jpg"
  }
]

export function Testimonials() {
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by educators worldwide
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl bg-white p-8 shadow-lg"
              >
                <img
                  className="h-12 w-12 rounded-full"
                  src={testimonial.image}
                  alt={testimonial.author}
                />
                <figure className="mt-10">
                  <blockquote className="text-lg font-semibold leading-8 tracking-tight text-gray-900">
                    <p>"{testimonial.content}"</p>
                  </blockquote>
                  <figcaption className="mt-10 flex items-center gap-x-6">
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.author}</div>
                      <div className="text-gray-600">{testimonial.role}</div>
                    </div>
                  </figcaption>
                </figure>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 