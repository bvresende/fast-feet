import { DomainError } from '../shared/errors/domain-error';

export class NotWaitingPickup extends DomainError {
  constructor() {
    super('The package is not waiting to be picked up')
  }
}

export class NotInTransit extends DomainError {
  constructor() {
    super('The package is not in transit')
  }
}

export class CouriersAreNotTheSame extends DomainError {
  constructor() {
    super('The courier who delivered the package is not the same as the one who picked it up')
  }
}