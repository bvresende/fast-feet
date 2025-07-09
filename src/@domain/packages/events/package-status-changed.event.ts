import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { IDomainEvent } from '@/core/events/domain-event.interface';
import { Package } from '../package';

export class PackageStatusChangedEvent implements IDomainEvent {
  public occurredAt: Date;
  public packageInstance: Package;

  constructor(packageInstance: Package) {
    this.occurredAt = new Date();
    this.packageInstance = packageInstance;
  }

  public getAggregateId(): UniqueEntityID {
    return this.packageInstance.id;
  }
}