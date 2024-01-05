import React from 'react'
import ReactDOM from 'react-dom/client'
import { createTheme, MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './App.jsx'
import '@mantine/core/styles.css';

const theme = createTheme({
  /** Put your mantine theme override here */
  primaryColor: 'yellow'
});

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </MantineProvider>,
)
