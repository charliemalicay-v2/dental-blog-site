/**
 * JSON-LD injection for structured data. Serialized as text so no untrusted
 * markup can be injected into the script body.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD is exempt from React's HTML escaping requirements by spec.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
