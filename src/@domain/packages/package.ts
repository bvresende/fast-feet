import { PackageStatus } from '@prisma/client';
import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Either, left, right } from '@/core/either';
import { CouriersAreNotTheSame, NotInTransit, NotWaitingPickup } from './package.errors';

export interface PackageProps {
  recipientId: UniqueEntityID;
  description: string;
  status: PackageStatus;
  courierId?: UniqueEntityID | null;
  photoUrl?: string | null;
  createdAt: Date;
  pickedUpAt?: Date | null;
  deliveredAt?: Date | null;
  returnedAt?: Date | null;
}

interface CreatePackageProps {
  recipientId: UniqueEntityID;
  description: string;
  status?: PackageStatus;
}

export class Package extends Entity<PackageProps> {
  get recipientId() { return this.props.recipientId; }
  get description() { return this.props.description; }
  get status() { return this.props.status; }
  get courierId() { return this.props.courierId; }
  get photoUrl() { return this.props.photoUrl; }
  get createdAt() { return this.props.createdAt; }
  get pickedUpAt() { return this.props.pickedUpAt; }
  get deliveredAt() { return this.props.deliveredAt; }
  get returnedAt() { return this.props.returnedAt; }

  public static create(
    props: CreatePackageProps,
    id?: UniqueEntityID,
  ) {
    const pkg = new Package(
      {
        ...props,
        status: props.status ?? PackageStatus.WAITING_FOR_PICKUP,
        createdAt: new Date(),
      },
      id,
    );

    return pkg;
  }

  public pickup(courierId: UniqueEntityID): Either<NotWaitingPickup, null> {
    if (this.props.status !== PackageStatus.WAITING_FOR_PICKUP) {
      return left(new NotWaitingPickup());
    }

    this.props.courierId = courierId;
    this.props.status = PackageStatus.IN_TRANSIT;
    this.props.pickedUpAt = new Date();

    return right(null);
  }

  public deliver(
    photoUrl: string,
    deliveredByCourierId: UniqueEntityID,
  ): Either<NotInTransit | CouriersAreNotTheSame, null> {
    if (this.props.status !== PackageStatus.IN_TRANSIT) {
      return left(new NotInTransit());
    }

    if (!this.props.courierId || !this.props.courierId.equals(deliveredByCourierId)) {
      return left(new CouriersAreNotTheSame());
    }

    this.props.status = PackageStatus.DELIVERED;
    this.props.photoUrl = photoUrl;
    this.props.deliveredAt = new Date();

    return right(null);
  }

  public return(): Either<NotInTransit, null> {
    if (this.props.status !== PackageStatus.IN_TRANSIT) {
      return left(new NotInTransit());
    }

    this.props.status = PackageStatus.RETURNED;
    this.props.courierId = null;
    this.props.returnedAt = new Date();

    return right(null);
  }
}