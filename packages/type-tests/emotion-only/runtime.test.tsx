import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { EngineComponents } from "../dual-engine/engine-components"
import { EmotionOnlyFixture } from "./runtime"

describe("Emotion-only engine mode", () => {
  afterEach(cleanup)

  it("renders Button, ButtonGroup, and Dialog inside the explicit root boundary", () => {
    render(
      <EmotionOnlyFixture>
        <EngineComponents prefix="emotion" />
      </EmotionOnlyFixture>,
    )

    expect(screen.getByTestId("emotion-button")).toHaveClass(
      "user-emotion-button",
    )
    expect(
      screen.getByTestId("emotion-button").classList.length,
    ).toBeGreaterThan(1)
    expect(screen.getByTestId("emotion-group")).toHaveClass(
      "user-emotion-group",
    )
    expect(
      screen.getByTestId("emotion-grouped-button").classList.length,
    ).toBeGreaterThan(0)
    expect(screen.getByTestId("emotion-dialog")).toHaveClass(
      "user-emotion-dialog",
    )
    expect(
      screen.getByTestId("emotion-dialog").classList.length,
    ).toBeGreaterThan(1)
  })
})
