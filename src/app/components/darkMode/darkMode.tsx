"use client"

import { Button } from "@chakra-ui/react"
import { useColorMode } from "@/components/chakraComponets/ui/color-mode"

export default function DarkMode() {
  
    const { toggleColorMode } = useColorMode()
    return (
      <Button variant="outline" onClick={toggleColorMode}>
        Toggle Mode
      </Button>
    )
  }
