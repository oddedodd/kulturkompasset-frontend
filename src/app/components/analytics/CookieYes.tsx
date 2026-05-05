import Script from "next/script";

export default function CookieYes() {
  return (
    <Script
      id="cookieyes"
      type="text/javascript"
      src="https://cdn-cookieyes.com/client_data/fb9221dd06fefcaf365d845172a864cd/script.js"
      strategy="beforeInteractive"
    />
  );
}
