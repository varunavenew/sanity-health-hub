import {useCallback} from "react";
import {useClient, type DocumentActionComponent} from "sanity";
import {copyPublishedOgImageAltToDraft} from "../lib/preserve-og-image-alt";

/**
 * Wrap Publish so a draft missing `seo.ogImageAlt` copies it from the
 * published document first. Prevents publishing from deleting the field.
 */
export function createPublishPreservingOgImageAlt(
  OriginalPublish: DocumentActionComponent,
): DocumentActionComponent {
  const PublishPreservingOgImageAlt: DocumentActionComponent = (props) => {
    const original = OriginalPublish(props);
    const client = useClient({apiVersion: "2024-01-01"}).withConfig({
      useCdn: false,
    });

    const onHandle = useCallback(async () => {
      try {
        await copyPublishedOgImageAltToDraft(
          client,
          props.id,
          props.draft as {_id?: string; seo?: unknown} | null,
          props.published as {seo?: unknown} | null,
        );
      } catch (err) {
        console.error("[preserve-og-image-alt]", err);
      }
      await original.onHandle?.();
    }, [client, original, props.draft, props.id, props.published]);

    return {
      ...original,
      onHandle,
    };
  };
  PublishPreservingOgImageAlt.action = "publish";
  return PublishPreservingOgImageAlt;
}
