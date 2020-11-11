import { useState, useEffect } from 'react'

const useTriggerProcessing = (props: { serialNumber: string; table: string }) => {
  const { serialNumber, table } = props
  const [isProcessing, setIsProcessing] = useState(true)

  return isProcessing
}
export default useTriggerProcessing
