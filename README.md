# React + Vite

```sh
yarn create vite
cd ???
yarn
yarn dev
yarn add axios react-router-dom react-query
yarn add dayjs lodash
yarn add @mantine/core @mantine/hooks @mantine/form @mantine/dates @tabler/icons-react @mantine/modals @mantine/notifications @mantinex/dev-icons
yarn add --dev postcss postcss-preset-mantine postcss-simple-vars
```

postcss.config.cjs
```js

module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};
```

main.jsx
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createTheme, MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './App.jsx'
import '@mantine/core/styles.css';

const theme = createTheme({
  /** Put your mantine theme override here */
  primaryColor: 'orange'
});

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </MantineProvider>,
)
```

https://github.com/jlguenego/react-sso-example
https://github.com/jlguenego/node-expose-sspi
https://www.feathery.io/blog/github-oauth
https://medium.com/@princewilliroka/how-to-implement-login-with-github-in-a-react-app-bd3d704c64fc
https://blog.logrocket.com/adding-login-authentication-secure-react-apps/

https://developers.sap.com/tutorials/btp-cf-buildpacks-node-create.html
https://github.com/nguyenhieptech/react-query-example/blob/main/src/api/users/use-edit-user.ts
https://www.smashingmagazine.com/2022/01/building-real-app-react-query/