import { Resend } from "resend";

type SubmissionKind = "bulletin" | "tips";

type Field = {
  label: string;
  value?: string;
  href?: string;
};

type BaseNotification = {
  kind: SubmissionKind;
  documentId: string;
  title: string;
  description: string;
  image?: {
    fileName?: string;
    contentType?: string;
    size?: number;
    url?: string;
  };
};

type BulletinNotification = BaseNotification & {
  kind: "bulletin";
  date: string;
  organizer: string;
  place: string;
  contact: string;
  price?: string;
};

type TipsNotification = BaseNotification & {
  kind: "tips";
  date?: string;
  place?: string;
  price?: string;
  ticketUrl?: string;
  submitterName: string;
  submitterPhone: string;
  submitterEmail: string;
};

export type SubmissionNotification = BulletinNotification | TipsNotification;

const DEFAULT_FROM = "KulturNamdal <innsending@kulturnamdal.no>";

function parseRecipients(value: string | undefined): string[] {
  return (value ?? "")
    .split(/[,\n;]/)
    .map((recipient) => recipient.trim())
    .filter(Boolean);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateTime(value: string | undefined): string | undefined {
  if (!value) return undefined;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("nb-NO", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Oslo",
  }).format(date);
}

function formatBytes(value: number | undefined): string | undefined {
  if (value === undefined) return undefined;
  if (!Number.isFinite(value)) return undefined;

  const megabytes = value / (1024 * 1024);
  return `${megabytes.toFixed(2)} MB`;
}

function buildImageFields(notification: SubmissionNotification): Field[] {
  const image = notification.image;
  if (!image) return [];

  return [
    { label: "Bildefil", value: image.fileName },
    { label: "Bildetype", value: image.contentType },
    { label: "Bildestørrelse", value: formatBytes(image.size) },
    { label: "Bilde/asset", value: image.url, href: image.url },
  ];
}

function buildFields(notification: SubmissionNotification): Field[] {
  if (notification.kind === "bulletin") {
    return [
      { label: "Tittel", value: notification.title },
      { label: "Dato og tid", value: formatDateTime(notification.date) },
      { label: "Arrangør", value: notification.organizer },
      { label: "Sted", value: notification.place },
      { label: "Kontakt", value: notification.contact },
      { label: "Pris", value: notification.price },
      { label: "Sanity-ID", value: notification.documentId },
      ...buildImageFields(notification),
    ];
  }

  return [
    { label: "Navn på tips", value: notification.title },
    { label: "Dato og tid", value: formatDateTime(notification.date) },
    { label: "Sted", value: notification.place },
    { label: "Pris", value: notification.price },
    { label: "Billettlenke", value: notification.ticketUrl, href: notification.ticketUrl },
    { label: "Innsender", value: notification.submitterName },
    { label: "Telefon", value: notification.submitterPhone },
    {
      label: "Epost",
      value: notification.submitterEmail,
      href: `mailto:${notification.submitterEmail}`,
    },
    { label: "Sanity-ID", value: notification.documentId },
    ...buildImageFields(notification),
  ];
}

function getSubject(notification: SubmissionNotification): string {
  if (notification.kind === "bulletin") {
    return `Ny bulletin sendt inn: ${notification.title}`;
  }

  return `Nytt tips sendt inn: ${notification.title}`;
}

function getPreheader(notification: SubmissionNotification): string {
  if (notification.kind === "bulletin") {
    return `Arrangement fra ${notification.organizer}, ${notification.place}`;
  }

  return `Sendt inn av ${notification.submitterName}`;
}

function renderRows(fields: Field[]): string {
  return fields
    .filter((field) => field.value)
    .map((field) => {
      const value = escapeHtml(field.value ?? "");
      const content = field.href
        ? `<a href="${escapeHtml(field.href)}" style="color:#0f766e;text-decoration:underline;">${value}</a>`
        : value;

      return `
        <tr>
          <th style="padding:10px 12px;text-align:left;vertical-align:top;width:150px;color:#475569;font-weight:600;border-bottom:1px solid #e2e8f0;">${escapeHtml(field.label)}</th>
          <td style="padding:10px 12px;vertical-align:top;color:#0f172a;border-bottom:1px solid #e2e8f0;">${content}</td>
        </tr>
      `;
    })
    .join("");
}

function renderHtml(notification: SubmissionNotification): string {
  const title =
    notification.kind === "bulletin" ? "Ny bulletin sendt inn" : "Nytt tips sendt inn";
  const fields = buildFields(notification);
  const preheader = getPreheader(notification);

  return `<!doctype html>
<html lang="no">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;background:#f8fafc;font-family:Arial,sans-serif;color:#0f172a;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
    <main style="max-width:680px;margin:0 auto;padding:28px 16px;">
      <section style="background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
        <header style="padding:22px 24px;background:#0f172a;color:#ffffff;">
          <p style="margin:0 0 6px;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:#bae6fd;">KulturNamdal</p>
          <h1 style="margin:0;font-size:24px;line-height:1.25;">${escapeHtml(title)}</h1>
          <p style="margin:10px 0 0;color:#dbeafe;">${escapeHtml(notification.title)}</p>
        </header>
        <div style="padding:22px 24px;">
          <table role="presentation" style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.45;">
            <tbody>
              ${renderRows(fields)}
            </tbody>
          </table>
          <h2 style="margin:24px 0 10px;font-size:17px;line-height:1.3;color:#0f172a;">Beskrivelse</h2>
          <p style="margin:0;white-space:pre-wrap;font-size:15px;line-height:1.6;color:#1e293b;">${escapeHtml(notification.description)}</p>
        </div>
      </section>
    </main>
  </body>
</html>`;
}

function renderText(notification: SubmissionNotification): string {
  const title =
    notification.kind === "bulletin" ? "Ny bulletin sendt inn" : "Nytt tips sendt inn";
  const fields = buildFields(notification)
    .filter((field) => field.value)
    .map((field) => `${field.label}: ${field.value}`)
    .join("\n");

  return `${title}
${notification.title}

${fields}

Beskrivelse:
${notification.description}`;
}

export async function sendSubmissionNotification(
  notification: SubmissionNotification,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipients = parseRecipients(process.env.SUBMISSION_NOTIFICATION_EMAILS);
  const from = process.env.RESEND_FROM || DEFAULT_FROM;

  if (!apiKey) {
    console.warn("[submission-notifications] Missing RESEND_API_KEY");
    return;
  }

  if (recipients.length === 0) {
    console.warn("[submission-notifications] Missing SUBMISSION_NOTIFICATION_EMAILS");
    return;
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to: recipients,
      subject: getSubject(notification),
      html: renderHtml(notification),
      text: renderText(notification),
    });

    if (result.error) {
      console.error("[submission-notifications] Resend failed", {
        kind: notification.kind,
        documentId: notification.documentId,
        error: result.error.message,
      });
    }
  } catch (error) {
    console.error("[submission-notifications] Failed to send notification", {
      kind: notification.kind,
      documentId: notification.documentId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
