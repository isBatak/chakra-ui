import Link from "next/link"
import React from "react"

export default function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/sierpinski-triangle/chakra-ui">Chakra UI</Link>
        </li>
        <li>
          <Link href="/sierpinski-triangle/emotion">Emotion</Link>
        </li>
      </ul>
    </div>
  )
}
