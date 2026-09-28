import FeedbackPreviewView from "@/src/features/profile/views/FeedbackPreviewView";
import { Redirect } from "expo-router";

export default function FeedbackPreviewRoute() {
  if (!__DEV__) return <Redirect href="/" />;
  return <FeedbackPreviewView />;
}
