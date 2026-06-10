import { useCallback } from "react";
import {
  useClient,
  useDocumentOperation,
  type DocumentActionComponent,
} from "sanity";
import { useToast } from "@sanity/ui";
import { syncSiteSettingsNavPaths } from "../lib/nav-path-sync";

/** Document types whose slug should sync into Site Settings on publish. */
export const NAV_SYNC_PAGE_TYPES = new Set([
  "servicesPage",
  "pricingPage",
  "insurancePage",
  "newsPage",
  "aboutPage",
  "clinicsPage",
  "contactPage",
  "specialistsListingPage",
]);

/**
 * Replaces the default Publish action for CMS pages.
 * After publish, updates matching Site Settings menu paths from the page slug.
 */
export const PublishWithNavSync: DocumentActionComponent = (props) => {
  const { publish } = useDocumentOperation(props.id, props.type);
  const client = useClient({ apiVersion: "2024-01-01" });
  const toast = useToast();

  const onHandle = useCallback(async () => {
    await publish.execute();

    try {
      const publishedId = props.id.replace(/^drafts\./, "");
      const doc = await client.getDocument(publishedId);
      if (!doc) {
        props.onComplete();
        return;
      }

      const result = await syncSiteSettingsNavPaths(
        client,
        doc as Record<string, unknown>,
      );

      if (result.updated && result.path) {
        toast.push({
          status: "success",
          title: "Menylenker oppdatert",
          description: `Site Settings → ${result.navId}: ${result.path[0].value} / ${result.path[1].value}`,
        });
      }
    } catch (err) {
      console.error("[nav-path-sync]", err);
      toast.push({
        status: "warning",
        title: "Kunne ikke oppdatere menylenker",
        description: err instanceof Error ? err.message : "Ukjent feil",
      });
    }

    props.onComplete();
  }, [publish, client, props, toast]);

  return {
    label: "Publish",
    disabled: publish.disabled,
    tone: "positive",
    onHandle,
  };
};
