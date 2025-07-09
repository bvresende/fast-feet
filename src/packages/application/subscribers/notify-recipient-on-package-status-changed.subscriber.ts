import { DomainEvents } from '@/core/events/domain-events';
import { PackageStatusChangedEvent } from '@/@domain/packages/events/package-status-changed.event';

interface IEventHandler {
  setupSubscriptions(): void;
}

export class NotifyRecipientOnPackageStatusChangedSubscriber
  implements IEventHandler {
  constructor() {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewPackageStatusNotification.bind(this),
      PackageStatusChangedEvent.name,
    );
  }

  private async sendNewPackageStatusNotification({ packageInstance }: PackageStatusChangedEvent) {
    console.log(
      `Notificando destinatário da encomenda ${packageInstance.id.toString()}.`
    );
    console.log(`Novo status: ${packageInstance.status}`);
  }
}