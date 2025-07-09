import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityID } from '../entities/unique-entity-id';
import { IDomainEvent } from './domain-event.interface';

type EventCallback = (event: any) => void;

export class DomainEvents {
  private static handlersMap: Record<string, EventCallback[]> = {};
  private static markedAggregates: AggregateRoot<any>[] = [];

  public static markAggregateForDispatch(aggregate: AggregateRoot<any>) {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  public static dispatchEventsForAggregate(id: UniqueEntityID) {
    const aggregate = this.findMarkedAggregateByID(id);

    if (aggregate) {
      aggregate.domainEvents.forEach((event: IDomainEvent) =>
        this.dispatch(event),
      );

      aggregate.clearEvents();
      this.removeAggregateFromMarked(aggregate);
    }
  }

  public static register(callback: EventCallback, eventClassName: string) {
    if (!this.handlersMap[eventClassName]) {
      this.handlersMap[eventClassName] = [];
    }

    this.handlersMap[eventClassName].push(callback);
  }

  private static dispatch(event: IDomainEvent) {
    const eventClassName = event.constructor.name;

    if (this.handlersMap[eventClassName]) {
      this.handlersMap[eventClassName].forEach((handler) => handler(event));
    }
  }

  private static findMarkedAggregateByID(id: UniqueEntityID): AggregateRoot<any> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
  }

  private static removeAggregateFromMarked(aggregate: AggregateRoot<any>) {
    const index = this.markedAggregates.findIndex((a) => a.id.equals(aggregate.id));
    this.markedAggregates.splice(index, 1);
  }
}