import defaultMdxComponents from "fumadocs-ui/mdx";
import type * as MDXTypes from "mdx/types";
import { MediaPlaceholder } from "@/components/MediaPlaceholder";

export function getMDXComponents(
  components?: MDXTypes.MDXComponents,
): MDXTypes.MDXComponents {
  return {
    ...defaultMdxComponents,
    MediaPlaceholder,
    ...components,
  };
}
