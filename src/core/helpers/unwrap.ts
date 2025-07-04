import { Either } from '../either'

export function unwrap<L extends Error, R>(
  either: Either<L, R>
): R {
  if (either.isLeft()) {
    throw either.value
  }

  return either.value
}

