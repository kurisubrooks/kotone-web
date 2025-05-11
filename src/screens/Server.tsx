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
        className="text-w round flex flex-col items-start gap-2 bg-pink-800/40 p-4"
      >
        <div className="text-2xl font-medium">Select Server</div>
        <input
          {...register('server')}
          type="url"
          placeholder="https://"
          className="bg-w text-b round w-md px-4 py-1.5"
        />
        {error && (
          <motion.div
            className="text-w round w-full bg-red-700 px-4 py-1.5 font-medium"
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
            className="bg-w text-b round px-4 py-1.5 font-medium"
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
