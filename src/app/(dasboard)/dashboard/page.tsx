'use client'

import { signOut } from '@/lib/services/auth.service'
import { getUser, SupabaseUserData, User } from '@/lib/services/user.service'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { redirect } from 'next/navigation'

export default function PrivatePage() {
  const [user, setUser] = useState<SupabaseUserData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const response = await getUser()
      console.log(response)
      
      if ('error' in response) {
        setError(response.error)
        return
      }

      setUser(response)
    }
    fetchUser()
  }, [])

  async function handleLogout() {
    await signOut()
    redirect('/login')
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <p className='text-2xl font-bold text-red-500'>Erreur: {error}</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <p className='text-2xl font-bold text-black pt-22'>
        Bonjour {user?.user.user_metadata.name}
      </p>
      <Button variant='outline' onClick={handleLogout}>
        <p>Déconnexion</p>
      </Button>
    </div>
  ) 
}