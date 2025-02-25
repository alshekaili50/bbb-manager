'use client';

export default function ApiKeysPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-xl font-bold leading-7 text-gray-900">API Keys</h2>
        <p className="mt-1 text-sm text-gray-500">
          Manage API keys for accessing BBB Manager programmatically
        </p>
      </div>

      {/* API Keys */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Your API Keys
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              API keys allow you to authenticate API requests to the BBB Manager API.
              Keep your API keys secure and never share them publicly.
            </p>
          </div>

          <div className="mt-5 border-t border-gray-200 pt-5">
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">API Access Is Premium</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      API access is only available for Enterprise subscribers. 
                      Please upgrade your plan to access this feature.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm text-gray-500 italic">
              API key management functionality coming soon for Enterprise subscribers
            </p>
          </div>
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            API Documentation
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Learn how to use the BBB Manager API to create and manage meetings, instances,
              and other resources programmatically.
            </p>
          </div>
          
          <div className="mt-5">
            <a
              href="/docs/api"
              className="text-indigo-600 hover:text-indigo-900 font-medium"
            >
              View API Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 