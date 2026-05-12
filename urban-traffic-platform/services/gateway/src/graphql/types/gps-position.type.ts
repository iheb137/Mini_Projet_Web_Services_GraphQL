import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class GpsPositionType {
  @Field(() => ID)
  id: string;

  @Field()
  vehicleId: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field(() => Float, { nullable: true })
  speed?: number;

  @Field()
  timestamp: Date;
}
