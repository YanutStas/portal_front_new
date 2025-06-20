import { ConfigProvider, Timeline } from 'antd'
import React from 'react'

export default function StepsClaim({ steps }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize:20
        },
      }}>

      <div style={{
        // width: "min(500px, 100%)" 
      }}>
        <Timeline
          style={{ fontSize: 30 }}
          mode='right'
          items={steps}
        />
      </div>
    </ConfigProvider>
  )
}
