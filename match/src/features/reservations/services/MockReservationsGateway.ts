import { reservationsStore } from "@/src/features/reservations/services/MockReservationsStore";
import { MockReservationsScenarioStore } from "@/src/features/reservations/services/MockReservationsScenarioStore";
import type {
  DevReservationsApiScenario,
  ReservationsGateway,
} from "@/src/features/reservations/services/ReservationsGateway";
import { DEMO_RESERVATIONS_ORGANIZATION_ID } from "@/src/features/reservations/services/ReservationsGateway";

const wait = (duration: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, duration));

export class MockReservationsGateway implements ReservationsGateway {
  private activeOrganizationId = DEMO_RESERVATIONS_ORGANIZATION_ID;

  constructor(
    private readonly scenarioStore = new MockReservationsScenarioStore(),
  ) {}

  getDevScenario() {
    return this.scenarioStore.get();
  }

  async setDevScenario(scenario: DevReservationsApiScenario) {
    await reservationsStore.hydrate(this.activeOrganizationId);
    const currentState = await this.scenarioStore.getState();

    if (scenario === "empty") {
      if (currentState.scenario === "empty" && currentState.normalSnapshotBackup) {
        return;
      }
      const normalSnapshotBackup = {
        reservations: reservationsStore.getReservations(),
        blocks: reservationsStore.getBlocks(),
      };
      await this.scenarioStore.set("empty", normalSnapshotBackup);
      reservationsStore.replaceSnapshot({ reservations: [], blocks: [] });
      return;
    }

    if (currentState.scenario === "empty" && currentState.normalSnapshotBackup) {
      reservationsStore.replaceSnapshot(currentState.normalSnapshotBackup);
    }
    await this.scenarioStore.set(scenario);
  }

  async getSnapshot(organizationId: string) {
    this.activeOrganizationId = organizationId;
    const scenario = await this.prepareRequest();
    await reservationsStore.hydrate(organizationId);
    await this.ensureEmptyScenarioIsolated(scenario);
    return {
      reservations: reservationsStore.getReservations(),
      blocks: reservationsStore.getBlocks(),
      isHydrated: reservationsStore.isHydrated(),
    };
  }

  async createReservation(input: Parameters<ReservationsGateway["createReservation"]>[0], organizationId = this.activeOrganizationId) {
    await this.prepareMutation(organizationId);
    return reservationsStore.createReservation(input);
  }

  async completeRefund(reservationId: string, organizationId = this.activeOrganizationId) {
    await this.prepareMutation(organizationId);
    return reservationsStore.completeRefund(reservationId);
  }

  async confirmReservation(reservationId: string, organizationId = this.activeOrganizationId) {
    await this.prepareMutation(organizationId);
    return reservationsStore.confirmReservation(reservationId);
  }

  async cancelReservation(reservationId: string, organizationId = this.activeOrganizationId) {
    await this.prepareMutation(organizationId);
    return reservationsStore.cancelReservation(reservationId);
  }

  async createBlock(input: Parameters<ReservationsGateway["createBlock"]>[0], organizationId = this.activeOrganizationId) {
    await this.prepareMutation(organizationId);
    return reservationsStore.createBlock(input);
  }

  async deleteBlock(blockId: string, organizationId = this.activeOrganizationId) {
    await this.prepareMutation(organizationId);
    return reservationsStore.deleteBlock(blockId);
  }

  private async prepareMutation(organizationId: string) {
    this.activeOrganizationId = organizationId;
    const scenario = await this.prepareRequest();
    if (scenario === "conflict") {
      throw new Error("El horario acaba de ser ocupado. Actualiza la agenda e inténtalo nuevamente.");
    }
    await reservationsStore.hydrate(organizationId);
    await this.ensureEmptyScenarioIsolated(scenario);
  }

  private async prepareRequest() {
    const scenario = await this.scenarioStore.get();
    if (scenario === "slow") await wait(2_800);
    if (scenario === "offline") {
      throw new Error("No tienes conexión. Revisa tu red e inténtalo nuevamente.");
    }
    if (scenario === "server-error") {
      throw new Error("El servicio no está disponible en este momento.");
    }
    if (scenario === "unauthorized") {
      throw new Error("Tu sesión expiró. Ingresa nuevamente.");
    }
    return scenario;
  }

  private async ensureEmptyScenarioIsolated(
    scenario: DevReservationsApiScenario,
  ) {
    if (scenario !== "empty") return;
    const state = await this.scenarioStore.getState();
    if (state.normalSnapshotBackup) return;

    const normalSnapshotBackup = {
      reservations: reservationsStore.getReservations(),
      blocks: reservationsStore.getBlocks(),
    };
    await this.scenarioStore.set("empty", normalSnapshotBackup);
    reservationsStore.replaceSnapshot({ reservations: [], blocks: [] });
  }
}
