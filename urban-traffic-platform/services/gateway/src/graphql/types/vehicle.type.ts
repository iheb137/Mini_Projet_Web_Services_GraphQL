import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class VehicleType {
  @Field(() => ID)
  id: string;

  @Field()
  plate: string;

  @Field()
  type: string;

  @Field()
  brand: string;

  @Field()
  model: string;

  @Field()
  isActive: boolean;

  @Field()
  ownerId: string;
}
