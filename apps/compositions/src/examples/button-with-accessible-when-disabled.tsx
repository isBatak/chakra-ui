"use client"

import { Button } from "@chakra-ui/react"
import { useState } from "react"

export const ButtonWithAccessibleWhenDisabled = () => {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 4000))
    setLoading(false)
  }

  return (
    <Button
      loading={loading}
      loadingText="Submitting"
      accessibleWhenDisabled
      onClick={handleClick}
    >
      Submit
    </Button>
  )
}
