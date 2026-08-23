import {
  Button,
  ButtonGroup,
  DialogBody,
  DialogContent,
  DialogRoot,
  DialogTitle,
} from "@chakra-ui/react"
import { useStylingEngine } from "@chakra-ui/react/styling-engine"

export function EngineProbe(props: { testId: string }) {
  const engine = useStylingEngine().token("engine", "emotion")
  return <output data-testid={props.testId}>{engine}</output>
}

export function EngineComponents(props: { prefix: string }) {
  return (
    <>
      <Button
        className={`user-${props.prefix}-button`}
        data-testid={`${props.prefix}-button`}
      >
        Button
      </Button>
      <ButtonGroup
        className={`user-${props.prefix}-group`}
        data-testid={`${props.prefix}-group`}
      >
        <Button data-testid={`${props.prefix}-grouped-button`}>
          Grouped button
        </Button>
      </ButtonGroup>
      <DialogRoot defaultOpen>
        <DialogContent
          aria-label={`${props.prefix} dialog`}
          className={`user-${props.prefix}-dialog`}
          data-testid={`${props.prefix}-dialog`}
        >
          <DialogTitle>Dialog</DialogTitle>
          <DialogBody>Body</DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  )
}
