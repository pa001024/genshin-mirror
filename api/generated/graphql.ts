import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Query = {
  __typename?: "Query";
  me?: Maybe<User>;
  userCharacters: Array<UserAvatar>;
  userWeapons: Array<UserWeapon>;
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  email: Scalars["String"];
  username: Scalars["String"];
  type: Scalars["Float"];
  pass: Scalars["String"];
  travelerGender: Scalars["Float"];
  platform: Scalars["String"];
  server: Scalars["String"];
  lastUpdate: Scalars["DateTime"];
  lastLogin: Scalars["DateTime"];
};

export type UserAvatar = {
  __typename?: "UserAvatar";
  id: Scalars["ID"];
  owner: User;
  avatarId: Scalars["String"];
  level: Scalars["Int"];
  promoteLevel: Scalars["Int"];
  talentLevel: Scalars["Int"];
  attackLevel: Scalars["Int"];
  eLevel: Scalars["Int"];
  qLevel: Scalars["Int"];
  artifacts?: Maybe<Array<UserArtifact>>;
  weapon?: Maybe<UserWeapon>;
};

export type UserArtifact = {
  __typename?: "UserArtifact";
  id: Scalars["ID"];
  owner: User;
  typeId: Scalars["Int"];
  level: Scalars["Int"];
  main: Scalars["Int"];
  attrs: Array<Attr>;
  score: Scalars["Float"];
};

export type Attr = {
  __typename?: "Attr";
  type: Scalars["Float"];
  value: Scalars["Float"];
};

export type UserWeapon = {
  __typename?: "UserWeapon";
  id: Scalars["ID"];
  owner: User;
  weaponId: Scalars["String"];
  level: Scalars["Int"];
  promoteLevel: Scalars["Int"];
  refineLevel: Scalars["Int"];
};

export type Mutation = {
  __typename?: "Mutation";
  signup: AuthInfo;
  login?: Maybe<AuthInfo>;
  logout?: Maybe<AuthInfo>;
  setUserCharacter: UserAvatar;
  removeUserCharacter: UserAvatar;
  setUserWeapon: UserWeapon;
  removeUserWeapon: UserWeapon;
};

export type MutationSignupArgs = {
  data: RegisterInput;
};

export type MutationLoginArgs = {
  password: Scalars["String"];
  email: Scalars["String"];
};

export type MutationSetUserCharacterArgs = {
  data: UserAvatarInput;
};

export type MutationRemoveUserCharacterArgs = {
  id: Scalars["String"];
};

export type MutationSetUserWeaponArgs = {
  data: UserWeaponInput;
};

export type MutationRemoveUserWeaponArgs = {
  id: Scalars["String"];
};

export type AuthInfo = {
  __typename?: "AuthInfo";
  code: Scalars["Float"];
  token?: Maybe<Scalars["String"]>;
  message?: Maybe<Scalars["String"]>;
};

export type RegisterInput = {
  username: Scalars["String"];
  email: Scalars["String"];
  password: Scalars["String"];
};

export type UserAvatarInput = {
  avatarId: Scalars["String"];
  level: Scalars["Float"];
  promoteLevel: Scalars["Float"];
  talentLevel: Scalars["Float"];
  attackLevel: Scalars["Float"];
  eLevel: Scalars["Float"];
  qLevel: Scalars["Float"];
};

export type UserWeaponInput = {
  weaponId: Scalars["String"];
  level: Scalars["Float"];
  promoteLevel: Scalars["Float"];
  refineLevel: Scalars["Float"];
};

export type LoginMutationVariables = Exact<{
  email: Scalars["String"];
  hash: Scalars["String"];
}>;

export type LoginMutation = { __typename?: "Mutation" } & { login?: Maybe<{ __typename?: "AuthInfo" } & Pick<AuthInfo, "code" | "token">> };

export type LogoutMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutation = { __typename?: "Mutation" } & { logout?: Maybe<{ __typename?: "AuthInfo" } & Pick<AuthInfo, "code">> };

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { __typename?: "Query" } & { me?: Maybe<{ __typename?: "User" } & Pick<User, "id" | "username">> };

export type SignupMutationVariables = Exact<{
  data: RegisterInput;
}>;

export type SignupMutation = { __typename?: "Mutation" } & { signup: { __typename?: "AuthInfo" } & Pick<AuthInfo, "code" | "token" | "message"> };

export type UserCharactersQueryVariables = Exact<{ [key: string]: never }>;

export type UserCharactersQuery = { __typename?: "Query" } & {
  userCharacters: Array<
    { __typename?: "UserAvatar" } & Pick<UserAvatar, "id" | "avatarId" | "level" | "promoteLevel" | "talentLevel" | "attackLevel" | "eLevel" | "qLevel"> & {
        artifacts?: Maybe<Array<{ __typename?: "UserArtifact" } & Pick<UserArtifact, "typeId">>>;
      }
  >;
};

export type SetUserCharacterMutationVariables = Exact<{
  data: UserAvatarInput;
}>;

export type SetUserCharacterMutation = { __typename?: "Mutation" } & { setUserCharacter: { __typename?: "UserAvatar" } & Pick<UserAvatar, "id" | "avatarId"> };

export type RemoveUserCharacterMutationVariables = Exact<{
  id: Scalars["String"];
}>;

export type RemoveUserCharacterMutation = { __typename?: "Mutation" } & { removeUserCharacter: { __typename?: "UserAvatar" } & Pick<UserAvatar, "id"> };

export type UserWeaponsQueryVariables = Exact<{ [key: string]: never }>;

export type UserWeaponsQuery = { __typename?: "Query" } & {
  userWeapons: Array<
    { __typename?: "UserWeapon" } & Pick<UserWeapon, "id" | "weaponId" | "level" | "promoteLevel" | "refineLevel"> & {
        owner: { __typename?: "User" } & Pick<User, "id">;
      }
  >;
};

export type SetUserWeaponMutationVariables = Exact<{
  data: UserWeaponInput;
}>;

export type SetUserWeaponMutation = { __typename?: "Mutation" } & { setUserWeapon: { __typename?: "UserWeapon" } & Pick<UserWeapon, "id" | "weaponId"> };

export type RemoveUserWeaponMutationVariables = Exact<{
  id: Scalars["String"];
}>;

export type RemoveUserWeaponMutation = { __typename?: "Mutation" } & { removeUserWeapon: { __typename?: "UserWeapon" } & Pick<UserWeapon, "id"> };

export const LoginDocument = gql`
  mutation Login($email: String!, $hash: String!) {
    login(email: $email, password: $hash) {
      code
      token
    }
  }
`;
export const LogoutDocument = gql`
  mutation Logout {
    logout {
      code
    }
  }
`;
export const MeDocument = gql`
  query Me {
    me {
      id
      username
    }
  }
`;
export const SignupDocument = gql`
  mutation Signup($data: RegisterInput!) {
    signup(data: $data) {
      code
      token
      message
    }
  }
`;
export const UserCharactersDocument = gql`
  query UserCharacters {
    userCharacters {
      id
      avatarId
      level
      promoteLevel
      talentLevel
      attackLevel
      eLevel
      qLevel
      artifacts {
        typeId
      }
    }
  }
`;
export const SetUserCharacterDocument = gql`
  mutation SetUserCharacter($data: UserAvatarInput!) {
    setUserCharacter(data: $data) {
      id
      avatarId
    }
  }
`;
export const RemoveUserCharacterDocument = gql`
  mutation RemoveUserCharacter($id: String!) {
    removeUserCharacter(id: $id) {
      id
    }
  }
`;
export const UserWeaponsDocument = gql`
  query UserWeapons {
    userWeapons {
      id
      owner {
        id
      }
      weaponId
      level
      promoteLevel
      refineLevel
    }
  }
`;
export const SetUserWeaponDocument = gql`
  mutation SetUserWeapon($data: UserWeaponInput!) {
    setUserWeapon(data: $data) {
      id
      weaponId
    }
  }
`;
export const RemoveUserWeaponDocument = gql`
  mutation RemoveUserWeapon($id: String!) {
    removeUserWeapon(id: $id) {
      id
    }
  }
`;
