import React from "react"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/create-and-mount-button/chakra-ui">Chakra UI</Link>
        </li>
        <li>
          <Link href="/create-and-mount-button/emotion">Emotion</Link>
        </li>
      </ul>
    </div>
  )
}
