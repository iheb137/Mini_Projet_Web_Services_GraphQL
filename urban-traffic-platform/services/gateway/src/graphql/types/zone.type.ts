import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class ZoneType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => Float)
  centerLat: number;

  @Field(() => Float)
  centerLng: number;

  @Field(() => Float)
  radiusMeters: number;

  @Field()
  densityLevel: string;

  @Field(() => Int)
  vehicleCount: number;
}
