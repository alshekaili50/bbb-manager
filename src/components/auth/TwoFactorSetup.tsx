'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { QRCodeSVG } from 'qrcode.react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const totpSchema = z.object({
  token: z.string().min(6, 'Token must be 6 digits').max(6, 'Token must be 6 digits'),
})

type TotpFormData = z.infer<typeof totpSchema>

export function TwoFactorSetup() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [factorId, setFactorId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TotpFormData>({
    resolver: zodResolver(totpSchema),
  })

  const generateQrCode = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      })

      if (error) {
        throw error
      }

      if (data?.totp?.qr_code && data.totp.secret && data.id) {
        setQrCode(data.totp.qr_code)
        setSecret(data.totp.secret)
        setFactorId(data.id)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate QR code')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyTotp = async (data: TotpFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      if (!factorId) {
        throw new Error('Factor ID not found')
      }

      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      })

      if (challengeError) {
        throw challengeError
      }

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: data.token,
      })

      if (verifyError) {
        throw verifyError
      }

      setSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to verify token')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-md bg-green-50 p-4">
        <p className="text-sm text-green-700">
          Two-factor authentication has been successfully enabled.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!qrCode ? (
        <button
          onClick={generateQrCode}
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Set up two-factor authentication'}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <QRCodeSVG value={qrCode} size={200} />
            {secret && (
              <div className="text-sm text-gray-500">
                <p>If you can't scan the QR code, use this secret key:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">{secret}</code>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(verifyTotp)} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                Enter verification code
              </label>
              <input
                {...register('token')}
                type="text"
                id="token"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="000000"
              />
              {errors.token && (
                <p className="mt-1 text-sm text-red-600">{errors.token.message}</p>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify and enable 2FA'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
} 