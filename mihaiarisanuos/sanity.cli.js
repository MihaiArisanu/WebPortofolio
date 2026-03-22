import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '1x612z6j',
    dataset: 'production'
  },
  deployment: {
    autoUpdates: true,
  }
})
