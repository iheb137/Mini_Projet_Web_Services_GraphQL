import { ObjectType, Field } from '@nestjs/graphql';
import { UserType } from './user.type';

@ObjectType()
export class AuthResponseType {
  @Field(() => UserType)
  user: UserType;

  @Field()
  access_token: string;
}
