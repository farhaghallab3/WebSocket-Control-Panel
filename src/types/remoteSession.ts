
export type RemoteSessionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "disconnecting"
  | "error";

export interface RemoteSession {
  status: RemoteSessionStatus;
  errorMessage: string | null;
}

export const initialRemoteSession: RemoteSession = {
  status: "disconnected",
  errorMessage: null,
};
