import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class StatsType {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  resolvedToday: number;
}
