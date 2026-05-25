import type { Metadata } from "next";
import SubmitTipsForm from "./SubmitTipsForm";

export const metadata: Metadata = {
  title: "Send inn tips",
};

export default function TipsSubmitPage() {
  return <SubmitTipsForm />;
}
