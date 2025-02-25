'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    content: "Setting up BBB used to take days. Now it's just a few clicks. This is a game-changer for our online courses.",
    author: "Sarah Johnson",
    role: "Director of E-Learning, Tech University",
    image: "/testimonials/sarah.jpg",
    logo: "/logos/tech-university.svg"
  },
  {
    content: "The auto-scaling feature is brilliant. We save money during quiet periods and never worry about capacity during peak times.",
    author: "Michael Chen",
    role: "IT Manager, Global Education Inc",
    image: "/testimonials/michael.jpg",
    logo: "/logos/global-education.svg"
  },
  {
    content: "The analytics help us understand how our virtual classrooms are being used. It's invaluable for improving our teaching methods.",
    author: "Emma Davis",
    role: "Head of Digital Learning, Future Academy",
    image: "/testimonials/emma.jpg",
    logo: "/logos/future-academy.svg"
  },
  {
    content: "We've reduced our IT overhead by 60% while improving the quality of our online classes. Our teachers and students love the reliability.",
    author: "James Wilson",
    role: "CTO, International School of Business",
    image: "/testimonials/james.jpg",
    logo: "/logos/isb.svg"
  }
]

export function Testimonials() {
  return (
    <div id="testimonials" className="relative bg-white py-24 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[50%] w-[50%] rounded-full bg-indigo-50 opacity-30 blur-3xl"></div>
      </div>
      
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 ring-1 ring-inset ring-indigo-600/20">
              Testimonials
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by educators worldwide
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Hear from our customers who have transformed their virtual learning experience with our platform.
            </p>
          </motion.div>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col justify-between rounded-2xl bg-white p-8 shadow-lg ring-1 ring-gray-200"
            >
              <div>
                <div className="flex items-center gap-x-4">
                  {testimonial.logo && (
                    <img src={testimonial.logo} alt={testimonial.author} className="h-8 w-auto" />
                  )}
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mt-8">
                  <div className="flex gap-0.5 text-indigo-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-4 text-lg font-medium leading-6 text-gray-900">
                    "{testimonial.content}"
                  </p>
                </div>
              </div>
              <div className="mt-8 flex items-center gap-x-4 border-t border-gray-900/10 pt-8">
                <img
                  src={testimonial.image}
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full bg-gray-100"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-32 rounded-2xl bg-indigo-600 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Trusted by thousands of educators
              </h2>
              <p className="mt-6 text-lg leading-8 text-indigo-100">
                Our platform powers virtual classrooms for universities, schools, and educational institutions worldwide.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-center sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
              {[
                { value: '500+', label: 'Educational institutions' },
                { value: '99.9%', label: 'Uptime guarantee' },
                { value: '50,000+', label: 'Virtual classrooms' },
                { value: '1M+', label: 'Students served' },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-y-3 rounded-xl bg-white/5 p-8 backdrop-blur-sm">
                  <dt className="text-sm leading-6 text-indigo-100">{stat.label}</dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-white">{stat.value}</dd>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 