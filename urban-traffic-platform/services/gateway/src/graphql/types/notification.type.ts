import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class NotificationType {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  message: string;

  @Field()
  type: string;

  @Field()
  isRead: boolean;

  @Field({ nullable: true })
  userId?: string;

  @Field()
  createdAt: Date;
}
