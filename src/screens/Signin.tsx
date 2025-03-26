import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { AxiosError } from 'axios'
import { UAParser } from 'ua-parser-js'
import { motion } from 'motion/react'
import useClient from '../hooks/useClient'
import { users } from 'jellyfin-api'

type Inputs = {
  username: string
  password: string
}

const Signin = () => {
  const client = useClient()
  const { server: serverParam } = useParams()
  const navigate = useNavigate()
  const { browser } = UAParser(window.navigator.userAgent)

  const server =
    (import.meta.env.VITE_SERVER ?? client.server ?? serverParam)
      ? decodeURIComponent(serverParam!)
      : null

  useEffect(() => {
    if (!server) navigate('/server')
  }, [])

  const { register, handleSubmit } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setIsLoading(true)
    setError(null)

    const clientName = 'Kotone Web'
    const deviceName = browser.name ?? 'Unknown'
    const deviceID = 'kotone-web_'
    const clientVer = '1.0.0'

    users
      .authenticateByName(
        server!,
        data.username,
        data.password,
        clientName,
        deviceName,
        deviceID,
        clientVer,
      )
      .then(
        (res) => {
          setIsLoading(false)
          if (Object(res) !== res) {
            setIsLoading(false)
            setError('Unknown error')
            return
          }
          if ('isAxiosError' in res && res.isAxiosError) {
            setIsLoading(false)
            setError('Unknown error')
            return
          }

          client.setClient({
            server: server!,
            clientName: clientName,
            deviceName: deviceName,
            deviceID: deviceID,
            version: clientVer,
            user: res.User.Id,
            token: res.AccessToken,
          })
        },
        (error: AxiosError) => {
          setIsLoading(false)
          console.log(error.message)
          console.log(error.code)
          if (error.code === 'ERR_BAD_REQUEST')
            setError('Incorrect username and/or password')
          if (error.code === 'ERR_NETWORK')
            setError('Could not connect to the server')
        },
      )
  }

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  return (
    <div className="flex w-full items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-w round flex flex-col items-start gap-2 bg-pink-800/40 p-4"
      >
        <div className="text-2xl font-medium">
          {'Sign in' + (client.name ? ' to ' + client.name : '')}
        </div>
        <input
          {...register('username')}
          type="text"
          placeholder="Username"
          autoComplete="username"
          className="bg-w text-b round w-md px-4 py-1.5"
        />
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          autoComplete="current-password"
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
        <div className="flex w-full flex-row-reverse gap-2">
          <input
            type="submit"
            className="bg-w text-b round px-4 py-1.5 font-medium"
            value="Sign in"
          />
          {!import.meta.env.VITE_SERVER && (
            <input
              type="button"
              className="bg-w text-b round px-4 py-1.5 font-medium"
              value="Back"
              onClick={() => {
                navigate('/server')
              }}
            />
          )}
        </div>
      </form>
    </div>
  )
}

export default Signin
