import React from 'react'
import ReactDOM from 'react-dom/client'
import { createTheme, MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './App.jsx'
import '@mantine/core/styles.css';
import { ModalsProvider } from '@mantine/modals'

const theme = createTheme({
  /** Put your mantine theme override here */
  primaryColor: 'yellow'
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 3 * 1000
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <MantineProvider theme={theme}>
    <ModalsProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
      </ModalsProvider>
    </MantineProvider>,
)
