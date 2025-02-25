'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-indigo-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <motion.div 
          className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <span className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium text-indigo-600 ring-1 ring-inset ring-indigo-600/20">
              New: Automated Scaling
              <svg viewBox="0 0 2 2" className="mx-2 h-0.5 w-0.5 fill-current" aria-hidden="true">
                <circle cx="1" cy="1" r="1" />
              </svg>
              Save up to 70% on costs
            </span>
          </div>
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Deploy BigBlueButton in minutes, not days
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Launch your virtual classroom platform with enterprise-grade reliability. 
            Automatic scaling, monitoring, and zero maintenance required.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href="/auth/signup"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
            <Link href="#pricing" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">
              View pricing <span aria-hidden="true">→</span>
            </Link>
          </div>
          
          {/* Trust badges */}
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-x-8 gap-y-4">
            <p className="text-sm font-semibold leading-6 text-gray-900">Trusted by educators worldwide</p>
            <div className="flex gap-x-6 grayscale opacity-70">
              <img className="h-8 w-auto" src="/logos/harvard.svg" alt="Harvard" />
              <img className="h-8 w-auto" src="/logos/stanford.svg" alt="Stanford" />
              <img className="h-8 w-auto" src="/logos/mit.svg" alt="MIT" />
            </div>
          </div>
        </motion.div>
        
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
          <motion.div 
            className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <img
                src="/hero-image.jpg"
                alt="BBB Dashboard"
                className="w-[76rem] rounded-xl bg-white/5 shadow-2xl ring-1 ring-white/10"
              />
              <div className="absolute -bottom-8 -left-8 rounded-xl bg-indigo-600 p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-white">
                    <p className="text-sm font-semibold">99.9% Uptime</p>
                    <p className="text-xs">Enterprise reliability</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-8 -right-8 rounded-xl bg-white p-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-gray-900">
                    <p className="text-sm font-semibold">Deploy in 5 minutes</p>
                    <p className="text-xs">No technical expertise needed</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-indigo-300 to-indigo-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  )
} 