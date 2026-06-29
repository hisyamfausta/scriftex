import { serve } from '@hono/node-server'
import { createApp } from './di/container.js'

serve({ fetch: createApp().fetch, port: 3001 }, (info) => {
  console.log(`Backend running on :${info.port}`)
})
