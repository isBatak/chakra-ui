import { SystemProps } from "@chakra-ui/styled-system"

export interface AvatarOptions {
  /**
   * The name of the person in the avatar.
   *
   * - if `src` has loaded, the name will be used as the `alt` attribute of the `img`
   * - If `src` is not loaded, the name will be used to create the initials
   */
  name?: string | undefined
  /**
   * If `true`, the `Avatar` will show a border around it.
   *
   * Best for a group of avatars
   *
   * @default false
   */
  showBorder?: boolean | undefined
  /**
   * The badge in the bottom right corner of the avatar.
   */
  children?: React.ReactNode | undefined
  /**
   * The image url of the `Avatar`
   */
  src?: string | undefined
  /**
   * List of sources to use for different screen resolutions
   */
  srcSet?: string | undefined
  /**
   * Defines loading strategy
   */
  loading?: "eager" | "lazy" | undefined
  /**
   * The border color of the avatar
   * @type SystemProps["borderColor"]
   */
  borderColor?: SystemProps["borderColor"] | undefined
  /**
   * Function called when image failed to load
   */
  onError?: () => void | undefined
  /**
   * The default avatar used as fallback when `name`, and `src`
   * is not specified.
   * @type React.ReactElement
   */
  icon?: React.ReactElement | undefined
  /**
   * Function to get the initials to display
   */
  getInitials?: (name: string) => string | undefined
  /**
   * Defining which referrer is sent when fetching the resource.
   * @type React.HTMLAttributeReferrerPolicy
   */
  referrerPolicy?: React.HTMLAttributeReferrerPolicy | undefined
}
