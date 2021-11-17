import React from "react"
import Link from "next/link"

export default function Home() {
  return (
    <div>
      <ul>
        <li>
          <Link href="full-render-manual-test/styled-components">
            Styled components
          </Link>
        </li>
        <li>
          <Link href="full-render-manual-test/emotion">Emotion</Link>
        </li>
      </ul>
    </div>
  )
}
