import { StylingEngineProvider } from "@chakra-ui/react/styling-engine"
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { EngineComponents, EngineProbe } from "../engine-components"
import { DualEngineFixture, emotionAdapter, pandaAdapter } from "./runtime"

describe("dual-engine mode", () => {
  afterEach(cleanup)

  it("uses the nearest explicit boundary and supports a nested switch-back", () => {
    render(
      <DualEngineFixture>
        <EngineProbe testId="root-engine" />
        <EngineComponents prefix="root" />
        <StylingEngineProvider value={emotionAdapter}>
          <EngineProbe testId="subtree-engine" />
          <EngineComponents prefix="subtree" />
          <StylingEngineProvider value={pandaAdapter}>
            <EngineProbe testId="nested-engine" />
            <EngineComponents prefix="nested" />
          </StylingEngineProvider>
        </StylingEngineProvider>
      </DualEngineFixture>,
    )

    expect(screen.getByTestId("root-engine")).toHaveTextContent("panda")
    expect(screen.getByTestId("subtree-engine")).toHaveTextContent("emotion")
    expect(screen.getByTestId("nested-engine")).toHaveTextContent("panda")

    for (const prefix of ["root", "subtree", "nested"]) {
      expect(screen.getByTestId(`${prefix}-button`)).toHaveClass(
        `user-${prefix}-button`,
      )
      expect(screen.getByTestId(`${prefix}-group`)).toHaveClass(
        `user-${prefix}-group`,
      )
      expect(
        screen.getByTestId(`${prefix}-grouped-button`).classList.length,
      ).toBeGreaterThan(0)
      expect(screen.getByTestId(`${prefix}-dialog`)).toHaveClass(
        `user-${prefix}-dialog`,
      )
      expect(
        screen.getByTestId(`${prefix}-button`).classList.length,
      ).toBeGreaterThan(1)
      expect(
        screen.getByTestId(`${prefix}-dialog`).classList.length,
      ).toBeGreaterThan(1)
    }
  })
})
