import type {
  DevReservationsApiScenario,
  ReservationsSnapshot,
} from "@/src/features/reservations/services/ReservationsGateway";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "match.mock-reservations.api-scenario";
const defaultScenario: DevReservationsApiScenario = "normal";
const validScenarios = new Set<DevReservationsApiScenario>([
  "normal",
  "slow",
  "offline",
  "server-error",
  "empty",
  "conflict",
  "unauthorized",
]);

export interface MockReservationsScenarioState {
  scenario: DevReservationsApiScenario;
  normalSnapshotBackup?: Pick<ReservationsSnapshot, "reservations" | "blocks">;
}

export class MockReservationsScenarioStore {
  async get(): Promise<DevReservationsApiScenario> {
    return (await this.getState()).scenario;
  }

  async getState(): Promise<MockReservationsScenarioState> {
    const storedState = await AsyncStorage.getItem(STORAGE_KEY);
    if (!storedState) return { scenario: defaultScenario };
    if (validScenarios.has(storedState as DevReservationsApiScenario)) {
      return { scenario: storedState as DevReservationsApiScenario };
    }
    try {
      const parsedState = JSON.parse(storedState) as MockReservationsScenarioState;
      return validScenarios.has(parsedState.scenario)
        ? parsedState
        : { scenario: defaultScenario };
    } catch {
      return { scenario: defaultScenario };
    }
  }

  async set(
    scenario: DevReservationsApiScenario,
    normalSnapshotBackup?: MockReservationsScenarioState["normalSnapshotBackup"],
  ) {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ scenario, normalSnapshotBackup }),
    );
  }
}
