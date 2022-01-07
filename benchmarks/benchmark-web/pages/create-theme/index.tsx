import Link from "next/link"
import React from "react"

export default function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/create-theme/chakra-ui">Chakra UI</Link>
        </li>
      </ul>
    </div>
  )
}
