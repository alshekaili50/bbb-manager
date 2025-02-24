import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <div className="mt-2 text-center text-sm text-gray-600">
            <p className="mb-4">
              We've sent you an email with a link to verify your account.
              Please check your inbox and click the link to continue.
            </p>
            <p>
              Didn't receive the email?{' '}
              <Link
                href="/auth/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Try signing up again
              </Link>
              {' '}or{' '}
              <Link
                href="/auth/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                go back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 