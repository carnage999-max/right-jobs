'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-600 shadow-sm">
        <AlertCircle className="h-10 w-10" />
      </div>
      
      <h1 className="mb-2 text-3xl font-black tracking-tight text-slate-900">
        Something went wrong
      </h1>
      
      <p className="mb-8 max-w-md text-slate-500 font-medium">
        We encountered an unexpected error while processing your request. 
        Our technical team has been notified.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
        <Button 
          onClick={() => reset()}
          className="ios-button h-12 flex-1 gap-2"
        >
          <RefreshCcw className="h-4 w-4" /> Try again
        </Button>
        
        <Button 
          variant="outline" 
          asChild
          className="ios-button h-12 flex-1 gap-2"
        >
          <Link href="/">
            <Home className="h-4 w-4" /> Home
          </Link>
        </Button>
      </div>

      <p className="mt-12 text-xs font-mono text-slate-300">
        Error ID: {error.digest || 'no-digest-available'}
      </p>
    </div>
  )
}
