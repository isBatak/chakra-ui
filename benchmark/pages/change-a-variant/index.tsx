import Link from "next/link"
import React from "react"

export default function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/change-a-variant/chakra-ui">Chakra UI</Link>
        </li>
        <li>
          <Link href="/change-a-variant/emotion">Emotion</Link>
        </li>
      </ul>
    </div>
  )
}
