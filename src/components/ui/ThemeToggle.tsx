'use client'

import { useTheme } from './ThemeProvider'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50">
        {theme === 'light' ? (
          <SunIcon className="h-5 w-5" />
        ) : theme === 'dark' ? (
          <MoonIcon className="h-5 w-5" />
        ) : (
          <ComputerDesktopIcon className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-950 dark:ring-gray-800">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active || theme === 'light'
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                      : 'text-gray-700 dark:text-gray-400'
                  } flex w-full items-center px-4 py-2 text-sm`}
                  onClick={() => setTheme('light')}
                >
                  <SunIcon className="mr-2 h-4 w-4" />
                  Light
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active || theme === 'dark'
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                      : 'text-gray-700 dark:text-gray-400'
                  } flex w-full items-center px-4 py-2 text-sm`}
                  onClick={() => setTheme('dark')}
                >
                  <MoonIcon className="mr-2 h-4 w-4" />
                  Dark
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active || theme === 'system'
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50'
                      : 'text-gray-700 dark:text-gray-400'
                  } flex w-full items-center px-4 py-2 text-sm`}
                  onClick={() => setTheme('system')}
                >
                  <ComputerDesktopIcon className="mr-2 h-4 w-4" />
                  System
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
} 