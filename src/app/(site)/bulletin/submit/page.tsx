import type { Metadata } from "next";
import SubmitBulletinForm from "./SubmitBulletinForm";

export const metadata: Metadata = {
  title: "Send inn arrangement",
};

export default function BulletinSubmitPage() {
  return <SubmitBulletinForm />;
}
