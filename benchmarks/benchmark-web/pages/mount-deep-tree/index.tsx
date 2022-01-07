import Link from "next/link"
import React from "react"

export default function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/mount-deep-tree/chakra-ui">Chakra-UI</Link>
        </li>
        <li>
          <Link href="/mount-deep-tree/emotion">Emotion</Link>
        </li>
      </ul>
    </div>
  )
}
