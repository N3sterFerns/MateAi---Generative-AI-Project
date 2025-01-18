import { useState } from 'react'
import AppRoute from './router/AppRoute'
import { UserProvider } from './context/user.context'


function App() {
  return (
    <UserProvider>
      <AppRoute/>
    </UserProvider>
  )
}

export default App
