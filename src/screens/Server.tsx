import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useForm, SubmitHandler } from 'react-hook-form'
import { system } from 'jellyfin-api'
import { motion } from 'motion/react'
import useClient from '../hooks/useClient'

type Inputs = {
  server: string
}

const Server = () => {
  const client = useClient()
  const navigate = useNavigate()

  useEffect(() => {
    if (import.meta.env.VITE_SERVER) {
      navigate('/signin')
    }
  }, [])

  const { register, handleSubmit } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setIsLoading(true)
    setError(null)

    const s = stripTrailingSlash(data.server)
    system.infoPublic(s).then(
      (res) => {
        setIsLoading(false)
        if (Object(res) !== res) {
          setIsLoading(false)
          setError('Could not connect to the server')
          return
        }
        if ('isAxiosError' in res && res.isAxiosError) {
          setIsLoading(false)
          setError('Could not connect to the server')
          return
        }
        if (!res.StartupWizardCompleted) {
          setIsLoading(false)
          setError('Server is not setup')
          return
        }
        if ('StartupWizardCompleted' in res && res.StartupWizardCompleted) {
          client.setName(res.ServerName)
          navigate('/signin/' + encodeURIComponent(s))
        } else {
          setError('Could not connect to the server')
        }
      },
      () => {
        setIsLoading(false)
        setError('Could not connect to the server')
      },
    )
  }

  const [server, setServer] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  return (
    <div className="bg-primary flex w-full items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-start gap-2 rounded-2xl bg-pink-800/40 p-4 text-white"
      >
        <div className="text-2xl font-medium">Select Server</div>
        <input
          {...register('server')}
          type="url"
          placeholder="https://"
          className="w-md rounded-2xl bg-white px-4 py-1.5 text-black"
        />
        {error && (
          <motion.div
            className="w-full rounded-2xl bg-red-700 px-4 py-1.5 font-medium text-white"
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
          >
            {error}
          </motion.div>
        )}
        <div className="flex w-full flex-row-reverse">
          <input
            type="submit"
            className="rounded-2xl bg-white px-4 py-1.5 font-medium text-black"
            value="Next"
          />
        </div>
      </form>
    </div>
  )
}

const stripTrailingSlash = (str: string) => {
  return str.endsWith('/') ? str.slice(0, -1) : str
}

export default Server
