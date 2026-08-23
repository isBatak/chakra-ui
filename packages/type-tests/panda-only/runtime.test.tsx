import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { EngineComponents } from "../engine-components"
import { PandaOnlyFixture } from "./runtime"

describe("Panda-only engine mode", () => {
  afterEach(cleanup)

  it("renders Button, ButtonGroup, and Dialog inside the explicit root boundary", () => {
    render(
      <PandaOnlyFixture>
        <EngineComponents prefix="panda" />
      </PandaOnlyFixture>,
    )

    expect(screen.getByTestId("panda-button")).toHaveClass(
      "panda-button",
      "user-panda-button",
    )
    expect(screen.getByTestId("panda-group")).toHaveClass(
      "panda-inline",
      "user-panda-group",
    )
    expect(screen.getByTestId("panda-grouped-button")).toHaveClass(
      "panda-button",
    )
    expect(screen.getByTestId("panda-dialog")).toHaveClass(
      "panda-dialog__content",
      "user-panda-dialog",
    )
  })
})
