import { HttpAuthGateway } from "./HttpAuthGateway";
import { MockAuthGateway } from "./MockAuthGateway";

const apiUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

if (!apiUrl && !__DEV__) {
  throw new Error("EXPO_PUBLIC_API_URL es obligatorio fuera de desarrollo.");
}

export const authGateway = apiUrl
  ? new HttpAuthGateway(apiUrl)
  : new MockAuthGateway();
