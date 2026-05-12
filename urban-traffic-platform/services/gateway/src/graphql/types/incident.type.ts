import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class IncidentType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  type: string;

  @Field()
  status: string;

  @Field(() => Float)
  latitude: number;

  @Field(() => Float)
  longitude: number;

  @Field({ nullable: true })
  zoneId?: string;

  @Field()
  reportedBy: string;

  @Field()
  createdAt: Date;
}
